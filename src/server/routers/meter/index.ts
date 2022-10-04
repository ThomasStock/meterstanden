import { t } from "~/server/trpc";
import { prisma } from "~/server/db/client";
import { userKey } from "../user";
import { z } from "zod";
import defaultMeterSelect from "./_utils/defaultMeterSelect";

export const meterId = z.string();

export const meterRouter = t.router({
  list: t.procedure.input(userKey).query(async ({ input: key }) => {
    const meters = await prisma.user
      .findFirstOrThrow({ where: { key } })
      .meters({ select: defaultMeterSelect });
    return meters;
  })
});
