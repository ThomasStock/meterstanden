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
  list: t.procedure.input(z.string()).query(async ({ input: userId }) => {
    const items = await prisma.meterValue.findMany({
      select: defaultMeterValueSelect,
      where: { userId },
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
        value: z.number().positive(),
        userId: z.string()
      })
    )
    .mutation(async ({ input }) => {
      const meterValue = await prisma.meterValue.create({
        data: input,
        select: defaultMeterValueSelect
      });
      return mapOne(meterValue);
    }),
  deleteLastAdded: t.procedure
    .input(z.string())
    .mutation(async ({ input: userId }) => {
      const lastMeterValue = await prisma.meterValue.findFirst({
        where: { userId },
        orderBy: { createdAt: "desc" }
      });

      if (!lastMeterValue) {
        return;
      }

      await prisma.meterValue.delete({ where: { id: lastMeterValue.id } });
    }),
  deleteAll: t.procedure
    .input(z.string())
    .mutation(async ({ input: userId }) => {
      await prisma.meterValue.deleteMany({ where: { userId } });
    }),
  loadDemoData: t.procedure
    .input(z.string())
    .mutation(async ({ input: userId }) => {
      await prisma.meterValue.deleteMany();
      for (const data of demoValues) {
        await prisma.meterValue.create({ data: { ...data, userId } });
      }
    })
});

export type MeterValues = inferProcedureOutput<typeof meterValueRouter["list"]>;
export type MeterValue = MeterValues[number];

const demoValues = [
  { date: new Date("2020-10-01 00:00:00"), value: "16208" },
  { date: new Date("2021-10-11 00:00:00"), value: "18362" },
  { date: new Date("2022-08-29 00:00:00"), value: "20257" },
  { date: new Date("2022-09-14 15:00:00"), value: "20322.3" },
  { date: new Date("2022-09-23 00:10:13"), value: "20353.8" }
];
