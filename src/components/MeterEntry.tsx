import { Stack, TextField, InputAdornment, Button } from "@mui/material";
import { DateTime } from "luxon";
import { useState } from "react";
import { DesktopDatePicker } from "@mui/x-date-pickers/DesktopDatePicker";
import useAppStore from "../utils/useAppStore";

const MeterEntry = () => {
  const { meterValues, addMeterValue } = useAppStore();

  // This is used as placeholder for the input
  const lastMeterValue = meterValues[meterValues.length - 1]?.value;

  const [input, setInput] = useState<number | undefined>();
  const [inputDate, setInputDate] = useState<DateTime | null>(DateTime.now);

  return (
    <Stack direction="row" spacing={2} className="pb-5 container flex">
      <TextField
        autoComplete="off"
        InputProps={{
          endAdornment: <InputAdornment position="start">kWh</InputAdornment>
        }}
        value={input ?? ""}
        onChange={(event) => setInput(parseFloat(event.target.value))}
        placeholder={lastMeterValue ? lastMeterValue.toFixed(1) : ""}
        className="flex-grow flex-shrink"
        inputProps={{ inputMode: "decimal", pattern: "[0-9.]*" }}
      />

      <DesktopDatePicker
        disableFuture
        minDate={DateTime.now().minus({ year: 10 })}
        maxDate={DateTime.now()}
        value={inputDate}
        onChange={(newValue) => {
          setInputDate(newValue);
        }}
        inputFormat="dd/MM/yyyy"
        renderInput={(params) => <TextField {...params} />}
        className="flex-shrink-0"
      />

      <Button
        disabled={!input || !inputDate?.isValid}
        onClick={() => {
          addMeterValue({
            date: inputDate as DateTime,
            value: input as number
          });
          setInput(undefined);
        }}
        variant="outlined"
      >
        Toevoegen
      </Button>
    </Stack>
  );
};

export default MeterEntry;
