import { Prisma } from "@prisma/client";
import { ChartOptions } from "chart.js";
import { DateTime } from "luxon";
import { MeterValue } from "~/server/routers/meterValue";
import { PeriodOptions } from "../../utils/useAppStore";
import {
  renderDate,
  renderUsageAsString,
  renderAverageUseTooltipLabel,
  renderRelativeDate
} from "./renderUtils";

const blue = "rgb(0, 168, 255)";

export interface Options {
  isAverage?: boolean;
  data: Omit<MeterValue, "id">[];
  energyUnit: string;
  title: string;
}

const getOptions = ({
  isAverage,
  data,
  title,
  energyUnit,
  relative,
  min,
  timeUnit
}: Options & Omit<PeriodOptions, "label">): ChartOptions<"line"> => {
  const values = data.map((data) => data.value);

  const suggestedMax = Prisma.Decimal.max(...values).mul(1.2);

  return {
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
        suggestedMax: isAverage ? suggestedMax.toNumber() : undefined
      }
    }
  };
};

export default getOptions;
