"use client";

import MenuIcon from "@mui/icons-material/Menu";
import LogoutOutlinedIcon from "@mui/icons-material/LogoutOutlined";
import AppBar from "@mui/material/AppBar";
import Button from "@mui/material/Button";
import IconButton from "@mui/material/IconButton";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import { useRouter } from "next/navigation";

import { useAuth } from "@/features/auth/presentation/AuthProvider";
import { ColorModeToggle } from "@/shared/components/ColorModeToggle";
import Box from "@mui/material/Box";

interface AppHeaderProps {
  onMenuToggle: () => void;
}

export function AppHeader({ onMenuToggle }: AppHeaderProps) {
  const router = useRouter();
  const { logout } = useAuth();

  async function handleLogout() {
    try {
      await logout();
    } finally {
      router.replace("/login");
    }
  }

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
        <Box
          component="img"
          src={"/images/Logo.png"}
          sx={{ width: 50, height: 50, mb: 1 }}
        />
        <Typography
          component="span"
          noWrap
          sx={{ flexGrow: 1, fontWeight: 700, minWidth: 0 }}
          variant="h6"
        >
          Minha Saúde Feminina
        </Typography>
        <ColorModeToggle />
        <Button
          aria-label="Sair do painel"
          color="inherit"
          onClick={handleLogout}
          startIcon={<LogoutOutlinedIcon />}
          sx={{
            borderColor: "rgba(255, 255, 255, 0.72)",
            color: "common.white",
            flexShrink: 0,
            mr: 0.5,
            "&:hover": { borderColor: "common.white" },
          }}
          variant="outlined"
        >
          Sair
        </Button>
      </Toolbar>
    </AppBar>
  );
}
