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
        secondary: { main: "#F3DDE4" },
        tertiary: { main: "#D95C6A" },
        background: { default: "#211A1D", paper: "#2C2327" },
        text: { primary: "#F8ECEF", secondary: "#D8C2C9" },
        divider: "rgba(229, 185, 198, 0.18)",
        action: {
          hover: "rgba(197, 102, 130, 0.10)",
          selected: "rgba(197, 102, 130, 0.18)",
        },
        error: { main: "#EF6A7A" },
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
