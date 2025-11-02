describe("Cadastro de Empresa com Busca de CNPJ", () => {
  beforeEach(() => {
    cy.visit("/cadastro");
  });

  it("deve preencher o formulário manualmente sem buscar CNPJ", () => {
    cy.contains("label", "CNPJ")
      .parent()
      .find("input")
      .clear()
      .type("34028316000103");
    cy.waitForMUI();

    cy.contains("label", "CNPJ")
      .parent()
      .find("input")
      .should("have.value", "34.028.316/0001-03");

    cy.contains("label", "Razão Social")
      .parent()
      .find("input")
      .clear()
      .type("Empresa Teste LTDA");

    cy.contains("label", "Nome Fantasia")
      .parent()
      .find("input")
      .clear()
      .type("Empresa Teste");

    cy.contains("label", "CEP").parent().find("input").clear().type("01310100");

    cy.wait(1000);

    cy.contains("label", "Estado").parent().find("input").clear().type("SP");

    cy.contains("label", "Município")
      .parent()
      .find("input")
      .clear()
      .type("São Paulo");

    cy.contains("label", "Logradouro")
      .parent()
      .find("input")
      .clear()
      .type("Avenida Paulista");

    cy.contains("label", "Número").parent().find("input").clear().type("1000");

    cy.contains("button", "Salvar").should("not.be.disabled");
  });

  it("deve buscar dados do CNPJ pela API e preencher o formulário automaticamente", () => {
    cy.intercept("POST", "https://api.arkmeds.com/cnpj", {
      statusCode: 200,
      body: {
        cnpj: "34028316000103",
        razaoSocial: "Empresa Buscada LTDA",
        nomeFantasia: "Empresa Buscada",
        cep: "01310100",
        uf: "SP",
        municipio: "São Paulo",
        logradouro: "Avenida Paulista",
        numero: "500",
        complemento: "Sala 10",
      },
    }).as("getCNPJData");

    cy.intercept("GET", "https://viacep.com.br/ws/**", {
      statusCode: 200,
      body: {
        cep: "01310-100",
        logradouro: "Avenida Paulista",
        complemento: "",
        bairro: "Bela Vista",
        localidade: "São Paulo",
        uf: "SP",
        erro: false,
      },
    }).as("getCEP");

    cy.contains("label", "CNPJ")
      .parent()
      .find("input")
      .clear()
      .type("34028316000103");

    cy.waitForMUI();
    cy.contains("label", "CNPJ")
      .parent()
      .find("input")
      .should("have.value", "34.028.316/0001-03");

    cy.contains("button", "Buscar CNPJ").should("not.be.disabled");
    cy.wait(200);

    cy.contains("button", "Buscar CNPJ").click();

    cy.wait("@getCNPJData");
    cy.wait("@getCEP");

    cy.contains("label", "Razão Social")
      .parent()
      .find("input")
      .should("have.value", "Empresa Buscada LTDA");

    cy.contains("label", "Nome Fantasia")
      .parent()
      .find("input")
      .should("have.value", "Empresa Buscada");

    cy.contains("label", "CEP")
      .parent()
      .find("input")
      .should("have.value", "01310-100");

    cy.contains("label", "Estado")
      .parent()
      .find("input")
      .should("have.value", "SP");

    cy.contains("label", "Município")
      .parent()
      .find("input")
      .should("have.value", "São Paulo");

    cy.contains("button", "Salvar").should("not.be.disabled");
  });

  it("deve formatar o CNPJ automaticamente durante a digitação", () => {
    cy.contains("label", "CNPJ")
      .parent()
      .find("input")
      .clear()
      .type("34028316000103");

    cy.contains("label", "CNPJ")
      .parent()
      .find("input")
      .should("have.value", "34.028.316/0001-03");
  });

  it("deve formatar o CEP automaticamente durante a digitação", () => {
    cy.contains("label", "CEP").parent().find("input").clear().type("01310100");

    cy.contains("label", "CEP")
      .parent()
      .find("input")
      .should("have.value", "01310-100");
  });

  it("deve validar campos obrigatórios", () => {
    cy.contains("button", "Salvar").should("be.disabled");

    cy.contains("label", "CNPJ")
      .parent()
      .find("input")
      .clear()
      .type("12")
      .blur();

    cy.waitForMUI();

    cy.contains(/CNPJ.*inválido|CNPJ.*obrigatório/i).should("be.visible");
  });

  it("deve mostrar mensagem de sucesso após cadastrar empresa", () => {
    cy.intercept("POST", "**/companies/**", {
      statusCode: 200,
      body: { success: true },
    }).as("createCompany");

    cy.intercept("POST", "https://api.arkmeds.com/cnpj", {
      statusCode: 200,
      body: {
        cnpj: "34028316000103",
        razaoSocial: "Empresa para Cadastrar LTDA",
        nomeFantasia: "Empresa para Cadastrar",
        cep: "01310100",
        uf: "SP",
        municipio: "São Paulo",
        logradouro: "Avenida Paulista",
        numero: "1000",
      },
    }).as("getCNPJForSubmit");

    cy.intercept("GET", "https://viacep.com.br/ws/**", {
      statusCode: 200,
      body: {
        cep: "01310-100",
        logradouro: "Avenida Paulista",
        localidade: "São Paulo",
        uf: "SP",
      },
    }).as("getCEPForSubmit");

    cy.contains("label", "CNPJ")
      .parent()
      .find("input")
      .clear()
      .type("34028316000103");

    cy.waitForMUI();
    cy.contains("label", "CNPJ")
      .parent()
      .find("input")
      .should("have.value", "34.028.316/0001-03");

    cy.contains("button", "Buscar CNPJ").should("not.be.disabled");
    cy.wait(200);

    cy.contains("button", "Buscar CNPJ").click();
    cy.wait("@getCNPJForSubmit");
    cy.wait("@getCEPForSubmit");

    cy.wait(500);

    cy.contains("button", "Salvar").click();

    cy.wait("@createCompany");

    cy.contains("Empresa cadastrada com sucesso!").should("be.visible");

    cy.wait(2000);
  });

  it("deve mostrar erro ao buscar CNPJ inválido", () => {
    cy.intercept("POST", "https://api.arkmeds.com/cnpj", {
      statusCode: 404,
      body: {
        message: "CNPJ não encontrado",
      },
    }).as("getCNPJError");

    cy.contains("label", "CNPJ")
      .parent()
      .find("input")
      .clear()
      .type("34028316000103");

    cy.waitForMUI();
    cy.contains("label", "CNPJ")
      .parent()
      .find("input")
      .should("have.value", "34.028.316/0001-03");

    cy.contains("button", "Buscar CNPJ").should("not.be.disabled");
    cy.wait(200);

    cy.contains("button", "Buscar CNPJ").click();

    cy.wait("@getCNPJError");

    cy.contains(/erro|não encontrado/i).should("be.visible");
  });

  it("deve mostrar estado em maiúsculas automaticamente", () => {
    cy.contains("label", "Estado").parent().find("input").clear().type("sp");

    cy.contains("label", "Estado")
      .parent()
      .find("input")
      .should("have.value", "SP");
  });
});
