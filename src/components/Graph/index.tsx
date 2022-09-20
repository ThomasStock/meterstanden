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
import { Paper } from "@mui/material";
import useAppStore, { PeriodOptions } from "../../utils/useAppStore";
import PeriodPicker from "./PeriodPicker";
import getOptions, { Options } from "./getOptions";

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

interface GraphProps extends Options {
  graphKey: string;
  periods?: PeriodOptions[];
}

const red = "rgb(255, 99, 132)";

const Graph = (props: GraphProps) => {
  const { graphKey, data, periods } = props;

  // For the button bar where you can select "last day, last week, etc"
  const { selectedPeriods, selectPeriod } = useAppStore();
  const selectedPeriodIndex = selectedPeriods.get(graphKey) ?? 0;
  const handleSelectPeriod = (newPeriodIndex: number) =>
    selectPeriod(graphKey, newPeriodIndex);

  const periodOptions = periods?.[selectedPeriodIndex] ?? {};
  const options = getOptions({ ...(periodOptions ?? {}), ...props });

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
