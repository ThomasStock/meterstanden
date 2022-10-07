// src/pages/_app.tsx
import { createTrpcClient, trpc } from "~/utils/trpc";
import { AdapterLuxon } from "@mui/x-date-pickers/AdapterLuxon";
import { LocalizationProvider } from "@mui/x-date-pickers";
import { CacheProvider, EmotionCache, ThemeProvider } from "@emotion/react";
import createEmotionCache from "../mui/createEmotionCache";
import theme from "../mui/theme";
import { AppProps } from "next/app";
import Head from "next/head";
import { CssBaseline, NoSsr } from "@mui/material";
import superjson from "superjson";
import { DateTime } from "luxon";
import { Prisma } from "@prisma/client";
import { useState } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

superjson.registerCustom<DateTime, string>(
  {
    isApplicable: (v): v is DateTime => DateTime.isDateTime(v),
    serialize: (v) => v.toJSON(),
    deserialize: (v) => DateTime.fromISO(v)
  },
  "DateTime"
);

superjson.registerCustom<Prisma.Decimal, string>(
  {
    isApplicable: (v): v is Prisma.Decimal => Prisma.Decimal.isDecimal(v),
    serialize: (v) => v.toJSON(),
    deserialize: (v) => new Prisma.Decimal(v)
  },
  "decimal.js"
);

// Client-side cache, shared for the whole session of the user in the browser.
const clientSideEmotionCache = createEmotionCache();

interface MyAppProps extends AppProps {
  emotionCache?: EmotionCache;
}

const MyApp = (props: MyAppProps) => {
  const { Component, pageProps, emotionCache = clientSideEmotionCache } = props;

  const [queryClient] = useState(() => new QueryClient());
  const [trpcClient] = useState(() => createTrpcClient());

  return (
    <CacheProvider value={emotionCache}>
      <Head>
        <title>Meterstanden</title>
        <meta name="viewport" content="initial-scale=1, width=device-width" />
        <meta name="description" content="Analoge meterstanden opvolgen" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <LocalizationProvider dateAdapter={AdapterLuxon}>
          <trpc.Provider client={trpcClient} queryClient={queryClient}>
            <QueryClientProvider client={queryClient}>
              <NoSsr>
                <Component {...pageProps} />
              </NoSsr>
            </QueryClientProvider>
          </trpc.Provider>
        </LocalizationProvider>
      </ThemeProvider>
    </CacheProvider>
  );
};

export default MyApp;
