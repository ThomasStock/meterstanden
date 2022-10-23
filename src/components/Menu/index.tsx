import {
  Box,
  SxProps,
  Theme,
  Typography,
  useMediaQuery,
  useTheme
} from "@mui/material";
import { Stack } from "@mui/system";
import React from "react";
import meterUIs, { MeterUI } from "./MeterUI";

const menuSpacerProps: SxProps<Theme> = {
  height: 100,
  maxHeight: "10vh"
};

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
          justifyContent: "center"
        }}
      >
        <Icon
          sx={{
            height: { xs: "60%", sm: "40%" },
            width: { xs: "60%", sm: "40%" }
          }}
        />
        {!isMobile ? (
          <Typography
            variant={"caption"}
            sx={{
              verticalAlign: "top"
            }}
          >
            {label}
          </Typography>
        ) : null}
      </Stack>
    </Stack>
  );
};

export default Menu;
