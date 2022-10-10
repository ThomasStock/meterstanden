import { MeterValue } from "~/server/routers/user";

const getDailyAverages = (meterValues: MeterValue[]) => {
  if (meterValues.length < 2) {
    // Need at least 2 values to get an average
    return;
  }

  let averages = meterValues.slice(1).map((entry, index) => {
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    const previous = meterValues[index]!;

    const daysSincePrevious = entry.date.diff(previous.date).as("days");

    const usageSincePrevious = entry.value.minus(previous.value);

    const averageUsagePerDaySincePrevious =
      usageSincePrevious.div(daysSincePrevious);

    return {
      date: entry.date,
      value: averageUsagePerDaySincePrevious
    };
  });

  // Make sure graph shows a line instead of a dot

  averages = [
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    { ...averages[0]!, date: meterValues[0]!.date },
    ...averages
  ];

  return averages;
};

export default getDailyAverages;
