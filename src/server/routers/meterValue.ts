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
    }),
  deleteLastAdded: t.procedure.mutation(async () => {
    const lastMeterValue = await prisma.meterValue.findFirst({
      orderBy: { createdAt: "desc" }
    });

    if (!lastMeterValue) {
      return;
    }

    await prisma.meterValue.delete({ where: { id: lastMeterValue.id } });
  }),
  deleteAll: t.procedure.mutation(async () => {
    await prisma.meterValue.deleteMany();
  }),
  loadDemoData: t.procedure.mutation(async () => {
    await prisma.meterValue.deleteMany();
    await prisma.meterValue.createMany({
      data: [
        { date: new Date("2020-10-01 00:00:00"), value: "16208" },
        { date: new Date("2021-10-11 00:00:00"), value: "18362" },
        { date: new Date("2022-08-29 00:00:00"), value: "20257" },
        { date: new Date("2022-09-14 15:00:00"), value: "20322.3" },
        { date: new Date("2022-09-23 00:10:13"), value: "20353.8" }
      ]
    });
  })
});

export type MeterValues = inferProcedureOutput<typeof meterValueRouter["list"]>;
export type MeterValue = MeterValues[number];
