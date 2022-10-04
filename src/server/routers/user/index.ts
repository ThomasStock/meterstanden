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
  const users = await prisma.user.findUniqueOrThrow({
    where: { key },
    ...userWithMetersAndValues
  });
  return users;
};

export const userRouter = t.router({
  create: t.procedure.mutation(async () => {
    const key = makeId(5);
    const user = await prisma.user.create({
      data: { key },
      ...userWithMetersAndValues
    });
    return user;
  }),
  get: t.procedure.input(z.string()).query(async ({ input: key }) => {
    const user = await getUserWithMetersAndValues(key);
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
