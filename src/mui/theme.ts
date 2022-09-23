import { createTheme } from "@mui/material/styles";

// Create a theme instance.
// https://www.schemecolor.com/spiritual-energy.php
const theme = createTheme({
  palette: {
    background: {
      default: "#3DA6AD"
    },
    primary: { main: "#3da6ad" },
    secondary: { main: "#E8915F" },
    text: { primary: "#00777e", secondary: "#DDD0B1" }
  }
});

export default theme;
