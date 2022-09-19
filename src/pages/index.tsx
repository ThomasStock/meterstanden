import type { NextPage } from "next";
import Head from "next/head";
import { DateTime } from "luxon";
import DailyUseGraph, { Entry } from "../components/DailyUseGraph";
import { useMemo, useState } from "react";
import { Button, InputAdornment, MenuItem, TextField } from "@mui/material";
import Stack from "@mui/material/Stack";
import getDailyAverages from "../utils/getDailyAverages";

const dummy: Entry[] = [
  { date: DateTime.fromISO("2020-10-01"), value: 16208 },
  { date: DateTime.fromISO("2021-10-11T09:24:12"), value: 18362 },
  { date: DateTime.fromISO("2022-08-29"), value: 20257 },
  { date: DateTime.fromISO("2022-09-14"), value: 20322.3 }
];

const Home: NextPage = () => {
  const [meterValues, setMeterValues] = useState(dummy);
  const lastMeterValue = meterValues[meterValues.length - 1]?.value;

  const dailyAverages = useMemo(
    () => getDailyAverages(meterValues),
    [meterValues]
  );

  const [input, setInput] = useState<number | undefined>();

  return (
    <>
      <Head>
        <title>Meterstanden</title>
        <meta name="description" content="Analoge meterstanden opvolgen" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className="container mx-auto flex flex-col items-center justify-center p-5 max-w-2xl">
        <Stack direction="row" spacing={2} className="pb-5 container flex">
          <TextField
            autoComplete="off"
            InputProps={{
              endAdornment: (
                <InputAdornment position="start">kWh</InputAdornment>
              )
            }}
            value={input ?? ""}
            onChange={(event) => setInput(parseFloat(event.target.value))}
            placeholder={lastMeterValue ? lastMeterValue.toFixed(1) : ""}
            className="flex-grow flex-shrink"
            inputProps={{ inputMode: "decimal", pattern: "[0-9.]*" }}
          />
          <TextField
            autoComplete="off"
            select
            value={"now"}
            className="flex-shrink-0"
          >
            <MenuItem key={"now"} value={"now"}>
              Right now
            </MenuItem>
            <MenuItem key={"pick"} value={"pick"}>
              Pick date...
            </MenuItem>
          </TextField>
          <Button
            disabled={!input}
            onClick={() => {
              setMeterValues([
                ...meterValues,
                { date: DateTime.now(), value: input as number }
              ]);
              setInput(undefined);
            }}
            variant="outlined"
          >
            Add
          </Button>
        </Stack>

        <DailyUseGraph
          title="Gemiddeld verbruik/dag"
          energyUnit="kWh"
          data={dailyAverages}
        />
      </main>
    </>
  );
};

export default Home;
