import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import {
  Box,
  Button,
  Container,
  Grid,
  TextField,
  Typography,
} from "@mui/material";
import { useMemo, useState } from "react";

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

function onlyDigits(value: string): string {
  return value.replace(/\D+/g, "");
}

function isValidCNPJ(input: string): boolean {
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
}

function formatCNPJ(value: string): string {
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
}

export default function CadastroEmpresaPage() {
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

  function setField<K extends keyof FormValues>(key: K, val: FormValues[K]) {
    setValues((prev) => ({ ...prev, [key]: val }));
  }

  function validateField<K extends keyof FormValues>(
    key: K,
    val: FormValues[K]
  ): string {
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
        if (v.length > 100) return "Máximo de 100 caracteres";
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
  }

  function validateAll(): FormErrors {
    const next: FormErrors = {};
    (Object.keys(values) as (keyof FormValues)[]).forEach((k) => {
      const msg = validateField(k, values[k]);
      if (msg) next[k] = msg;
    });
    return next;
  }

  function handleBlur<K extends keyof FormValues>(key: K) {
    const message = validateField(key, values[key]);
    setErrors((prev) => ({ ...prev, [key]: message || undefined }));
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const nextErrors = validateAll();
    setErrors(nextErrors);
    if (Object.keys(nextErrors).length > 0) return;
    setSubmitted(true);

    console.log("Empresa cadastrada:", {
      ...values,
      cnpj: onlyDigits(values.cnpj),
      estado: values.estado.toUpperCase(),
      numero: values.numero ? Number(values.numero) : undefined,
    });
  }

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
          <Grid size={{ xs: 12, sm: 12 }}>
            <TextField
              label="CNPJ"
              required
              fullWidth
              value={values.cnpj}
              onChange={(e) => setField("cnpj", formatCNPJ(e.target.value))}
              onBlur={() => handleBlur("cnpj")}
              error={Boolean(errors.cnpj)}
              helperText={errors.cnpj}
              inputProps={{ inputMode: "numeric" }}
            />
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
              inputProps={{ maxLength: 100 }}
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
              inputProps={{ maxLength: 100 }}
            />
          </Grid>

          <Grid size={{ xs: 12, sm: 4 }}>
            <TextField
              label="CEP"
              required
              fullWidth
              value={values.cep}
              onChange={(e) => setField("cep", e.target.value)}
              onBlur={() => handleBlur("cep")}
              error={Boolean(errors.cep)}
              helperText={errors.cep}
              inputProps={{ maxLength: 100 }}
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
              inputProps={{
                maxLength: 2,
                style: { textTransform: "uppercase" },
              }}
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
              inputProps={{ inputMode: "numeric", step: 1, min: 0 }}
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
              inputProps={{ maxLength: 300 }}
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
              <Button type="submit" variant="contained" disabled={!canSubmit}>
                Salvar
              </Button>
            </Box>
          </Grid>

          {submitted && (
            <Grid size={{ xs: 12 }}>
              <Typography color="success.main" sx={{ mt: 2 }}>
                Empresa validada com sucesso! (simulação)
              </Typography>
            </Grid>
          )}
        </Grid>
      </Box>
    </Container>
  );
}
