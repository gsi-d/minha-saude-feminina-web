"use client";

import MenuIcon from "@mui/icons-material/Menu";
import AccountCircleOutlinedIcon from "@mui/icons-material/AccountCircleOutlined";
import LogoutOutlinedIcon from "@mui/icons-material/LogoutOutlined";
import AppBar from "@mui/material/AppBar";
import Button from "@mui/material/Button";
import IconButton from "@mui/material/IconButton";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import Divider from "@mui/material/Divider";
import Typography from "@mui/material/Typography";
import Toolbar from "@mui/material/Toolbar";
import { useRouter } from "next/navigation";
import { useState, type MouseEvent } from "react";

import { useAuth } from "@/features/auth/presentation/AuthProvider";
import { ColorModeToggle } from "@/shared/components/ColorModeToggle";
import Box from "@mui/material/Box";

interface AppHeaderProps {
  onMenuToggle: () => void;
}

export function AppHeader({ onMenuToggle }: AppHeaderProps) {
  const router = useRouter();
  const { logout, userName } = useAuth();
  const [profileAnchor, setProfileAnchor] = useState<HTMLElement | null>(null);

  function handleProfileOpen(event: MouseEvent<HTMLButtonElement>) {
    setProfileAnchor(event.currentTarget);
  }

  function handleProfileClose() {
    setProfileAnchor(null);
  }

  async function handleLogout() {
    handleProfileClose();
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
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '100%'}}>
          <Box
            component="img"
            src={"/images/Logo-Branca.png"}
            sx={{ width: 45, height: 45, mb: 1 }}
          />
          <Box sx={{ alignItems: "center", display: "flex", gap: 1 }}>
            <ColorModeToggle />
            <Button
              aria-controls={profileAnchor ? "profile-menu" : undefined}
              aria-expanded={profileAnchor ? "true" : undefined}
              aria-haspopup="menu"
              aria-label="Abrir menu do perfil"
              color="inherit"
              onClick={handleProfileOpen}
              startIcon={<AccountCircleOutlinedIcon />}
              sx={{
                borderColor: "rgba(255, 255, 255, 0.72)",
                color: "common.white",
                flexShrink: 0,
                mr: 0.5,
                "&:hover": { borderColor: "common.white" },
              }}
              variant="outlined"
            >
              {userName ?? "Perfil"}
            </Button>
            <Menu
              anchorEl={profileAnchor}
              anchorOrigin={{ horizontal: "right", vertical: "bottom" }}
              id="profile-menu"
              onClose={handleProfileClose}
              open={Boolean(profileAnchor)}
              transformOrigin={{ horizontal: "right", vertical: "top" }}
            >
              <MenuItem disabled sx={{ opacity: "1 !important", minWidth: 220 }}>
                <ListItemIcon>
                  <AccountCircleOutlinedIcon />
                </ListItemIcon>
                <ListItemText
                  primary="Usuário conectado"
                  secondary={userName ?? "Nome não informado"}
                  slotProps={{ primary: { variant: "caption" }, secondary: { variant: "body2" } }}
                />
              </MenuItem>
              <Divider />
              <MenuItem onClick={handleLogout}>
                <ListItemIcon>
                  <LogoutOutlinedIcon fontSize="small" />
                </ListItemIcon>
                <Typography>Sair</Typography>
              </MenuItem>
            </Menu>
          </Box>
        </Box>
      </Toolbar>
    </AppBar>
  );
}
