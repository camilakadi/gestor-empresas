import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import SearchIcon from "@mui/icons-material/Search";
import {
  Box,
  Button,
  Container,
  Grid,
  Snackbar,
  TextField,
  Typography,
} from "@mui/material";
import Alert from "@mui/material/Alert";
import { useRouter } from "next/router";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";

type FormValues = {
  cnpj: string;
  razaoSocial: string;
  nomeFantasia: string;
  cep: string;
  estado: string;
  municipio: string;
  logradouro: string;
  numero: string;
  complemento: string;
};

type FormErrors = Partial<Record<keyof FormValues, string>>;

const onlyDigits = (value: string): string => {
  return value.replace(/\D+/g, "");
};

const isValidCNPJ = (input: string): boolean => {
  const digits = onlyDigits(input);
  if (digits.length !== 14) return false;
  if (/^(\d)\1{13}$/.test(digits)) return false;

  const calculateCheckDigit = (base: string, factors: number[]): number => {
    const sum = base
      .split("")
      .map((n, i) => parseInt(n, 10) * factors[i])
      .reduce((acc, n) => acc + n, 0);
    const remainder = sum % 11;
    return remainder < 2 ? 0 : 11 - remainder;
  };

  const base12 = digits.slice(0, 12);
  const d1 = calculateCheckDigit(base12, [5, 4, 3, 2, 9, 8, 7, 6, 5, 4, 3, 2]);
  const base13 = base12 + d1.toString();
  const d2 = calculateCheckDigit(
    base13,
    [6, 5, 4, 3, 2, 9, 8, 7, 6, 5, 4, 3, 2]
  );

  return digits.endsWith(`${d1}${d2}`);
};

const formatCNPJ = (value: string): string => {
  const digits = onlyDigits(value).slice(0, 14);
  if (digits.length <= 2) return digits;
  if (digits.length <= 5) return `${digits.slice(0, 2)}.${digits.slice(2)}`;
  if (digits.length <= 8)
    return `${digits.slice(0, 2)}.${digits.slice(2, 5)}.${digits.slice(5)}`;
  if (digits.length <= 12)
    return `${digits.slice(0, 2)}.${digits.slice(2, 5)}.${digits.slice(
      5,
      8
    )}/${digits.slice(8)}`;
  return `${digits.slice(0, 2)}.${digits.slice(2, 5)}.${digits.slice(
    5,
    8
  )}/${digits.slice(8, 12)}-${digits.slice(12)}`;
};

const formatCEP = (value: string): string => {
  const digits = onlyDigits(value).slice(0, 8);
  if (digits.length <= 5) return digits;
  return `${digits.slice(0, 5)}-${digits.slice(5)}`;
};

