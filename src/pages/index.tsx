import type { NextPage } from "next";
import Head from "next/head";
import Graph from "../components/Graph";
import { useMemo } from "react";
import getDailyAverages from "../utils/getDailyAverages";
import MeterEntry from "../components/MeterEntry";
import useAppStore from "../utils/useAppStore";
import periodsForAverage from "../utils/periodsForAverage";
import { Paper } from "@mui/material";

const Home: NextPage = () => {
  const { meterValues } = useAppStore();

  const dailyAverages = useMemo(
    () => getDailyAverages(meterValues),
    [meterValues]
  );

  return (
    <>
      <Head>
        <title>Meterstanden</title>
        <meta name="description" content="Analoge meterstanden opvolgen" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className="container mx-auto flex flex-col items-center justify-center max-w-2xl">
        <Paper className="p-5 m-5" elevation={12}>
          <MeterEntry />

          <Graph
            graphKey="averageUsePerDayElectricity"
            title="Gemiddeld verbruik/dag"
            energyUnit="kWh"
            data={dailyAverages}
            isAverage
            periods={periodsForAverage}
          />

          <Graph
            graphKey="totalUseElectricty"
            title="Meterstand evolutie"
            energyUnit="kWh"
            data={meterValues}
          />
        </Paper>
      </main>
    </>
  );
};

export default Home;
