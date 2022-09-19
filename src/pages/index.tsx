import type { NextPage } from "next";
import Head from "next/head";

import { DateTime } from "luxon";
import DailyUseGraph, { Entry } from "../components/DailyUseGraph";

const data: Entry[] = [
  { date: DateTime.fromISO("2020-10-01"), value: 16208 },
  { date: DateTime.fromISO("2021-10-11T09:24:12"), value: 18362 },
  { date: DateTime.fromISO("2022-08-29"), value: 20257 },
  { date: DateTime.fromISO("2022-09-14"), value: 20322.3 }
];

const Home: NextPage = () => {
  return (
    <>
      <Head>
        <title>Meterstanden</title>
        <meta name="description" content="Analoge meterstanden opvolgen" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className="container mx-auto flex flex-col items-center justify-center p-4">
        <DailyUseGraph
          title="Dagelijks verbruik laatste week"
          energyUnit="kWh"
          measurements={data}
          min={DateTime.now().minus({ week: 1 })}
          timeUnit="day"
          relative
        />
        <DailyUseGraph
          title="Dagelijks verbruik laatste maand"
          energyUnit="kWh"
          measurements={data}
          min={DateTime.now().minus({ month: 1 })}
          timeUnit="week"
          relative
        />
        <DailyUseGraph
          title="Dagelijks verbruik sinds begin metingen"
          energyUnit="kWh"
          measurements={data}
        />
      </main>
    </>
  );
};

export default Home;
