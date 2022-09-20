import { DateTime, DateTimeUnit } from "luxon";
import { Entry } from "../../utils/useAppStore";

export const renderDate = (date: DateTime) => {
  const hasTime = date.hour !== 0 || date.minute !== 0 || date.second !== 0;

  return date.toLocaleString(
    hasTime
      ? DateTime.DATETIME_MED_WITH_WEEKDAY
      : DateTime.DATE_MED_WITH_WEEKDAY
  );
};

export const renderRelativeDate = (millis: number, timeUnit?: DateTimeUnit) =>
  DateTime.fromMillis(millis).toRelativeCalendar({
    unit:
      timeUnit === "day"
        ? "days"
        : timeUnit === "week"
        ? "weeks"
        : timeUnit === "month"
        ? "months"
        : undefined
  });

export const renderAverageUseTooltipLabel = (
  averages: Entry[],
  index: number,
  energyUnit: string
) => {
  const date = averages[index]?.date as DateTime;
  const dateString = date.toLocaleString(DateTime.DATE_SHORT);

  const previousDate = averages[index - 1]?.date as DateTime;
  const previousDateString = previousDate?.toLocaleString(DateTime.DATE_SHORT);

  // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
  const usageString = renderUsageAsString(averages[index]!.value, energyUnit);

  if (!previousDate) {
    return (
      "Tot " +
      dateString +
      " was je verbruik gemiddeld " +
      usageString +
      " per dag"
    );
  }

  return (
    "Tussen " +
    previousDateString +
    " en " +
    dateString +
    " was je verbruik gemiddeld " +
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    renderUsageAsString(averages[index]!.value, energyUnit) +
    " per dag"
  );
};

export const renderUsageAsString = (usage: number, energyUnit: string) =>
  usage.toFixed(2) + " " + energyUnit;