const CadastroEmpresaPage = () => {
  const router = useRouter();
  const [values, setValues] = useState<FormValues>({
    cnpj: "",
    razaoSocial: "",
    nomeFantasia: "",
    cep: "",
    estado: "",
    municipio: "",
    logradouro: "",
    numero: "",
    complemento: "",
  });

  const [errors, setErrors] = useState<FormErrors>({});
  const [submitted, setSubmitted] = useState(false);
  const [lookupLoading, setLookupLoading] = useState(false);
  const [cepLoading, setCepLoading] = useState(false);
  const [submitLoading, setSubmitLoading] = useState(false);
  const [globalError, setGlobalError] = useState<string | null>(null);
  const lastCepSearched = useRef<string>("");

  type CNPJFromApi = {
    cnpj: string;
    nomeFantasia: string;
    razaoSocial: string;
    descricaoSituacaoCadastral: string;
    logradouro: string;
    numero: string;
    bairro: string;
    complemento: string;
    municipio: string;
    uf: string;
    cep: string;
    codigoMunicipioIbge: number;
  };

  const canSubmit = useMemo(() => {
    const requiredFilled = [
      values.cnpj,
      values.razaoSocial,
      values.nomeFantasia,
      values.cep,
      values.estado,
      values.municipio,
    ].every((v) => v.trim().length > 0);
    return requiredFilled;
  }, [values]);

  const setField = useCallback(
    <K extends keyof FormValues>(key: K, val: FormValues[K]) => {
      setValues((prev) => ({ ...prev, [key]: val }));
    },
    []
  ) as <K extends keyof FormValues>(key: K, val: FormValues[K]) => void;

  const validateField = useCallback(
    <K extends keyof FormValues>(key: K, val: FormValues[K]): string => {
      const v = typeof val === "string" ? val.trim() : (val as string);
      switch (key) {
        case "cnpj": {
          if (!v) return "CNPJ é obrigatório";
          if (!isValidCNPJ(v)) return "CNPJ inválido";
          return "";
        }
        case "razaoSocial": {
          if (!v) return "Razão Social é obrigatória";
          if (v.length > 100) return "Máximo de 100 caracteres";
          return "";
        }
        case "nomeFantasia": {
          if (!v) return "Nome Fantasia é obrigatório";
          if (v.length > 100) return "Máximo de 100 caracteres";
          return "";
        }
        case "cep": {
          if (!v) return "CEP é obrigatório";
          const cepDigits = onlyDigits(v);
          if (cepDigits.length !== 8) return "CEP deve ter 8 dígitos";
          return "";
        }
        case "estado": {
          if (!v) return "Estado é obrigatório";
          if (v.length > 2) return "Máximo de 2 caracteres";
          return "";
        }
        case "municipio": {
          if (!v) return "Município é obrigatório";
          return "";
        }
        case "logradouro": {
          return "";
        }
        case "numero": {
          if (!v) return "";
          const num = Number(v);
          if (!Number.isFinite(num)) return "Número inválido";
          if (!Number.isInteger(num)) return "Somente números inteiros";
          if (num < 0) return "Sem negativos";
          return "";
        }
        case "complemento": {
          if (v.length > 300) return "Máximo de 300 caracteres";
          return "";
        }
        default:
          return "";
      }
    },
    []
  ) as <K extends keyof FormValues>(key: K, val: FormValues[K]) => string;

  const validateAll = useCallback((): FormErrors => {
    const next: FormErrors = {};
    (Object.keys(values) as (keyof FormValues)[]).forEach((k) => {
      const msg = validateField(k, values[k]);
      if (msg) next[k] = msg;
    });
    return next;
  }, [values, validateField]);

  const handleBlur = useCallback(
    <K extends keyof FormValues>(key: K) => {
      const message = validateField(key, values[key]);
      setErrors((prev) => ({ ...prev, [key]: message || undefined }));
    },
    [values, validateField]
  ) as <K extends keyof FormValues>(key: K) => void;

  const handleLookupCEP = useCallback(
    async (cep: string, forceUpdate = false) => {
      const cepDigits = onlyDigits(cep);
      if (cepDigits.length !== 8) return;

      if (forceUpdate) {
        setValues((prev) => ({
          ...prev,
          logradouro: "",
          municipio: "",
          estado: "",
          complemento: "",
        }));
      }

      setCepLoading(true);
      try {
        const res = await fetch(`https://viacep.com.br/ws/${cepDigits}/json/`);

        if (!res.ok) {
          throw new Error(`Erro ao consultar CEP (status ${res.status})`);
        }

        const data = await res.json();

        if (data.erro) {
          throw new Error(`CEP ${cep} não encontrado.`);
        }

        setValues((prev) => ({
          ...prev,
          logradouro: forceUpdate
            ? data.logradouro || prev.logradouro || ""
            : prev.logradouro || data.logradouro || "",
          municipio: forceUpdate
            ? data.localidade || prev.municipio || ""
            : prev.municipio || data.localidade || "",
          estado: forceUpdate
            ? (data.uf || prev.estado || "").toUpperCase()
            : prev.estado || (data.uf || "").toUpperCase(),
          complemento: forceUpdate
            ? data.complemento || prev.complemento || ""
            : prev.complemento || data.complemento || "",
        }));

        setErrors((prev) => ({
          ...prev,
          logradouro: undefined,
          municipio: undefined,
          estado: undefined,
        }));
      } catch (e) {
        const errorMessage =
          e instanceof Error ? e.message : "Erro desconhecido ao consultar CEP";
        setGlobalError(errorMessage);

        setValues((prev) => ({
          ...prev,
          logradouro: "",
          municipio: "",
          estado: "",
          complemento: "",
        }));
      } finally {
        setCepLoading(false);
      }
    },
    []
  );

  useEffect(() => {
    const cepDigits = onlyDigits(values.cep);
    if (
      cepDigits.length === 8 &&
      !cepLoading &&
      cepDigits !== lastCepSearched.current
    ) {
      lastCepSearched.current = cepDigits;
      const timeoutId = setTimeout(() => {
        handleLookupCEP(values.cep, true);
      }, 300);

      return () => clearTimeout(timeoutId);
    }
  }, [values.cep, cepLoading, handleLookupCEP]);

  const handleSubmit = useCallback(
    (e: React.FormEvent) => {
      e.preventDefault();
      setGlobalError(null);
      const nextErrors = validateAll();
      setErrors(nextErrors);
      if (Object.keys(nextErrors).length > 0) return;
      setSubmitLoading(true);

      const payload = {
        cnpj: values.cnpj,
        razaoSocial: values.razaoSocial,
        nomeFantasia: values.nomeFantasia,
        cep: values.cep,
        estado: values.estado.toUpperCase(),
        municipio: values.municipio,
        logradouro: values.logradouro,
        numero: values.numero ? Number(values.numero) : undefined,
        complemento: values.complemento || undefined,
      };

      const webhookUrl = process.env.NEXT_PUBLIC_COMPANIES_API_URL || "";
      fetch(webhookUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${process.env.NEXT_PUBLIC_API_TOKEN}`,
        },
        body: JSON.stringify(payload),
      })
        .then(async (res) => {
          if (!res.ok) {
            const text = await res.text().catch(() => "");
            throw new Error(text || `Erro ao cadastrar (status ${res.status})`);
          }
          setSubmitted(true);
          setTimeout(() => {
            router.push("/");
          }, 1500);
        })
        .catch((err: unknown) => {
          const message =
            err instanceof Error ? err.message : "Falha ao enviar formulário";
          setGlobalError(message);
        })
        .finally(() => setSubmitLoading(false));
    },
    [values, validateAll, router]
  );

  const handleLookupCNPJ = useCallback(async () => {
    setGlobalError(null);
    setErrors((prev) => ({ ...prev, cnpj: undefined }));
    const cnpjMsg = validateField("cnpj", values.cnpj);
    if (cnpjMsg) {
      setErrors((prev) => ({ ...prev, cnpj: cnpjMsg }));
      setGlobalError("Informe um CNPJ válido para buscar");
      return;
    }

    setValues((prev) => ({
      ...prev,
      razaoSocial: "",
      nomeFantasia: "",
      cep: "",
      estado: "",
      municipio: "",
      logradouro: "",
      numero: "",
      complemento: "",
    }));

    setLookupLoading(true);
    try {
      const apiKey = process.env.NEXT_PUBLIC_CNPJ_API_KEY || "";
      const res = await fetch("https://api.arkmeds.com/cnpj", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-api-key": apiKey,
        },
        body: JSON.stringify({ cnpj: onlyDigits(values.cnpj) }),
      });

      if (!res.ok) {
        let errorMessage = "";
        try {
          const contentType = res.headers.get("content-type") || "";
          if (contentType.includes("application/json")) {
            const errJson = await res.json();
            errorMessage =
              errJson?.message || errJson?.error || errJson?.detail || "";
          } else {
            errorMessage = await res.text();
          }
        } catch {}

        const normalized = (errorMessage || "").toLowerCase();
        const hasNotFoundMsg = normalized.includes("não encontrado");
        if (res.status === 404 || hasNotFoundMsg) {
          errorMessage = `CNPJ ${values.cnpj} não encontrado.`;
        }

        throw new Error(
          errorMessage || `Falha na consulta de CNPJ (status ${res.status})`
        );
      }

      const data: CNPJFromApi = await res.json();

      setValues((prev) => ({
        ...prev,
        razaoSocial: data.razaoSocial || "",
        nomeFantasia: data.nomeFantasia || "",
        cep: data.cep ? formatCEP(data.cep) : "",
        estado: (data.uf || "").toUpperCase(),
        municipio: data.municipio || "",
        logradouro: data.logradouro || "",
        numero: data.numero || "",
        complemento: data.complemento || "",
      }));

      setErrors((prev) => ({
        ...prev,
        razaoSocial: undefined,
        nomeFantasia: undefined,
        cep: undefined,
        estado: undefined,
        municipio: undefined,
        logradouro: undefined,
        numero: undefined,
        complemento: undefined,
      }));

      if (data.cep) {
        await handleLookupCEP(data.cep, true);
      }
    } catch (e) {
      const message =
        e instanceof Error ? e.message : "Erro desconhecido ao consultar CNPJ";
      setGlobalError(message);
    } finally {
      setLookupLoading(false);
    }
  }, [values.cnpj, validateField, handleLookupCEP]);

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Box
        sx={{
          mb: 4,
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <Typography
          variant="h1"
          component="h1"
          gutterBottom
          sx={{ color: "primary.dark" }}
        >
          Cadastro de empresa
        </Typography>
        <Button
          variant="contained"
          color="primary"
          href="/"
          startIcon={<ArrowBackIcon />}
        >
          Voltar
        </Button>
      </Box>

      <Box component="form" noValidate onSubmit={handleSubmit}>
        <Grid container spacing={2}>
          <Grid
            size={{ xs: 12, sm: 6 }}
            sx={{
              display: "grid",
              gridTemplateColumns: "1fr auto",
              gap: 2,
            }}
          >
            <TextField
              label="CNPJ"
              required
              value={values.cnpj}
              onChange={(e) => setField("cnpj", formatCNPJ(e.target.value))}
              onBlur={() => handleBlur("cnpj")}
              error={Boolean(errors.cnpj)}
              helperText={errors.cnpj}
              slotProps={{ htmlInput: { inputMode: "numeric" } }}
            />

            <Button
              variant="contained"
              color="secondary"
              onClick={handleLookupCNPJ}
              disabled={
                lookupLoading || !values.cnpj || !isValidCNPJ(values.cnpj)
              }
              startIcon={<SearchIcon />}
              sx={{ height: "56px" }}
            >
              {lookupLoading ? "Buscando..." : "Buscar CNPJ"}
            </Button>
          </Grid>

          <Grid size={{ xs: 12 }}>
            <TextField
              label="Razão Social"
              required
              fullWidth
              value={values.razaoSocial}
              onChange={(e) => setField("razaoSocial", e.target.value)}
              onBlur={() => handleBlur("razaoSocial")}
              error={Boolean(errors.razaoSocial)}
              helperText={errors.razaoSocial}
              placeholder={lookupLoading ? "Carregando..." : ""}
              slotProps={{ htmlInput: { maxLength: 100 } }}
              disabled={lookupLoading}
            />
          </Grid>

          <Grid size={{ xs: 12 }}>
            <TextField
              label="Nome Fantasia"
              required
              fullWidth
              value={values.nomeFantasia}
              onChange={(e) => setField("nomeFantasia", e.target.value)}
              onBlur={() => handleBlur("nomeFantasia")}
              error={Boolean(errors.nomeFantasia)}
              helperText={errors.nomeFantasia}
              placeholder={lookupLoading ? "Carregando..." : ""}
              slotProps={{ htmlInput: { maxLength: 100 } }}
              disabled={lookupLoading}
            />
          </Grid>

          <Grid size={{ xs: 12, sm: 4 }}>
            <TextField
              label="CEP"
              required
              fullWidth
              value={values.cep}
              onChange={(e) => setField("cep", formatCEP(e.target.value))}
              onBlur={() => handleBlur("cep")}
              error={Boolean(errors.cep)}
              helperText={
                errors.cep || (cepLoading ? "Buscando endereço..." : "")
              }
              placeholder={lookupLoading ? "Carregando..." : ""}
              slotProps={{ htmlInput: { maxLength: 9 } }}
              disabled={cepLoading || lookupLoading}
            />
          </Grid>

          <Grid size={{ xs: 12, sm: 2 }}>
            <TextField
              label="Estado"
              required
              fullWidth
              value={values.estado}
              onChange={(e) => setField("estado", e.target.value.toUpperCase())}
              onBlur={() => handleBlur("estado")}
              error={Boolean(errors.estado)}
              helperText={errors.estado}
              placeholder={lookupLoading || cepLoading ? "Carregando..." : ""}
              slotProps={{
                htmlInput: {
                  maxLength: 2,
                  style: { textTransform: "uppercase" },
                },
              }}
              disabled={cepLoading || lookupLoading}
            />
          </Grid>

          <Grid size={{ xs: 12, sm: 6 }}>
            <TextField
              label="Município"
              required
              fullWidth
              value={values.municipio}
              onChange={(e) => setField("municipio", e.target.value)}
              onBlur={() => handleBlur("municipio")}
              error={Boolean(errors.municipio)}
              helperText={errors.municipio}
              placeholder={lookupLoading || cepLoading ? "Carregando..." : ""}
              disabled={cepLoading || lookupLoading}
            />
          </Grid>

          <Grid size={{ xs: 12, sm: 9 }}>
            <TextField
              label="Logradouro"
              fullWidth
              value={values.logradouro}
              onChange={(e) => setField("logradouro", e.target.value)}
              onBlur={() => handleBlur("logradouro")}
              error={Boolean(errors.logradouro)}
              helperText={errors.logradouro}
              placeholder={lookupLoading || cepLoading ? "Carregando..." : ""}
              disabled={cepLoading || lookupLoading}
            />
          </Grid>

          <Grid size={{ xs: 12, sm: 3 }}>
            <TextField
              label="Número"
              type="number"
              fullWidth
              value={values.numero}
              onChange={(e) => setField("numero", e.target.value)}
              onBlur={() => handleBlur("numero")}
              error={Boolean(errors.numero)}
              helperText={errors.numero || "Somente inteiros, sem negativos"}
              placeholder={lookupLoading ? "Carregando..." : ""}
              slotProps={{
                htmlInput: { inputMode: "numeric", step: 1, min: 0 },
              }}
              disabled={lookupLoading}
            />
          </Grid>

          <Grid size={{ xs: 12 }}>
            <TextField
              label="Complemento"
              fullWidth
              value={values.complemento}
              onChange={(e) => setField("complemento", e.target.value)}
              onBlur={() => handleBlur("complemento")}
              error={Boolean(errors.complemento)}
              helperText={errors.complemento}
              placeholder={lookupLoading || cepLoading ? "Carregando..." : ""}
              slotProps={{ htmlInput: { maxLength: 300 } }}
              disabled={cepLoading || lookupLoading}
            />
          </Grid>

          <Grid size={{ xs: 12 }}>
            <Box
              sx={{
                display: "flex",
                gap: 2,
                justifyContent: "flex-end",
                mt: 1,
              }}
            >
              <Button variant="outlined" href="/">
                Cancelar
              </Button>
              <Button
                type="submit"
                variant="contained"
                disabled={!canSubmit || submitLoading}
              >
                {submitLoading ? "Salvando..." : "Salvar"}
              </Button>
            </Box>
          </Grid>

          <Snackbar
            open={Boolean(globalError)}
            autoHideDuration={5000}
            onClose={() => setGlobalError(null)}
            anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
          >
            <Alert
              onClose={() => setGlobalError(null)}
              severity="error"
              variant="filled"
              sx={{ width: "100%" }}
            >
              {globalError}
            </Alert>
          </Snackbar>

          <Snackbar
            open={submitted}
            autoHideDuration={4000}
            onClose={() => setSubmitted(false)}
            anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
          >
            <Alert
              onClose={() => setSubmitted(false)}
              severity="success"
              variant="filled"
              sx={{ width: "100%" }}
            >
              Empresa cadastrada com sucesso!
            </Alert>
          </Snackbar>
        </Grid>
      </Box>
    </Container>
  );
};

export default CadastroEmpresaPage;
