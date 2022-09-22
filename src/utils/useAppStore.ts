import { DateTime, DateTimeUnit } from "luxon";
import create from "zustand";

// const dummy = [
//   { date: DateTime.fromISO("2020-10-01"), value: 16208 },
//   { date: DateTime.fromISO("2021-10-11T09:24:12"), value: 18362 },
//   { date: DateTime.fromISO("2022-08-29"), value: 20257 },
//   { date: DateTime.fromISO("2022-09-14"), value: 20322.3 }
// ];

export interface PeriodOptions {
  label: string;
  min?: DateTime;
  timeUnit?: DateTimeUnit;
  relative?: boolean;
}

interface AppStore {
  // meterValues: Entry[];
  // addMeterValue: (newMeterValues: Entry) => void;
  selectedPeriods: Map<string, number>;
  selectPeriod: (graphKey: string, periodIndex: number) => void;
}

const useAppStore = create<AppStore>((set) => ({
  // meterValues: dummy,
  // addMeterValue: (newMeterValue: Entry) =>
  //   set((state) => ({ meterValues: [...state.meterValues, newMeterValue] })),
  selectedPeriods: new Map(),
  selectPeriod: (graphKey, periodIndex) =>
    set((state) => ({
      selectedPeriods: state.selectedPeriods.set(graphKey, periodIndex)
    }))
}));

export default useAppStore;
