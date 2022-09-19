import { Line } from "react-chartjs-2";
import {
  Chart,
  TimeScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Legend,
  BarElement
} from "chart.js";
import "chartjs-adapter-luxon";

import { DateTime, DateTimeUnit } from "luxon";
import { useMemo } from "react";

Chart.register(
  TimeScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Legend
);

export interface Entry {
  date: DateTime;
  value: number;
}

interface DailyUseLineProps {
  energyUnit: string;
  measurements: Entry[];
  min?: DateTime;
  timeUnit?: DateTimeUnit;
  title: string;
}

const DailyUseGraph = (props: DailyUseLineProps) => {
  const { energyUnit, measurements, min, timeUnit, title } = props;

  const data = useMemo(() => getUsableData(measurements), [measurements]);

  return (
    <article className="container flex flex-col items-center mb-5">
      <Line
        options={{
          plugins: {
            legend: {
              display: false
            },
            title: {
              display: true,
              text: title
            }
          },
          scales: {
            x: {
              type: "time",
              max: DateTime.now().toISO(),
              min: min?.toISO(),
              ticks: {
                autoSkipPadding: 32
              },
              time: {
                unit: timeUnit ?? undefined
              }
            },
            y: {
              type: "linear",
              title: { display: true, text: energyUnit },
              min: 0
            }
          }
        }}
        data={{
          datasets: [
            {
              borderColor: "rgb(255, 99, 132)",
              data
            }
          ]
        }}
      />
    </article>
  );
};

export default DailyUseGraph;

const getUsableData = (data: Entry[]) =>
  data.slice(1).map((entry, index) => {
    const previous = data[index] as Entry;
    const daysSincePrevious = entry.date.diff(previous.date).as("days");
    const usageSincePrevious = entry.value - previous.value;
    const averageUsagePerDaySincePrevious =
      usageSincePrevious / daysSincePrevious;
    return { x: entry.date, y: averageUsagePerDaySincePrevious };
  });
