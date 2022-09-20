import { DateTime } from "luxon";
import create from "zustand";

export interface Entry {
  date: DateTime;
  value: number;
}

const dummy: Entry[] = [
  { date: DateTime.fromISO("2020-10-01"), value: 16208 },
  { date: DateTime.fromISO("2021-10-11T09:24:12"), value: 18362 },
  { date: DateTime.fromISO("2022-08-29"), value: 20257 },
  { date: DateTime.fromISO("2022-09-14"), value: 20322.3 }
];

interface AppStore {
  meterValues: Entry[];
  addMeterValue: (newMeterValues: Entry) => void;
}

const useAppStore = create<AppStore>((set) => ({
  meterValues: dummy,
  addMeterValue: (newMeterValue: Entry) =>
    set((state) => ({ meterValues: [...state.meterValues, newMeterValue] }))
}));

export default useAppStore;
