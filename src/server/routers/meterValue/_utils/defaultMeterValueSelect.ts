import { Prisma } from "@prisma/client";

const defaultMeterValueSelect = Prisma.validator<Prisma.MeterValueSelect>()({
  id: true,
  date: true,
  value: true
});

export default defaultMeterValueSelect;
