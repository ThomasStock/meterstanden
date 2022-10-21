import * as React from "react";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import WaterIcon from "@mui/icons-material/Water";
import BoltIcon from "@mui/icons-material/Bolt";
import LocalFireDepartmentIcon from "@mui/icons-material/LocalFireDepartment";

const MenuEntryTabBar = () => {
  const [value, setValue] = React.useState(0);

  const handleChange = (event: React.SyntheticEvent, newValue: number) => {
    setValue(newValue);
  };

  return (
    <Tabs value={value} onChange={handleChange} sx={{ mb: 1 }}>
      <Tab icon={<BoltIcon />} aria-label="Electriciteit" />
      <Tab icon={<LocalFireDepartmentIcon />} aria-label="Gas" />
      <Tab icon={<WaterIcon />} aria-label="Water" />
    </Tabs>
  );
};

export default MenuEntryTabBar;
