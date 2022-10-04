import { Prisma } from "@prisma/client";
import defaultMeterValueSelect from "../../meterValue/_utils/defaultMeterValueSelect";

const defaultMeterSelect = Prisma.validator<Prisma.MeterSelect>()({
  id: true,
  label: true,
  values: { select: defaultMeterValueSelect }
});

export default defaultMeterSelect;
