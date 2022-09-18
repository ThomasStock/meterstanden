import type { NextPage } from "next";
import Head from "next/head";
import { Line } from "react-chartjs-2";
import {
  Chart,
  TimeScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Legend
} from "chart.js";
import "chartjs-adapter-luxon";

import { DateTime } from "luxon";

Chart.register(
  TimeScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Legend
);

interface Entry {
  date: DateTime;
  value: number;
}

const data: Entry[] = [
  { date: DateTime.fromISO("2020-10-01"), value: 16208 },
  { date: DateTime.fromISO("2021-10-11T09:24"), value: 18362 },
  { date: DateTime.fromISO("2022-08-29"), value: 20257 },
  { date: DateTime.fromISO("2022-09-14"), value: 20322.3 }
];

const usableData = data.slice(1).map((entry, index) => {
  const previous = data[index] as Entry;
  const daysSincePrevious = entry.date.diff(previous.date).as("days");
  const usageSincePrevious = entry.value - previous.value;
  const averageUsagePerDaySincePrevious =
    usageSincePrevious / daysSincePrevious;
  return { x: entry.date, y: averageUsagePerDaySincePrevious };
});

console.log(usableData);

const Home: NextPage = () => {
  return (
    <>
      <Head>
        <title>Meterstanden</title>
        <meta name="description" content="Analoge meterstanden opvolgen" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className="container mx-auto flex flex-col items-center justify-center min-h-screen p-4">
        <Line
          options={{
            scales: {
              x: {
                type: "time",
                time: {
                  unit: "day"
                },
                suggestedMax: DateTime.now().toISO()
              },
              y: {
                type: "linear",
                title: { display: true, text: "kWh" },
                min: 0
              }
            }
          }}
          data={{
            datasets: [
              {
                label: "Dagelijks verbruik",
                borderColor: "rgb(255, 99, 132)",
                data: usableData
              }
            ]
          }}
        />
      </main>
    </>
  );
};

export default Home;
