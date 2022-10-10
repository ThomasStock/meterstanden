import { Prisma } from "@prisma/client";

export const userWithMetersAndValues = Prisma.validator<Prisma.UserArgs>()({
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
