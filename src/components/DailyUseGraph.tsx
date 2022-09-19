import { Line } from "react-chartjs-2";
import {
  Chart,
  TimeScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Legend,
  BarElement,
  Tooltip
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
  Legend,
  Tooltip
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
  relative?: boolean;
}

const red = "rgb(255, 99, 132)";

const DailyUseGraph = (props: DailyUseLineProps) => {
  const { energyUnit, measurements, min, timeUnit, title, relative } = props;

  const data = useMemo(() => getUsableData(measurements), [measurements]);

  const suggestedMax = useMemo(
    () => Math.max(...data.map((data) => data.y)) * 1.2,
    []
  );

  return (
    <article className="container flex flex-col items-center mb-5 max-w-2xl select-none">
      <Line
        options={{
          elements: {
            point: {
              radius: 6,
              hoverRadius: 10,
              backgroundColor: red,
              hitRadius: 18
            }
          },
          plugins: {
            legend: {
              display: false
            },
            title: {
              display: true,
              text: title
            },
            tooltip: {
              enabled: true,
              callbacks: {
                title: (item) => {
                  if (!item[0]) {
                    return "";
                  }
                  const date = (item[0].raw as { x: DateTime }).x;
                  const hasTime =
                    date.hour !== 0 || date.minute !== 0 || date.second !== 0;

                  return date.toLocaleString(
                    hasTime
                      ? DateTime.DATETIME_MED_WITH_WEEKDAY
                      : DateTime.DATE_MED_WITH_WEEKDAY
                  );
                },
                label: (item) => {
                  return (
                    (item.raw as { y: number }).y.toFixed(2) + " " + energyUnit
                  );
                }
              }
            }
          },
          scales: {
            x: {
              type: "time",
              suggestedMax: DateTime.now().toISO(),
              min: min?.toISO(),
              ticks: {
                autoSkipPadding: 32,
                callback(tickValue, index, ticks) {
                  if (!relative) {
                    return tickValue;
                  }
                  const tickObject = ticks[index];
                  if (!tickObject) {
                    return tickValue;
                  }
                  return DateTime.fromMillis(
                    tickObject.value
                  ).toRelativeCalendar({
                    unit:
                      timeUnit === "day"
                        ? "days"
                        : timeUnit === "week"
                        ? "weeks"
                        : timeUnit === "month"
                        ? "months"
                        : undefined
                  });
                }
              },
              time: {
                unit: timeUnit ?? undefined
              }
            },
            y: {
              type: "linear",
              title: { display: true, text: energyUnit },
              min: 0,
              suggestedMax
            }
          }
        }}
        data={{
          datasets: [
            {
              borderColor: red,
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
