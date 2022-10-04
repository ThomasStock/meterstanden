import { Stack, Button, Typography } from "@mui/material";
import { useContext } from "react";
import UserContext from "~/users/UserContext";
import { trpc } from "~/utils/trpc";

const DevTools = () => {
  const { user, logOut } = useContext(UserContext);

  const utils = trpc.useContext();
  const deleteLastQuery = trpc.meterValue.deleteLastAdded.useMutation({
    onSuccess: () => {
      utils.user.get.invalidate();
    }
  });
  const deleteAllQuery = trpc.meterValue.deleteAll.useMutation({
    onSuccess: () => {
      utils.meterValue.list.invalidate();
    }
  });
  const loadDemoData = trpc.meterValue.loadDemoData.useMutation({
    onSuccess: () => {
      utils.meterValue.list.invalidate();
    }
  });

  const isQueryRunning =
    !deleteLastQuery.isIdle || !deleteAllQuery.isIdle || !loadDemoData.isIdle;

  return (
    <Stack spacing={0}>
      <h4>Dev tools (Gebruik dit maar hoor)</h4>

      <Button
        onClick={() => {
          logOut();
        }}
        disabled={!key}
      >
        Clear local user key
      </Button>
      <Button
        onClick={async () => {
          if (key) {
            await deleteLastQuery.mutateAsync(key);
            deleteLastQuery.reset();
          }
        }}
        disabled={isQueryRunning}
      >
        Delete last entry
      </Button>
      <Button
        onClick={async () => {
          if (key) {
            await deleteAllQuery.mutateAsync(key);
            deleteAllQuery.reset();
          }
        }}
        disabled={isQueryRunning}
      >
        Clear all data
      </Button>
      <Button
        onClick={async () => {
          if (key) {
            await loadDemoData.mutateAsync(key);
            loadDemoData.reset();
          }
        }}
        disabled={isQueryRunning}
      >
        Load demo data
      </Button>

      <Typography variant="caption" color="GrayText">
        <>Your unique key is: {key}</>
      </Typography>

      <b>Todo prios</b>
      <ol>
        <li>[DONE] Make unique key per device and link data to it</li>
        <li>grid/table data entry/edit/delete</li>
        <li>better date picking (of vervangen door link naar grid edit)</li>
        <li>Share readonly link</li>
        <li>
          Create personal link via mail (to reuse unique key on other devices)
        </li>
        <li>Localization</li>
        <li>Gas/Water tabs</li>
        <li>Zonnepaneel shit bekijken</li>
      </ol>
    </Stack>
  );
};

export default DevTools;
