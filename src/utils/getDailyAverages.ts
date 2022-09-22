import { MeterValues } from "~/server/routers/meterValue";

const getDailyAverages = (meterValues: MeterValues) => {
  if (meterValues.length < 2) {
    // Need at least 2 values to get an average
    return;
  }

  return meterValues.slice(1).map((entry, index) => {
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    const previous = meterValues[index]!;

    const daysSincePrevious = entry.date.diff(previous.date).as("days");

    const usageSincePrevious = entry.value.minus(previous.value);

    const averageUsagePerDaySincePrevious =
      usageSincePrevious.div(daysSincePrevious);

    return { date: entry.date, value: averageUsagePerDaySincePrevious };
  });
};

export default getDailyAverages;
