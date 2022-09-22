import {
  Stack,
  TextField,
  InputAdornment,
  Button,
  Box,
  Collapse,
  useMediaQuery,
  useTheme
} from "@mui/material";
import { DateTime } from "luxon";
import { useEffect, useRef, useState } from "react";
import { DesktopDatePicker } from "@mui/x-date-pickers/DesktopDatePicker";
import useAppStore from "../utils/useAppStore";

const MeterEntry = () => {
  const { meterValues, addMeterValue } = useAppStore();

  const containerRef = useRef(null);

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  console.log({ isMobile, theme });

  // using useEffect to set initial (current) date to fix SSR
  useEffect(() => {
    setInputDate(DateTime.now);
  }, []);

  // This is used as placeholder for the input
  const lastMeterValue = meterValues[meterValues.length - 1]?.value;

  const [input, setInput] = useState<string | undefined>();
  const meterValue = input ? parseFloat(input) : undefined;

  const [inputDate, setInputDate] = useState<DateTime | null>(null);

  const isValid = meterValue && meterValue !== NaN && inputDate?.isValid;

  const renderButton = () => (
    <Button
      type="submit"
      variant="contained"
      size="large"
      sx={{ height: "inherit" }}
      disabled={!isValid}
      fullWidth={isMobile}
      onClick={() => {
        if (isValid) {
          addMeterValue({
            date: inputDate as DateTime,
            value: meterValue
          });
          setInput(undefined);
        }
      }}
    >
      Toevoegen
    </Button>
  );

  return (
    <form>
      <h4>Huidige meterstand ingeven</h4>

      <Stack
        direction={{ xs: "column", sm: "row" }}
        spacing={3}
        ref={containerRef}
      >
        <Stack direction={"row"} flexGrow={1} justifyContent="space-around">
          <TextField
            autoComplete="off"
            InputProps={{
              endAdornment: (
                <InputAdornment position="start">kWh</InputAdornment>
              )
            }}
            value={input ?? ""}
            onChange={(event) => setInput(event.target.value)}
            placeholder={lastMeterValue ? lastMeterValue.toFixed(1) : ""}
            inputProps={{ inputMode: "decimal", pattern: "[0-9.]*" }}
            fullWidth
          />

          <DesktopDatePicker
            value={inputDate}
            onChange={(newValue) => {
              setInputDate(newValue);
            }}
            inputFormat="dd/MM/yyyy"
            renderInput={(params) => (
              <Box sx={{ display: "flex", alignItems: "center" }}>
                {params.InputProps?.endAdornment}
              </Box>
            )}
          />
        </Stack>

        {isMobile ? (
          <Collapse in={!!input} orientation={"vertical"} collapsedSize={0}>
            {renderButton()}
          </Collapse>
        ) : (
          <Collapse in={!!input} orientation={"horizontal"} collapsedSize={0}>
            {renderButton()}
          </Collapse>
        )}
      </Stack>
    </form>
  );
};

export default MeterEntry;
