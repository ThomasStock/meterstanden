import { createTheme } from "@mui/material/styles";

// Create a theme instance.
// https://www.schemecolor.com/spiritual-energy.php
const theme = createTheme({
  palette: {
    background: {
      default: "#3DA6AD"
    },
    primary: { main: "#E8915F" },
    secondary: { main: "#DDD0B1" },
    text: { primary: "#00777e", secondary: "#DDD0B1" }
  }
});

export type Theme = typeof theme;

export default theme;
