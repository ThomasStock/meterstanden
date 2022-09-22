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
import { trpc } from "~/utils/trpc";

const MeterEntry = () => {
  const utils = trpc.useContext();
  const meterValueQuery = trpc.meterValue.list.useQuery();
  const meterValues = meterValueQuery.data;

  const addMeterValue = trpc.meterValue.add.useMutation({
    onSuccess: () => {
      utils.meterValue.list.invalidate();
    }
  });

  const containerRef = useRef(null);

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  // using useEffect to set initial (current) date to fix SSR
  useEffect(() => {
    setInputDate(DateTime.now);
  }, []);

  // This is used as placeholder for the input
  const lastMeterValue = meterValues?.[meterValues.length - 1]?.value;

  const [input, setInput] = useState("");
  const meterValue = parseFloat(input);

  const [inputDate, setInputDate] = useState<DateTime | null>(null);

  const isValid = meterValue && !isNaN(meterValue) && inputDate?.isValid;

  const renderButton = () => (
    <Button
      type="submit"
      variant="contained"
      size="large"
      sx={{ height: "inherit" }}
      disabled={!isValid}
      fullWidth={isMobile}
    >
      Toevoegen
    </Button>
  );

  return (
    <form
      onSubmit={async (e) => {
        e.preventDefault();
        if (isValid) {
          await addMeterValue.mutateAsync({
            date: inputDate.toJSDate(),
            value: meterValue
          });
          setInput("");
        }
      }}
    >
      <h4>Huidige meterstand ingeven</h4>
      <Stack direction={{ xs: "column", sm: "row" }} spacing={3}>
        <Stack direction={"row"} flexGrow={1} justifyContent="space-around">
          <TextField
            autoComplete="off"
            InputProps={{
              endAdornment: (
                <InputAdornment position="start">kWh</InputAdornment>
              )
            }}
            value={input}
            onChange={(event) => setInput(event.target.value)}
            placeholder={lastMeterValue ? lastMeterValue.toFixed?.(1) : ""}
            inputProps={{ inputMode: "decimal", pattern: "[0-9.]*" }}
            fullWidth
            error={input.length ? isNaN(meterValue) : false}
          />

          <DesktopDatePicker
            value={inputDate}
            onChange={(newValue) => {
              setInputDate(newValue);
            }}
            inputFormat="dd/MM/yyyy"
            renderInput={(params) => (
              <Box
                sx={{ display: "flex", alignItems: "center" }}
                ref={containerRef}
              >
                {params.InputProps?.endAdornment}
              </Box>
            )}
          />
        </Stack>

        {
          // We need to completely rerender the collapse
          //  when changing orientation to deal with some artifacts
          isMobile ? (
            <Collapse
              in={!isNaN(meterValue)}
              orientation={"vertical"}
              collapsedSize={0}
            >
              {renderButton()}
            </Collapse>
          ) : (
            <Collapse
              in={!isNaN(meterValue)}
              orientation={"horizontal"}
              collapsedSize={0}
            >
              {renderButton()}
            </Collapse>
          )
        }
      </Stack>
    </form>
  );
};

export default MeterEntry;
