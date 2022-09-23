import { Stack, Button } from "@mui/material";
import { trpc } from "~/utils/trpc";

const DevTools = () => {
  const utils = trpc.useContext();
  const deleteLastQuery = trpc.meterValue.deleteLastAdded.useMutation({
    onSuccess: () => {
      utils.meterValue.list.invalidate();
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
    <Stack>
      <h3>Dev tools</h3>
      <Button
        onClick={async () => {
          await deleteLastQuery.mutateAsync();
          deleteLastQuery.reset();
        }}
        disabled={isQueryRunning}
      >
        Delete last entry
      </Button>
      <Button
        onClick={async () => {
          await deleteAllQuery.mutateAsync();
          deleteAllQuery.reset();
        }}
        disabled={isQueryRunning}
      >
        Clear all data
      </Button>
      <Button
        onClick={async () => {
          await loadDemoData.mutateAsync();
          loadDemoData.reset();
        }}
        disabled={isQueryRunning}
      >
        Load demo data
      </Button>
    </Stack>
  );
};

export default DevTools;
