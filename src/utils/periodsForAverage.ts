import { DateTime } from "luxon";
import { PeriodOptions } from "./useAppStore";

const periodsForAverage: PeriodOptions[] = [
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

export default periodsForAverage;
