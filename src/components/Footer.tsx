"use client";

import { Box, Container, Typography } from "@mui/material";

const Footer = () => {
  return (
    <Box
      component="footer"
      sx={{
        mt: "auto",
        py: 2,
        backgroundColor: "primary.dark",
        color: "white",
      }}
    >
      <Container maxWidth="lg">
        <Typography variant="body2" align="center">
          Gestor de Empresas - Todos os direitos reservados
        </Typography>
      </Container>
    </Box>
  );
};

export default Footer;

