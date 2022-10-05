import { t } from "~/server/trpc";
import { prisma } from "~/server/db/client";
import { z } from "zod";
import demoValues from "./_utils/demoValues";
import makeId from "./_utils/makeId";
import { Prisma } from "@prisma/client";

export const userKey = z.string();

const userWithMetersAndValues = Prisma.validator<Prisma.UserArgs>()({
  include: {
    meters: {
      orderBy: {
        createdAt: "asc"
      },
      include: {
        values: {
          orderBy: {
            date: "asc"
          }
        }
      }
    }
  }
});
export type UserWithMetersAndValues = Prisma.UserGetPayload<
  typeof userWithMetersAndValues
>;

const getUserWithMetersAndValues = async (key: string) => {
  const user = await prisma.user.findUniqueOrThrow({
    where: { key },
    ...userWithMetersAndValues
  });
  return user;
};

export const userRouter = t.router({
  get: t.procedure
    .input(userKey.optional())
    .query(async ({ input: clientsideKey }) => {
      if (clientsideKey) {
        const user = await getUserWithMetersAndValues(clientsideKey);
        return user;
      }
      // create user
      const key = makeId(5);
      console.log("<ADE", key);
      const user = await prisma.user.create({
        data: { key },
        ...userWithMetersAndValues
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
