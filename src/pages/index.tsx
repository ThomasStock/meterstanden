import type { NextPage } from "next";
import Head from "next/head";
import { DateTime } from "luxon";
import Graph, { Entry } from "../components/Graph";
import { useMemo, useState } from "react";
import { Button, InputAdornment, TextField } from "@mui/material";
import Stack from "@mui/material/Stack";
import getDailyAverages from "../utils/getDailyAverages";
import { DesktopDatePicker } from "@mui/x-date-pickers/DesktopDatePicker";

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
  const [inputDate, setInputDate] = useState<DateTime | null>(DateTime.now);

  console.log("date", inputDate?.isValid);

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
              setMeterValues([
                ...meterValues,
                { date: DateTime.now(), value: input as number }
              ]);
              setInput(undefined);
            }}
            variant="outlined"
          >
            Toevoegen
          </Button>
        </Stack>

        <Graph
          title="Gemiddeld verbruik/dag"
          energyUnit="kWh"
          data={dailyAverages}
          isAverage
        />

        <Graph
          title="Meterstand evolutie"
          energyUnit="kWh"
          data={meterValues}
        />
      </main>
    </>
  );
};

export default Home;
