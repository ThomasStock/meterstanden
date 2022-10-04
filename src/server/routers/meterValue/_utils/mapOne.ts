import * as PrismaClient from "@prisma/client";
import { DateTime } from "luxon";
import defaultMeterValueSelect from "./defaultMeterValueSelect";

const mapOne = ({
  id,
  date,
  value
}: Pick<PrismaClient.MeterValue, keyof typeof defaultMeterValueSelect>) => ({
  id,
  date: DateTime.fromJSDate(date),
  value
});

export default mapOne;
