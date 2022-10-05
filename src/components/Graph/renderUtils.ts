import { Prisma } from "@prisma/client";
import { DateTime, DateTimeUnit } from "luxon";

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
  averages: Omit<MeterValue, "id">[],
  index: number,
  energyUnit: string
) => {
  const date = averages[index]?.date as DateTime;
  const dateString = date.toLocaleString(DateTime.DATE_SHORT);

  const previousDate = averages[index - 1]?.date as DateTime;
  const previousDateString = previousDate?.toLocaleString(DateTime.DATE_SHORT);

  if (!previousDate) {
    return ["Eerste logging op " + dateString];
  }

  return [
    "Tussen " + previousDateString + " en " + dateString + " was",
    "je verbruik gemiddeld " +
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      renderUsageAsString(averages[index]!.value, energyUnit) +
      " per dag"
  ];
};

export const renderUsageAsString = (
  usage: Prisma.Decimal,
  energyUnit: string
) => usage.toFixed(2) + " " + energyUnit;
