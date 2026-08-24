"use client";

import DarkModeOutlinedIcon from "@mui/icons-material/DarkModeOutlined";
import LightModeOutlinedIcon from "@mui/icons-material/LightModeOutlined";
import IconButton from "@mui/material/IconButton";
import Tooltip from "@mui/material/Tooltip";
import { useColorScheme } from "@mui/material/styles";

import { getNextColorMode } from "@/shared/config/color-mode";

export function ColorModeToggle() {
  const { mode, setMode, systemMode } = useColorScheme();

  if (!mode) {
    return null;
  }

  const activeMode = mode === "system" ? systemMode : mode;
  const label = activeMode === "dark" ? "Ativar modo claro" : "Ativar modo escuro";

  return (
    <Tooltip title={label}>
      <IconButton
        aria-label={label}
        color="inherit"
        onClick={() => setMode(getNextColorMode(mode, systemMode))}
      >
        {activeMode === "dark" ? <LightModeOutlinedIcon /> : <DarkModeOutlinedIcon />}
      </IconButton>
    </Tooltip>
  );
}
