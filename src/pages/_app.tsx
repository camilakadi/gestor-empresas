import "@/app/globals.css";
import ThemeProvider from "@/app/theme/ThemeProvider";
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
        <Component {...pageProps} />
      </ThemeProvider>
    </>
  );
};

export default App;
