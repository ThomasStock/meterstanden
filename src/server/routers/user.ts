import { t } from "../trpc";
import { prisma } from "~/server/db/client";
import { z } from "zod";

export const userRouter = t.router({
  create: t.procedure.mutation(async () => {
    const key = makeId(5);
    const user = await prisma.user.create({ data: { key } });
    console.log("created for key", user.key);
    return user.key;
  }),
  check: t.procedure.input(z.string()).query(async ({ input: key }) => {
    const user = await prisma.user.findFirst({ where: { key } });
    return !!user;
  })
});

// https://stackoverflow.com/questions/1349404/generate-random-string-characters-in-javascript
// But I removed confusing chars such as i, I, l, L, 1, 0, o, O
const makeId = (length: number) => {
  let result = "";
  const characters = "ABCDEFGHJKMNPQRSTUVWXYZabcdefghjkmnpqrstuvwxyz23456789";
  const charactersLength = characters.length;
  for (let i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength));
  }
  return result;
};
