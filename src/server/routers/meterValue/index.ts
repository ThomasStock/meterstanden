import { t } from "~/server/trpc";
import { prisma } from "~/server/db/client";
import { meterId } from "../meter";
import defaultMeterValueSelect from "./_utils/defaultMeterValueSelect";
import meterValueCreateInput from "./_utils/meterValueCreateInput";
import mapOne from "./_utils/mapOne";

export const meterValueRouter = t.router({
  list: t.procedure.input(meterId).query(async ({ input: meterId }) => {
    const items = await prisma.meterValue.findMany({
      select: defaultMeterValueSelect,
      where: { meterId },
      orderBy: {
        date: "asc"
      }
    });
    return items.map(mapOne);
  }),
  add: t.procedure.input(meterValueCreateInput).mutation(async ({ input }) => {
    const meterValue = await prisma.meterValue.create({
      data: input,
      select: defaultMeterValueSelect
    });
    return mapOne(meterValue);
  }),
  deleteLastAdded: t.procedure
    .input(meterId)
    .mutation(async ({ input: meterId }) => {
      const lastMeterValue = await prisma.meterValue.findFirst({
        where: { meterId },
        orderBy: { createdAt: "desc" }
      });

      if (!lastMeterValue) {
        return;
      }

      await prisma.meterValue.delete({ where: { id: lastMeterValue.id } });
    }),
  deleteAll: t.procedure.input(meterId).mutation(async ({ input: meterId }) => {
    await prisma.meterValue.deleteMany({ where: { meterId } });
  })
});
