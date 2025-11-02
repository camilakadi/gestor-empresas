"use client";

import { AppBar, Box, Toolbar } from "@mui/material";
import Image from "next/image";
import Link from "next/link";

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
          component={Link}
          href="/"
          sx={{
            padding: "5px",
            height: "75px",
            backgroundColor: "white",
            cursor: "pointer",
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
