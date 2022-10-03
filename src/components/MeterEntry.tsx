import {
  Stack,
  TextField,
  InputAdornment,
  Button,
  Box,
  Collapse,
  useMediaQuery,
  useTheme,
  Paper,
  Typography
} from "@mui/material";
import { DateTime } from "luxon";
import React, { useContext, useEffect, useState } from "react";
import { DesktopDatePicker } from "@mui/x-date-pickers/DesktopDatePicker";
import { trpc } from "~/utils/trpc";
import { Prisma } from "@prisma/client";
import UserContext from "~/users/UserContext";
import { motion } from "framer-motion";

const yshow = 0;
const yhide = -80;

const MeterEntry = () => {
  const { key } = useContext(UserContext);

  const [y, sety] = useState(yhide);

  const utils = trpc.useContext();
  const meterValueQuery = trpc.meterValue.list.useQuery(key!, {
    enabled: !!key
  });
  const meterValues = meterValueQuery.data;

  const addMeterValue = trpc.meterValue.add.useMutation({
    onSuccess: () => {
      utils.meterValue.list.invalidate();
    }
  });

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  // using useEffect to set initial (current) date to fix SSR
  useEffect(() => {
    setInputDate(DateTime.now);
  }, []);

  const [input, setInput] = useState("");
  let meterValue = new Prisma.Decimal(NaN);
  try {
    meterValue = new Prisma.Decimal(input);
  } catch {}

  const [inputDate, setInputDate] = useState<DateTime | null>(null);

  const isValid = meterValue && !meterValue.isNaN() && inputDate?.isValid;

  // This is used as placeholder for the input
  const biggestMeterValue = Prisma.Decimal.max(
    ...(meterValues?.map((v) => v.value) ?? []),
    meterValue.isNaN() ? 0 : meterValue
  );

  const renderButton = () => (
    <Button
      type="submit"
      variant="contained"
      size="large"
      sx={{ height: "inherit" }}
      disabled={!isValid || addMeterValue.isLoading}
      fullWidth={isMobile}
    >
      Toevoegen
    </Button>
  );

  return (
    <motion.div
      style={{
        // transform: "translateY(-70%)",
        transform: "translateX(-50%)",
        left: "50%",
        position: "fixed",
        top: 0
      }}
      animate={{
        transform: `translateX(-50%) translateY(${y}%)`
      }}
      onClick={() => sety(y === yshow ? yhide : yshow)}
      whileHover={{
        transform: `translateX(-50%) translateY(${yshow}%)`
      }}
    >
      <Paper
        sx={{
          px: 4,
          py: 2,
          my: 2
        }}
      >
        <form
          onSubmit={async (e) => {
            e.preventDefault();
            if (isValid && key) {
              await addMeterValue.mutateAsync({
                date: inputDate.toJSDate(),
                value: meterValue.toNumber(),
                userId: key
              });
              setInput("");
              setInputDate(DateTime.now());
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
                disabled={addMeterValue.isLoading}
                onChange={(event) => setInput(event.target.value)}
                placeholder={
                  biggestMeterValue ? biggestMeterValue.toFixed?.(1) : ""
                }
                inputProps={{ inputMode: "decimal", pattern: "[0-9.]*" }}
                fullWidth
                error={input.length ? meterValue.isNaN() : false}
              />

              <DesktopDatePicker
                value={inputDate}
                onChange={(newValue) => {
                  setInputDate(newValue);
                }}
                inputFormat="dd/MM/yyyy"
                disabled={addMeterValue.isLoading}
                renderInput={(params) => (
                  <Box
                    sx={{ display: "flex", alignItems: "center" }}
                    ref={params.inputRef}
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
                  in={!meterValue.isNaN()}
                  orientation={"vertical"}
                  collapsedSize={0}
                >
                  {renderButton()}
                </Collapse>
              ) : (
                <Collapse
                  in={!meterValue.isNaN()}
                  orientation={"horizontal"}
                  collapsedSize={0}
                >
                  {renderButton()}
                </Collapse>
              )
            }
          </Stack>
        </form>
      </Paper>
    </motion.div>
  );
};

export default MeterEntry;
