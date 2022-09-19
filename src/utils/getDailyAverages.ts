import { Entry } from "../components/DailyUseGraph";

const getDailyAverages = (meterValues: Entry[]): Entry[] =>
  meterValues.slice(1).map((entry, index) => {
    const previous = meterValues[index] as Entry;
    const daysSincePrevious = entry.date.diff(previous.date).as("days");
    const usageSincePrevious = entry.value - previous.value;
    const averageUsagePerDaySincePrevious =
      usageSincePrevious / daysSincePrevious;
    return { date: entry.date, value: averageUsagePerDaySincePrevious };
  });

export default getDailyAverages;
