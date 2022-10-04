import type { GetInferenceHelpers } from "@trpc/server";
import { AppRouter } from "./_app";

export type AppRouterTypes = GetInferenceHelpers<AppRouter>;
