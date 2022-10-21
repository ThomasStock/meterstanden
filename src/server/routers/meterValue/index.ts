import { t } from "~/server/trpc";
import { prisma } from "~/server/db/client";
import { meterId } from "../meter/meterId";
import { Prisma } from "@prisma/client";
import { z } from "zod";

export const meterValueArgs = Prisma.validator<Prisma.MeterValueArgs>()({});
export type MeterValue = Prisma.MeterValueGetPayload<typeof meterValueArgs>;

export const meterValueRouter = t.router({
  // list: t.procedure.input(meterId).query(async ({ input: meterId }) => {
  //   const items = await prisma.meterValue.findMany({
  //     where: { meterId },
  //     orderBy: {
  //       date: "asc"
  //     },
  //     ...meterValueArgs
  //   });
  //   return items;
  // }),
  add: t.procedure
    .input(
      z.object({
        date: z.date(),
        value: z.number().positive(),
        meterId
      })
    )
    .mutation(async ({ input }) => {
      const meterValue = await prisma.meterValue.create({
        data: input,
        ...meterValueArgs
      });
      return meterValue;
    }),
  deleteLastAdded: t.procedure
    .input(meterId)
    .mutation(async ({ input: meterId }) => {
      const lastMeterValue = await prisma.meterValue.findFirst({
        where: { meterId },
        orderBy: { createdAt: "desc" },
        ...meterValueArgs
      });

      if (!lastMeterValue) {
        return;
      }

      await prisma.meterValue.delete({
        where: { id: lastMeterValue.id },
        ...meterValueArgs
      });
    })
});
