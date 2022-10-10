import * as PrismaClient from "@prisma/client";
import produce from "immer";
import { DateTime } from "luxon";
import { DefaultMeterValueSelect } from "./selectors";

export const mapOne = (meterValue: DefaultMeterValueSelect) =>
  produce(meterValue, (draft) => {
    draft.date = DateTime.fromISO(meterValue.date);
  });
