import { t } from "../trpc";
import { meterValueRouter } from "./meterValue";
import { userRouter } from "./user";

import { meterRouter } from "./meter";

export const appRouter = t.router({
  meterValue: meterValueRouter,
  user: userRouter,
  meter: meterRouter
});

export type AppRouter = typeof appRouter;
