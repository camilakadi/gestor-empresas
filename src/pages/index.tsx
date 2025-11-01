import CompanyCard from "@/components/CompanyCard";
import RendimentoModal from "@/components/RendimentoModal";
import { Empresa } from "@/types/company";
import AssignmentAddIcon from "@mui/icons-material/AssignmentAdd";
import {
  Alert,
  Box,
  Button,
  CircularProgress,
  Container,
  Typography,
} from "@mui/material";
import { useCallback, useEffect, useMemo, useState } from "react";

const Home = () => {
  const [empresas, setEmpresas] = useState<Empresa[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedEmpresa, setSelectedEmpresa] = useState<Empresa | null>(null);

  const API_URL = useMemo(() => process.env.NEXT_PUBLIC_API_URL || "", []);
  const TOKEN = useMemo(() => process.env.NEXT_PUBLIC_API_TOKEN || "", []);

  const fetchCompanies = useCallback(async () => {
    try {
      setLoading(true);
      const response = await fetch(API_URL, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${TOKEN}`,
        },
      });

      if (!response.ok) {
        throw new Error(`Erro ao buscar empresas: ${response.statusText}`);
      }

      const data = await response.json();
      setEmpresas(data);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erro desconhecido");
      console.error("Erro ao buscar empresas:", err);
    } finally {
      setLoading(false);
    }
  }, [API_URL, TOKEN]);

  useEffect(() => {
    fetchCompanies();
  }, [fetchCompanies]);

  const handleOpenModal = useCallback((empresa: Empresa) => {
    setSelectedEmpresa(empresa);
    setModalOpen(true);
  }, []);

  const handleCloseModal = useCallback(() => {
    setModalOpen(false);
    setSelectedEmpresa(null);
  }, []);

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
          Empresas
        </Typography>
        <Button
          variant="contained"
          color="primary"
          href="/cadastro"
          startIcon={<AssignmentAddIcon />}
        >
          Cadastrar
        </Button>
      </Box>

      {loading && (
        <Box
          display="flex"
          justifyContent="center"
          alignItems="center"
          minHeight="400px"
        >
          <CircularProgress size={60} />
        </Box>
      )}

      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
      )}

      {!loading && !error && (
        <>
          {empresas.length === 0 ? (
            <Alert severity="info">Nenhuma empresa encontrada.</Alert>
          ) : (
            <Box
              sx={{
                display: "grid",
                gridTemplateColumns: {
                  xs: "1fr",
                  sm: "repeat(2, 1fr)",
                  md: "repeat(3, 1fr)",
                },
                gap: 3,
              }}
            >
              {empresas.map((empresa, index) => (
                <CompanyCard
                  key={index}
                  empresa={empresa}
                  onClick={handleOpenModal}
                />
              ))}
            </Box>
          )}
        </>
      )}
      <RendimentoModal
        open={modalOpen}
        empresa={selectedEmpresa}
        onClose={handleCloseModal}
      />
    </Container>
  );
};

export default Home;
