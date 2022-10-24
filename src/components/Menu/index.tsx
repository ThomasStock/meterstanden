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

const Menu = () => {
  const [selectedIndex, setSelectedIndex] = useState(0);

  const menuHeightProps: SxProps<Theme> = {
    height: { xs: 50, sm: 70 }
  };

  const entryHeightProps: SxProps<Theme> = {
    height: { xs: 70, sm: 90 }
  };

  return (
    <>
      <Box sx={entryHeightProps}></Box>
      <Box sx={menuHeightProps}></Box>
      <Box
        sx={(theme) => ({
          position: "fixed",
          bottom: menuHeightProps.height,
          ...entryHeightProps,
          right: 0,
          left: 0,
          zIndex: 90,
          backgroundColor: theme.palette.background.paper
        })}
      >
        entry
      </Box>
      <Box
        sx={(theme) => ({
          position: "fixed",
          bottom: 0,
          right: -25,
          left: -25,
          ...menuHeightProps,
          zIndex: "100",
          backgroundColor: theme.palette.background.paper
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
              zIndex={200 - i}
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
  zIndex: number;
}
const MenuItem = (props: MenuItemProps) => {
  const { meterUI, selected, onSelect, zIndex } = props;
  const { label, Icon, bgColor } = meterUI;

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  const renderMobile = () => {
    return (
      <Stack
        sx={{
          height: "100%",
          alignItems: "center",
          justifyContent: "center",
          transform: "skewX(15deg)"
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
          transform: "scale(1) skewX(-15deg)",
          filter: "drop-shadow(0px 0px 0px rgb(0,0,0,0))"
        },
        selected: {
          transform: "scale(1) skewX(-15deg)",
          filter: "drop-shadow(2px 4px 6px rgb(0,0,0,0.3))",
          zIndex: 105
        },
        unselected: {
          transform: "scale(1) skewX(-15deg)",
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
