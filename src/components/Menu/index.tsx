import { Box, Typography } from "@mui/material";
import { Stack } from "@mui/system";
import meterUIs, { MeterUI } from "./MeterUI";

const Menu = () => {
  return (
    <Box
      sx={{
        position: "fixed",
        bottom: 0,
        right: 0,
        left: 0,
        height: 110
      }}
    >
      <Stack
        direction={"row"}
        sx={{
          height: "100%"
        }}
      >
        {meterUIs.map((meterUI, i) => (
          <MenuItem key={i} meterUI={meterUI} />
        ))}
      </Stack>
    </Box>
  );
};

interface MenuItemProps {
  meterUI: MeterUI;
}
const MenuItem = (props: MenuItemProps) => {
  const { meterUI } = props;
  const { label, Icon, bgColor } = meterUI;
  return (
    <Stack
      sx={{
        backgroundColor: bgColor,
        width: "100%",
        justifyContent: "center"
      }}
    >
      <Stack
        direction={"column"}
        sx={{
          height: "100%",
          alignItems: "center",
          justifyContent: "space-between"
        }}
      >
        <Box sx={{ height: "25%" }}>
          <Typography variant={"caption"}>&nbsp;</Typography>
        </Box>
        <Icon sx={{ fontSize: 48 }} />
        <Box sx={{ height: "35%" }}>
          <Typography variant={"caption"}>{label}</Typography>
        </Box>
      </Stack>
    </Stack>
  );
};

export default Menu;
