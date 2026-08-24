"use client";

import { createTheme } from "@mui/material/styles";
import type { PaletteColor, SimplePaletteColorOptions } from "@mui/material/styles";

declare module "@mui/material/styles" {
  interface CssThemeVariables {
    enabled: true;
  }

  interface Palette {
    tertiary: PaletteColor;
  }

  interface PaletteOptions {
    tertiary?: SimplePaletteColorOptions;
  }
}

export const appTheme = createTheme({
  cssVariables: {
    colorSchemeSelector: "class",
  },
  colorSchemes: {
    light: {
      palette: {
        primary: { main: "#C56682" },
        secondary: { main: "#fff6f8" },
        tertiary: { main: "#C43A4A" },
        background: { default: "#fff6f8", paper: "#ffebf0" },
        error: { main: "#b00020" },
      },
    },
    dark: {
      palette: {
        primary: { main: "#C56682" },
        secondary: { main: "#fff6f8" },
        tertiary: { main: "#C43A4A" },
        background: { default: "#1C1719", paper: "#1d1d1d" },
        error: { main: "#b00020" },
      },
    },
  },
  shape: {
    borderRadius: 12,
  },
  typography: {
    fontFamily: "Arial, Helvetica, sans-serif",
    h4: {
      fontWeight: 700,
    },
    h5: {
      fontWeight: 700,
    },
    button: {
      textTransform: "none",
      fontWeight: 600,
    },
  },
});
