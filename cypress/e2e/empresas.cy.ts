describe("Listagem de Empresas e Modal de Rendimento", () => {
  beforeEach(() => {
    cy.intercept("GET", "**/companies/**", {
      statusCode: 200,
      body: [
        {
          razao_social: "Empresa Teste LTDA",
          nome_fantasia: "Empresa Teste",
          cnpj: "12345678000190",
          estado: "SP",
          municipio: "São Paulo",
        },
        {
          razao_social: "Outra Empresa SA",
          nome_fantasia: "Outra Empresa",
          cnpj: "98765432000100",
          estado: "RJ",
          municipio: "Rio de Janeiro",
        },
      ],
    }).as("getCompanies");

    cy.intercept("GET", "**/companies/**/cnpj/**", {
      statusCode: 200,
      body: {
        valor_rendimento: 150000.50,
      },
    }).as("getRendimento");

    cy.visit("/");
    cy.wait("@getCompanies");
  });

  it("deve listar os cards de empresas", () => {
    cy.contains("h1", "Empresas").should("be.visible");

    cy.contains("Empresa Teste LTDA").should("be.visible");
    cy.contains("Outra Empresa SA").should("be.visible");

    cy.contains("12345678000190").should("be.visible");
    cy.contains("98765432000100").should("be.visible");

    cy.contains("São Paulo/SP").should("be.visible");
    cy.contains("Rio de Janeiro/RJ").should("be.visible");
  });

  it("deve abrir a modal ao clicar em um card e exibir o rendimento", () => {
    cy.contains("Empresa Teste LTDA").click();

    cy.get('[role="dialog"]').should("be.visible");

    cy.get('[role="dialog"]').within(() => {
      cy.contains("Empresa Teste LTDA").should("be.visible");
    });

    cy.wait("@getRendimento");

    cy.contains("Rendimento atual").should("be.visible");

    cy.contains(/R\$\s*[\d.,]+/).should("be.visible");

    cy.contains("button", "Fechar").should("be.visible");
  });

  it("deve fechar a modal ao clicar no botão Fechar", () => {
    cy.contains("Empresa Teste LTDA").click();
    cy.wait("@getRendimento");
    cy.get('[role="dialog"]').should("be.visible");

    cy.contains("button", "Fechar").click();

    cy.get('[role="dialog"]').should("not.exist");
  });

  it("deve mostrar loading durante o carregamento do rendimento", () => {
    cy.intercept("GET", "**/companies/**/cnpj/**", {
      statusCode: 200,
      body: {
        valor_rendimento: 150000.50,
      },
      delay: 500,
    }).as("getRendimentoDelayed");

    cy.visit("/");
    cy.wait("@getCompanies");

    cy.contains("Empresa Teste LTDA").click();

    cy.get('[role="dialog"]').should("be.visible");

    cy.get('[role="dialog"]').within(() => {
      cy.get('[role="progressbar"]').should("be.visible");
    });

    cy.wait("@getRendimentoDelayed");

    cy.contains("Rendimento atual").should("be.visible");
  });
});
