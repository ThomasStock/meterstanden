import type { NextPage } from "next";
import Head from "next/head";
import Graph from "../components/Graph";
import { useMemo } from "react";
import getDailyAverages from "../utils/getDailyAverages";
import MeterEntry from "../components/MeterEntry";
import useAppStore from "../utils/useAppStore";
import periodsForAverage from "../utils/periodsForAverage";

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

      <main className="container mx-auto flex flex-col items-center justify-center p-5 max-w-2xl">
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
      </main>
    </>
  );
};

export default Home;
