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

interface GraphProps {
  energyUnit: string;
  data: Entry[];
  title: string;
  isAverage?: boolean;
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
const blue = "rgb(0, 168, 255)";

const Graph = (props: GraphProps) => {
  const { energyUnit, data, title, isAverage } = props;

  const [scaleIndex, setScaleIndex] = useState(
    isAverage ? 0 : scales.length - 1
  );
  const { min, timeUnit, relative } = scales[scaleIndex] as TimeScaleOptions;

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
              radius: 3,
              hoverRadius: 6,
              backgroundColor: blue,
              hitRadius: 14
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
              displayColors: false,
              enabled: true,
              callbacks: {
                title: (item) => {
                  const tooltipItem = item[0];
                  if (!tooltipItem) {
                    return "";
                  }
                  console.log(tooltipItem);
                  const date = (tooltipItem.raw as { x: DateTime }).x;

                  if (!isAverage) {
                    return renderDate(date);
                  }

                  return "";
                },
                label: (item) => {
                  const usageAsString =
                    (item.raw as { y: number }).y.toFixed(2) + " " + energyUnit;

                  if (!isAverage) {
                    return "Gelogde meterstand: " + usageAsString;
                  }

                  console.log("item", item);

                  const date = data[item.dataIndex]?.date as DateTime;
                  const previousDate = data[item.dataIndex - 1]
                    ?.date as DateTime;

                  return (
                    "Tussen " +
                    previousDate.toLocaleString(DateTime.DATE_SHORT) +
                    " en " +
                    date.toLocaleString(DateTime.DATE_SHORT) +
                    " was je verbruik gemiddeld " +
                    usageAsString +
                    " per dag"
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
              min: isAverage ? 0 : undefined,
              suggestedMax: isAverage ? suggestedMax : undefined
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

      {isAverage ? (
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
      ) : null}
    </Paper>
  );
};

export default Graph;

const renderDate = (date: DateTime) => {
  const hasTime = date.hour !== 0 || date.minute !== 0 || date.second !== 0;

  return date.toLocaleString(
    hasTime
      ? DateTime.DATETIME_MED_WITH_WEEKDAY
      : DateTime.DATE_MED_WITH_WEEKDAY
  );
};
