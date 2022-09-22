import { t } from "../trpc";
import { z } from "zod";
import { prisma } from "~/server/db/client";
import { DateTime } from "luxon";
import { inferProcedureOutput } from "@trpc/server";
import { Prisma } from "@prisma/client";
import * as PrismaClient from "@prisma/client";

const defaultMeterValueSelect = Prisma.validator<Prisma.MeterValueSelect>()({
  id: true,
  date: true,
  value: true
});

const mapOne = ({
  id,
  date,
  value
}: Pick<PrismaClient.MeterValue, keyof typeof defaultMeterValueSelect>) => ({
  id,
  date: DateTime.fromJSDate(date),
  value
});

export const meterValueRouter = t.router({
  list: t.procedure.query(async () => {
    const items = await prisma.meterValue.findMany({
      select: defaultMeterValueSelect,
      where: {},
      orderBy: {
        date: "asc"
      }
    });
    return items.map(mapOne);
  }),
  add: t.procedure
    .input(
      z.object({
        date: z.date(),
        value: z.number().positive()
      })
    )
    .mutation(async ({ input }) => {
      const meterValue = await prisma.meterValue.create({
        data: input,
        select: defaultMeterValueSelect
      });
      return mapOne(meterValue);
    })
});

export type MeterValues = inferProcedureOutput<typeof meterValueRouter["list"]>;
export type MeterValue = MeterValues[number];
