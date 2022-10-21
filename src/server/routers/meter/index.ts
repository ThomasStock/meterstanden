import { t } from "~/server/trpc";
import { prisma } from "~/server/db/client";
import { userKey } from "../user/userKey";
import { Prisma } from "@prisma/client";
import { meterValueArgs } from "../meterValue";

export const meterArgs = Prisma.validator<Prisma.MeterArgs>()({
  include: {
    values: {
      orderBy: {
        date: "asc"
      },
      ...meterValueArgs
    }
  }
});
export type MeterWithValues = Prisma.MeterGetPayload<typeof meterArgs>;

export const meterRouter = t.router({
  // list: t.procedure.input(userKey).query(async ({ input: key }) => {
  //   const meters = await prisma.user
  //     .findFirstOrThrow({ where: { key } })
  //     .meters({ ...meterArgs });
  //   return meters;
  // })
});
