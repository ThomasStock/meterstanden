import { Prisma } from "@prisma/client";

const defaultMeterValueSelect = Prisma.validator<Prisma.MeterValueArgs>()({});

export type DefaultMeterValueSelect = Prisma.MeterValueGetPayload<
  typeof defaultMeterValueSelect
>;
