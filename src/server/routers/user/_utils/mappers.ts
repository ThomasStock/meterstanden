import * as PrismaClient from "@prisma/client";
import { DateTime } from "luxon";
import type { UserWithMetersAndValues } from "./args";
import produce from "immer";

export const mapOne = (user: UserWithMetersAndValues) =>
  produce(user, (draft) => {
    draft.meters.forEach((meter) => meter.values.map(mapOne));
  });

export default mapOne;
