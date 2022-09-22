/**
 * This file contains the root router of your tRPC-backend
 */
import { t } from "../trpc";
import { meterValueRouter } from "./meterValue";

export const appRouter = t.router({
  meterValue: meterValueRouter
});

export type AppRouter = typeof appRouter;
