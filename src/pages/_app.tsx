import "@/app/globals.css";
import ThemeProvider from "@/app/theme/ThemeProvider";
import Footer from "@/components/Footer";
import Header from "@/components/Header";
import { Box } from "@mui/material";
import type { AppProps } from "next/app";
import Head from "next/head";

const App = ({ Component, pageProps }: AppProps) => {
  return (
    <>
      <Head>
        <title>Gestor de Empresas</title>
        <meta
          name="description"
          content="Sistema de gestão e visualização de empresas"
        />
      </Head>
      <ThemeProvider>
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            minHeight: "100vh",
          }}
        >
          <Header />
          <Box component="main" sx={{ flexGrow: 1 }}>
            <Component {...pageProps} />
          </Box>
          <Footer />
        </Box>
      </ThemeProvider>
    </>
  );
};

export default App;
