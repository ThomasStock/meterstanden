import { Box, Typography, useMediaQuery, useTheme } from "@mui/material";
import { Stack } from "@mui/system";
import React from "react";
import { menuSpacerProps } from "./menuSpacerProps";
import meterUIs, { MeterUI } from "./MeterUI";

const Menu = () => {
  return (
    <>
      <Box sx={menuSpacerProps}></Box>
      <Box
        sx={{
          position: "fixed",
          bottom: 0,
          right: 0,
          left: 0,
          ...menuSpacerProps,
          zIndex: "100"
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
    </>
  );
};

interface MenuItemProps {
  meterUI: MeterUI;
}
const MenuItem = (props: MenuItemProps) => {
  const { meterUI } = props;
  const { label, Icon, bgColor } = meterUI;

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  const renderLabelBox = (text: React.ReactNode) => (
    <Box sx={{ height: { xs: "20%", sm: "30%" } }}>
      <Typography variant={"caption"} sx={{ verticalAlign: "top" }}>
        {text}
      </Typography>
    </Box>
  );

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
        {renderLabelBox(<>&nbsp;</>)}
        <Icon
          sx={{
            height: { xs: "60%", sm: "40%" },
            width: { xs: "60%", sm: "40%" }
          }}
        />
        {renderLabelBox(isMobile ? <>&nbsp;</> : label)}
      </Stack>
    </Stack>
  );
};

export default Menu;
