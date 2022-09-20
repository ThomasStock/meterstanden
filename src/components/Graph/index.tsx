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
  Tooltip,
  ChartOptions
} from "chart.js";
import "chartjs-adapter-luxon";
import { DateTime } from "luxon";
import { useState } from "react";
import { Paper } from "@mui/material";
import useAppStore, { Entry, PeriodOptions } from "../../utils/useAppStore";
import {
  renderDate,
  renderAverageUseTooltipLabel,
  renderRelativeDate,
  renderUsageAsString
} from "./renderUtils";
import PeriodPicker from "./PeriodPicker";

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

interface GraphProps {
  graphKey: string;
  energyUnit: string;
  data: Entry[];
  title: string;
  isAverage?: boolean;
  periods?: PeriodOptions[];
}

const red = "rgb(255, 99, 132)";
const blue = "rgb(0, 168, 255)";

const Graph = (props: GraphProps) => {
  const { graphKey, energyUnit, data, title, isAverage, periods } = props;

  const { selectedPeriods, selectPeriod } = useAppStore();
  const selectedPeriodIndex = selectedPeriods.get(graphKey) ?? 0;
  const handleSelectPeriod = (newPeriodIndex: number) =>
    selectPeriod(graphKey, newPeriodIndex);

  const { min, timeUnit, relative } = periods?.[selectedPeriodIndex] ?? {};

  const [suggestedMax] = useState(
    Math.max(...data.map((data) => data.value)) * 1.2
  );

  const options: ChartOptions<"line"> = {
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
            const date = (tooltipItem.raw as { x: DateTime }).x;

            if (!isAverage) {
              return renderDate(date);
            }

            return "";
          },
          label: (item) => {
            const index = item.dataIndex;
            if (!isAverage) {
              return (
                "Gelogde meterstand: " +
                // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
                renderUsageAsString(data[index]!.value, energyUnit)
              );
            }

            return renderAverageUseTooltipLabel(data, index, energyUnit);
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
            return renderRelativeDate(tickObject.value, timeUnit);
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
  };

  return (
    <Paper
      elevation={2}
      className="container flex flex-col items-center mb-5 p-3 select-none"
    >
      <Line
        options={options}
        data={{
          datasets: [
            {
              borderColor: red,
              data: data.map((entry) => ({ x: entry.date, y: entry.value }))
            }
          ]
        }}
      />

      <PeriodPicker
        onSelectPeriod={handleSelectPeriod}
        periods={periods}
        selectedPeriodIndex={selectedPeriodIndex}
      />
    </Paper>
  );
};

export default Graph;
