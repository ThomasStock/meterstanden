import type { NextPage } from "next";
import Head from "next/head";

import { DateTime } from "luxon";
import DailyUseGraph, { Entry } from "../components/DailyUseGraph";
import { useState } from "react";
import { Button, InputAdornment, MenuItem, TextField } from "@mui/material";
import Stack from "@mui/material/Stack";

const dummy: Entry[] = [
  { date: DateTime.fromISO("2020-10-01"), value: 16208 },
  { date: DateTime.fromISO("2021-10-11T09:24:12"), value: 18362 },
  { date: DateTime.fromISO("2022-08-29"), value: 20257 },
  { date: DateTime.fromISO("2022-09-14"), value: 20322.3 }
];

const Home: NextPage = () => {
  const [data, setData] = useState(dummy);
  const lastInput = data[data.length - 1]?.value;

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
            placeholder={lastInput ? lastInput.toFixed(1) : ""}
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
              setData([
                ...data,
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
          title="Dagelijks verbruik laatste week"
          energyUnit="kWh"
          measurements={data}
          min={DateTime.now().minus({ week: 1 })}
          timeUnit="day"
          relative
        />
        <DailyUseGraph
          title="Dagelijks verbruik laatste maand"
          energyUnit="kWh"
          measurements={data}
          min={DateTime.now().minus({ month: 1 })}
          timeUnit="week"
          relative
        />
        <DailyUseGraph
          title="Dagelijks verbruik sinds begin metingen"
          energyUnit="kWh"
          measurements={data}
        />
      </main>
    </>
  );
};

export default Home;
