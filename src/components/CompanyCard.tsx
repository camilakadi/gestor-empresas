"use client";

import { Empresa } from "@/types/company";
import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Divider from "@mui/material/Divider";
import Typography from "@mui/material/Typography";
import { useCallback, useMemo } from "react";

interface CompanyCardProps {
  empresa: Empresa;
  onClick?: (empresa: Empresa) => void;
}

const CompanyCard = ({ empresa, onClick }: CompanyCardProps) => {
  const handleClick = useCallback(() => {
    if (onClick) {
      onClick(empresa);
    }
  }, [onClick, empresa]);

  const cardSx = useMemo(
    () => ({
      height: "100%",
      cursor: onClick ? "pointer" : "default",
      transition: "transform 0.1s ease-in-out",
      "&:hover": onClick ? { transform: "translateY(-2px)" } : undefined,
    }),
    [onClick]
  );

  return (
    <Card
      sx={cardSx}
      onClick={onClick ? handleClick : undefined}
      role={onClick ? "button" : undefined}
      tabIndex={onClick ? 0 : undefined}
    >
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
};

export default CompanyCard;
