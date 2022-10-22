import WaterIcon from "@mui/icons-material/Water";
import BoltIcon from "@mui/icons-material/Bolt";
import LocalFireDepartmentIcon from "@mui/icons-material/LocalFireDepartment";

export interface MeterUI {
  Icon: typeof WaterIcon;
  label: string;
  bgColor: string;
}

const meterUIs: MeterUI[] = [
  {
    Icon: BoltIcon,
    label: "Electriciteit",
    bgColor: "#ffb703"
  },
  {
    Icon: LocalFireDepartmentIcon,
    label: "Gas",
    bgColor: "#fb8500"
  },
  {
    Icon: WaterIcon,
    label: "Water",
    bgColor: "#8ecae6"
  }
];

export default meterUIs;
