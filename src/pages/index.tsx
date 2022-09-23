import type { NextPage } from "next";
import Head from "next/head";
import Graph from "../components/Graph";
import { useMemo } from "react";
import getDailyAverages from "../utils/getDailyAverages";
import MeterEntry from "../components/MeterEntry";
import periodsForAverage from "../utils/periodsForAverage";
import { Box, Divider, Paper, PaperProps, Typography } from "@mui/material";
import { Stack } from "@mui/system";
import { trpc } from "~/utils/trpc";
import DevTools from "~/components/DevTools";

const Home: NextPage = () => {
  const meterValueQuery = trpc.meterValue.list.useQuery();
  const meterValues = meterValueQuery.data;

  const dailyAverages = useMemo(() => {
    if (meterValues && meterValues.length) {
      return getDailyAverages(meterValues);
    }
  }, [meterValues]);

  return (
    <>
      <Head>
        <title>Meterstanden</title>
        <meta name="description" content="Analoge meterstanden opvolgen" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Stack
        direction={"column"}
        spacing={{ xs: 2, sm: 5 }}
        sx={{ m: "auto", my: { xs: 2, sm: 5 } }}
        maxWidth="lg"
        alignSelf={"center"}
      >
        <RootPaper>
          <MeterEntry />
        </RootPaper>

        <RootPaper>
          <Stack direction={"column"} divider={<Divider />} spacing={2}>
            {dailyAverages && dailyAverages.length ? (
              <Graph
                graphKey="averageUsePerDayElectricity"
                title="Gemiddeld verbruik/dag"
                energyUnit="kWh"
                data={dailyAverages}
                isAverage
                periods={periodsForAverage}
              />
            ) : (
              <Typography>
                Voeg minstens 2 meterstanden toe om je gemiddeld verbruik per
                dag te zien
              </Typography>
            )}
            {meterValues && meterValues.length ? (
              <Graph
                graphKey="totalUseElectricty"
                title="Meterstand evolutie"
                energyUnit="kWh"
                data={meterValues}
              />
            ) : null}
          </Stack>
        </RootPaper>
        <RootPaper>
          <DevTools />
        </RootPaper>
      </Stack>
    </>
  );
};

export default Home;

const RootPaper = (props: PaperProps) => (
  <Box>
    <Paper
      sx={{ mx: { xs: 2, sm: 5 }, p: { xs: 3, sm: 5 } }}
      elevation={12}
      {...props}
    />{" "}
  </Box>
);
