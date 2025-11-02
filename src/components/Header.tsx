"use client";

import { AppBar, Box, Toolbar } from "@mui/material";
import Image from "next/image";

const Header = () => {
  return (
    <AppBar
      position="static"
      sx={{
        backgroundColor: "primary.dark",
      }}
    >
      <Toolbar>
        <Box
          sx={{
            padding: "5px",
            height: "75px",
            backgroundColor: "white",
          }}
        >
          <Image
            src="/gestor-de-empresas.png"
            alt="Gestor de Empresas"
            width={150}
            height={65}
            priority
          />
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default Header;
