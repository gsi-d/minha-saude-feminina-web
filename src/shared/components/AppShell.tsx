"use client";

import Box from "@mui/material/Box";
import Container from "@mui/material/Container";
import Drawer from "@mui/material/Drawer";
import Toolbar from "@mui/material/Toolbar";
import useMediaQuery from "@mui/material/useMediaQuery";
import { useTheme } from "@mui/material/styles";
import { type PropsWithChildren, useState } from "react";

import { AppHeader } from "@/shared/components/AppHeader";
import { SideNavigation } from "@/shared/components/SideNavigation";

const drawerWidth = 240;

export function AppShell({ children }: PropsWithChildren) {
  const theme = useTheme();
  const isDesktop = useMediaQuery(theme.breakpoints.up("md"));
  const [desktopOpen, setDesktopOpen] = useState(true);
  const [mobileOpen, setMobileOpen] = useState(false);
  const drawerOpen = isDesktop ? desktopOpen : mobileOpen;

  function handleMenuToggle() {
    if (isDesktop) {
      setDesktopOpen((open) => !open);
      return;
    }

    setMobileOpen((open) => !open);
  }

  function handleNavigate() {
    if (!isDesktop) {
      setMobileOpen(false);
    }
  }

  return (
    <Box sx={{ display: "flex", minHeight: "100vh" }}>
      <AppHeader onMenuToggle={handleMenuToggle} />

      <Drawer
        ModalProps={{ keepMounted: true }}
        onClose={() => setMobileOpen(false)}
        open={drawerOpen}
        sx={{
          flexShrink: 0,
          width: isDesktop && desktopOpen ? drawerWidth : 0,
          "& .MuiDrawer-paper": {
            boxSizing: "border-box",
            width: drawerWidth,
          },
        }}
        variant={isDesktop ? "persistent" : "temporary"}
      >
        <Toolbar />
        <SideNavigation onNavigate={handleNavigate} />
      </Drawer>

      <Box component="main" sx={{ flexGrow: 1, minWidth: 0 }}>
        <Toolbar />
        <Container maxWidth="xl" sx={{ py: 3 }}>
          {children}
        </Container>
      </Box>
    </Box>
  );
}
