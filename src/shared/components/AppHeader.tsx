"use client";

import MenuIcon from "@mui/icons-material/Menu";
import MenuBookOutlinedIcon from "@mui/icons-material/MenuBookOutlined";
import AppBar from "@mui/material/AppBar";
import IconButton from "@mui/material/IconButton";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";

import { ColorModeToggle } from "@/shared/components/ColorModeToggle";

interface AppHeaderProps {
  onMenuToggle: () => void;
}

export function AppHeader({ onMenuToggle }: AppHeaderProps) {
  return (
    <AppBar
      color="primary"
      elevation={0}
      position="fixed"
      sx={{ zIndex: (theme) => theme.zIndex.drawer + 1 }}
    >
      <Toolbar>
        <IconButton
          aria-label="Abrir ou fechar menu principal"
          color="inherit"
          edge="start"
          onClick={onMenuToggle}
          sx={{ mr: 1 }}
        >
          <MenuIcon />
        </IconButton>
        <MenuBookOutlinedIcon sx={{ mr: 1.5 }} />
        <Typography component="span" sx={{ flexGrow: 1, fontWeight: 700 }} variant="h6">
          Minha Saúde Feminina
        </Typography>
        <ColorModeToggle />
      </Toolbar>
    </AppBar>
  );
}
