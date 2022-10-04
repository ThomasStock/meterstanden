import { z } from "zod";
import { meterId } from "~/server/routers/meter";

const meterValueCreateInput = z.object({
  date: z.date(),
  value: z.number().positive(),
  meterId
});

export default meterValueCreateInput;
