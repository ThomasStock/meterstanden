import { t } from "../trpc";
import { meterValueRouter } from "./meterValue";
import { userRouter } from "./user";

export const appRouter = t.router({
  meterValue: meterValueRouter,
  user: userRouter
});

export type AppRouter = typeof appRouter;
