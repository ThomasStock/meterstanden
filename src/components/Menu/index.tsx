import {
  Box,
  SxProps,
  Theme,
  Typography,
  useMediaQuery,
  useTheme
} from "@mui/material";
import { Stack } from "@mui/system";
import { motion } from "framer-motion";
import React, { useState } from "react";
import meterUIs, { MeterUI } from "./MeterUI";

const menuSpacerProps: SxProps<Theme> = {
  height: 100,
  maxHeight: "10vh"
};

const Menu = () => {
  const [selectedIndex, setSelectedIndex] = useState(0);

  return (
    <>
      <Box sx={menuSpacerProps}></Box>
      <Box
        sx={(theme) => ({
          position: "fixed",
          bottom: 0,
          right: -25,
          left: -25,
          ...menuSpacerProps,
          zIndex: "100",
          backgroundColor: theme.palette.secondary.main
        })}
      >
        <Stack
          direction={"row"}
          sx={{
            height: "100%"
          }}
        >
          {meterUIs.map((meterUI, i) => (
            <MenuItem
              key={i}
              onSelect={() => setSelectedIndex(i)}
              selected={selectedIndex === i}
              meterUI={meterUI}
            />
          ))}
        </Stack>
      </Box>
    </>
  );
};

interface MenuItemProps {
  meterUI: MeterUI;
  selected: boolean;
  onSelect: () => void;
}
const MenuItem = (props: MenuItemProps) => {
  const { meterUI, selected, onSelect } = props;
  const { label, Icon, bgColor } = meterUI;

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  const renderMobile = () => {
    return (
      <Stack
        sx={{
          height: "100%",
          alignItems: "center",
          justifyContent: "center"
        }}
      >
        <Icon
          sx={{
            height: "60%",
            width: "60%"
          }}
        />
      </Stack>
    );
  };

  const renderDesktop = () => {
    return (
      <Stack
        direction={"row"}
        sx={{
          height: "100%",
          alignItems: "center",
          justifyContent: "center",
          transform: "skewX(15deg)"
        }}
      >
        <Icon
          sx={{
            height: "40%",
            mr: 1
          }}
        />
        <Typography
          variant={"caption"}
          sx={{
            verticalAlign: "top",
            fontWeight: selected ? 400 : 100
          }}
        >
          {label}
        </Typography>
      </Stack>
    );
  };

  return (
    <Stack
      onClick={onSelect}
      component={motion.div}
      variants={{
        initial: {
          filter: "drop-shadow(0px 0px 0px rgb(0,0,0,0))",
          transform: "scale(1) skewX(-15deg)"
        },
        selected: {
          filter: "drop-shadow(2px 4px 6px rgb(0,0,0,0.3))",
          transform: "scale(1.05) skewX(-15deg)",
          zIndex: 105
        },
        unselected: {
          filter: "drop-shadow(0px 0px 0px rgb(0,0,0,0))",
          transform: "scale(0.8) skewX(-15deg)",
          zIndex: 95
        }
      }}
      animate={selected ? "selected" : "initial"}
      sx={{
        backgroundColor: bgColor,
        width: "100%",
        justifyContent: "center",
        transformOrigin: "bottom"
      }}
    >
      {isMobile ? renderMobile() : renderDesktop()}
    </Stack>
  );
};

export default Menu;
