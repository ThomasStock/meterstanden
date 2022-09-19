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
import { useState } from "react";
import { Button, ButtonGroup, Paper } from "@mui/material";

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
  data: Entry[];
  title: string;
}

interface TimeScaleOptions {
  label: string;
  min?: DateTime;
  timeUnit?: DateTimeUnit;
  relative?: boolean;
}

const scales: TimeScaleOptions[] = [
  {
    label: "Laatste week",
    min: DateTime.now().minus({ week: 1 }),
    timeUnit: "day",
    relative: true
  },
  {
    label: "Laatste maand",
    min: DateTime.now().minus({ month: 1 }),
    timeUnit: "week",
    relative: true
  },
  {
    label: "Sinds eerste meting"
  }
];

const red = "rgb(255, 99, 132)";

const DailyUseGraph = (props: DailyUseLineProps) => {
  const { energyUnit, data, title } = props;

  const [scaleIndex, setScaleIndex] = useState(0);
  const { min, timeUnit, relative } = scales[scaleIndex] as TimeScaleOptions;

  console.log("data", data);

  const [suggestedMax] = useState(
    Math.max(...data.map((data) => data.value)) * 1.2
  );

  return (
    <Paper
      elevation={2}
      className="container flex flex-col items-center mb-5 p-3 select-none"
    >
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
              data: data.map((entry) => ({ x: entry.date, y: entry.value }))
            }
          ]
        }}
      />

      <ButtonGroup variant="text">
        {scales.map((scale, index) => (
          <Button
            key={index}
            disabled={index === scaleIndex}
            onClick={() => setScaleIndex(index)}
          >
            {scale.label}
          </Button>
        ))}
      </ButtonGroup>
    </Paper>
  );
};

export default DailyUseGraph;
