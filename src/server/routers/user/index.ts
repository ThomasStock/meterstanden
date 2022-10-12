import { t } from "~/server/trpc";
import { prisma } from "~/server/db/client";
import { z } from "zod";
import demoValues from "./_utils/demoValues";
import makeId from "./_utils/makeId";
import { Prisma } from "@prisma/client";
import { meterArgs } from "../meter";

export const userKey = z.string();

export const userArgs = Prisma.validator<Prisma.UserArgs>()({
  include: {
    meters: {
      orderBy: {
        createdAt: "asc"
      },
      ...meterArgs
    }
  }
});
export type UserWithMeters = Prisma.UserGetPayload<typeof userArgs>;

const getUserWithMetersAndValues = async (key: string) => {
  const user = await prisma.user.findUniqueOrThrow({
    where: { key },
    ...userArgs
  });
  return user;
};

function timeout(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export const userRouter = t.router({
  get: t.procedure
    .input(userKey.optional())
    .query(async ({ input: clientsideKey }) => {
      await timeout(5000);
      if (clientsideKey) {
        const user = await getUserWithMetersAndValues(clientsideKey);
        return user;
      }
      // create user
      const key = makeId(5);
      console.log("<ADE", key);
      const user = await prisma.user.create({
        data: { key },
        ...userArgs
      });
      return user;
    }),
  loadDemoData: t.procedure.input(userKey).mutation(async ({ input: key }) => {
    // Delete existing meters
    await prisma.user.update({
      where: { key },
      data: { meters: { deleteMany: {} } }
    });

    // Load in demo meters and metervalues
    demoValues.forEach(async (values, meterLabel) => {
      await prisma.user.update({
        where: { key },
        data: {
          meters: {
            create: {
              label: meterLabel,
              values: {
                createMany: { data: values }
              }
            }
          }
        }
      });
    });

    // Re-fetch and return everything
    const user = await getUserWithMetersAndValues(key);
    return user;
  })
});
