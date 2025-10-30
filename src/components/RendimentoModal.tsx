"use client";

import { Empresa } from "@/types/company";
import {
  Alert,
  Box,
  Button,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Typography,
} from "@mui/material";
import { useEffect, useState } from "react";

interface RendimentoModalProps {
  open: boolean;
  empresa: Empresa | null;
  onClose: () => void;
}

const API_URL = process.env.NEXT_PUBLIC_API_URL || "";
const TOKEN = process.env.NEXT_PUBLIC_API_TOKEN || "";

export default function RendimentoModal({
  open,
  empresa,
  onClose,
}: RendimentoModalProps) {
  const [rendimento, setRendimento] = useState<number | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchRendimento = async () => {
      if (!open || !empresa) return;

      setLoading(true);
      setError(null);
      setRendimento(null);

      const cnpj = empresa.cnpj
        .replaceAll(".", "")
        .replaceAll("-", "")
        .replaceAll("/", "");

      try {
        const url = `${API_URL}cnpj/${cnpj}`;
        const response = await fetch(url, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${TOKEN}`,
          },
        });
        if (!response.ok) {
          throw new Error(`Erro ao buscar rendimento: ${response.statusText}`);
        }
        const data = await response.json();
        const valor = typeof data === "number" ? data : data?.valor_rendimento;
        if (typeof valor !== "number") {
          throw new Error("Resposta inválida do servidor");
        }
        setRendimento(valor);
      } catch (e) {
        setError(
          e instanceof Error
            ? e.message
            : "Erro desconhecido ao carregar rendimento"
        );
      } finally {
        setLoading(false);
      }
    };

    fetchRendimento();
  }, [open, empresa]);

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
      <DialogTitle sx={{ color: "primary.dark" }}>
        {empresa ? empresa.razao_social : "Empresa"}
      </DialogTitle>

      <DialogContent>
        {loading && (
          <Box display="flex" justifyContent="center" py={4}>
            <CircularProgress />
          </Box>
        )}
        {error && <Alert severity="error">{error}</Alert>}
        {!loading && !error && rendimento !== null && (
          <Box py={1}>
            <Typography variant="subtitle1" color="text.secondary">
              Rendimento atual
            </Typography>
            <Typography variant="h4" sx={{ fontWeight: 700 }}>
              {new Intl.NumberFormat("pt-BR", {
                style: "currency",
                currency: "BRL",
              }).format(rendimento)}
            </Typography>
          </Box>
        )}
      </DialogContent>

      <DialogActions>
        <Button variant="contained" color="primary" onClick={onClose}>
          Fechar
        </Button>
      </DialogActions>
    </Dialog>
  );
}
