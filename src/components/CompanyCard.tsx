"use client";

import { Empresa } from "@/types/company";
import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Divider from "@mui/material/Divider";
import Typography from "@mui/material/Typography";

interface CompanyCardProps {
  empresa: Empresa;
}

export default function CompanyCard({ empresa }: CompanyCardProps) {
  return (
    <Card sx={{ height: "100%" }}>
      <CardContent>
        <Box>
          <Typography
            variant="h5"
            component="h3"
            gutterBottom
            sx={{ fontWeight: 600, color: "primary.dark" }}
          >
            {empresa.razao_social}
          </Typography>
          {empresa.nome_fantasia && (
            <Typography
              variant="h6"
              component="h6"
              color="text.secondary"
              sx={{ fontStyle: "italic", mb: 2 }}
            >
              {empresa.nome_fantasia}
            </Typography>
          )}
        </Box>
        <Divider sx={{ my: 2 }} />
        <Box sx={{ display: "flex", flexDirection: "column", gap: 1.5 }}>
          <Box>
            <Typography
              variant="caption"
              color="text.secondary"
              sx={{ fontWeight: 600 }}
            >
              CNPJ:
            </Typography>
            <Typography variant="body2" sx={{ wordBreak: "break-word" }}>
              {empresa.cnpj}
            </Typography>
          </Box>
          <Box>
            <Typography
              variant="caption"
              color="text.secondary"
              sx={{ fontWeight: 600 }}
            >
              Município/Estado:
            </Typography>
            <Typography variant="body2">
              {empresa.municipio}/{empresa.estado}
            </Typography>
          </Box>
        </Box>
      </CardContent>
    </Card>
  );
}
