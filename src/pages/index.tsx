import type { NextPage } from "next";
import Head from "next/head";
import Graph from "../components/Graph";
import { Fragment, useMemo, useEffect } from "react";
import getDailyAverages from "../utils/getDailyAverages";
import MeterEntry from "../components/MeterEntry";
import useAppStore from "../utils/useAppStore";
import periodsForAverage from "../utils/periodsForAverage";
import { Box, Divider, Paper, PaperProps } from "@mui/material";
import { Stack } from "@mui/system";
import Link from "next/link";
import { trpc } from "~/utils/trpc";

const Home: NextPage = () => {
  const { meterValues } = useAppStore();

  const utils = trpc.useContext();
  const postsQuery = trpc.post.list.useInfiniteQuery(
    {
      limit: 5
    },
    {
      getPreviousPageParam(lastPage) {
        return lastPage.nextCursor;
      }
    }
  );

  useEffect(() => {
    const allPosts = postsQuery.data?.pages.flatMap((page) => page.items) ?? [];
    for (const { id } of allPosts) {
      void utils.post.byId.prefetch({ id });
    }
  }, [postsQuery.data, utils]);

  const dailyAverages = useMemo(
    () => getDailyAverages(meterValues),
    [meterValues]
  );

  return (
    <>
      <Head>
        <title>Meterstanden</title>
        <meta name="description" content="Analoge meterstanden opvolgen" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <Stack direction={"column"} spacing={5} sx={{ my: 5 }}>
        <RootPaper>
          <MeterEntry />
        </RootPaper>

        {postsQuery.data?.pages.map((page, index) => (
          <Fragment key={page.items[0]?.id || index}>
            {page.items.map((item) => (
              <article key={item.id}>
                <h3>{item.title}</h3>
                <Link href={`/post/${item.id}`}>
                  <a>View more</a>
                </Link>
              </article>
            ))}
          </Fragment>
        ))}

        <Box>
          <RootPaper>
            <Stack direction={"column"} divider={<Divider />} spacing={2}>
              <Graph
                graphKey="averageUsePerDayElectricity"
                title="Gemiddeld verbruik/dag"
                energyUnit="kWh"
                data={dailyAverages}
                isAverage
                periods={periodsForAverage}
              />
              <Graph
                graphKey="totalUseElectricty"
                title="Meterstand evolutie"
                energyUnit="kWh"
                data={meterValues}
              />
            </Stack>
          </RootPaper>
        </Box>
      </Stack>
    </>
  );
};

export default Home;

const RootPaper = (props: PaperProps) => (
  <Paper
    sx={{ mx: { xs: 2, sm: 5 }, p: { xs: 3, sm: 5 } }}
    elevation={12}
    {...props}
  />
);
