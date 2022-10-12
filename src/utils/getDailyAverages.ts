import { DateTime } from "luxon";
import { MeterValue } from "~/server/routers/meterValue";

const getDailyAverages = (meterValues: MeterValue[]) => {
  if (meterValues.length < 2) {
    // Need at least 2 values to get an average
    return;
  }

  let averages = meterValues.slice(1).map((entry, index) => {
    const date = DateTime.fromJSDate(entry.date);
    const value = entry.value;

    const previous = meterValues[index]!;
    const previousDate = DateTime.fromJSDate(previous.date);
    const previousValue = previous.value;

    const daysSincePrevious = date.diff(previousDate).as("days");

    const usageSincePrevious = value.minus(previousValue);

    const averageUsagePerDaySincePrevious =
      usageSincePrevious.div(daysSincePrevious);

    return {
      date: entry.date,
      value: averageUsagePerDaySincePrevious
    };
  });

  // Make sure graph shows a horizontal line at start instead of a dot.
  //  by adding a 'fake' average at the first date of measurement.

  averages = [{ ...averages[0]!, date: meterValues[0]!.date }, ...averages];

  return averages;
};

export default getDailyAverages;
