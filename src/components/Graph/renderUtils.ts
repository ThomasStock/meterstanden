import { Prisma } from "@prisma/client";
import { DateTime, DateTimeUnit } from "luxon";
import { MeterValue } from "~/server/routers/meterValue";

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
  averages: Pick<MeterValue, "date" | "value">[],
  index: number,
  energyUnit: string
) => {
  const current = averages[index];
  if (!current) {
    console.warn(
      "Trying to render tooltip for unexisting average? Something is wrong."
    );
    return "";
  }
  const date = DateTime.fromJSDate(current.date);
  const dateString = date.toLocaleString(DateTime.DATE_SHORT);

  const previous = averages[index - 1];
  if (!previous?.date) {
    return ["Eerste logging op " + dateString];
  }
  const previousDate = DateTime.fromJSDate(previous.date);
  const previousDateString = previousDate?.toLocaleString(DateTime.DATE_SHORT);

  return [
    "Tussen " + previousDateString + " en " + dateString + " was",
    "je verbruik gemiddeld " +
      renderUsageAsString(averages[index]!.value, energyUnit) +
      " per dag"
  ];
};

export const renderUsageAsString = (
  usage: Prisma.Decimal,
  energyUnit: string
) => usage.toFixed(2) + " " + energyUnit;
