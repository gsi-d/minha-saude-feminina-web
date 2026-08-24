"use client";

import ArticleOutlinedIcon from "@mui/icons-material/ArticleOutlined";
import MenuBookOutlinedIcon from "@mui/icons-material/MenuBookOutlined";
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Container from "@mui/material/Container";
import List from "@mui/material/List";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import Paper from "@mui/material/Paper";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import Link from "next/link";
import type { PropsWithChildren } from "react";

export function AdminShell({ children }: PropsWithChildren) {
  return (
    <Box sx={{ minHeight: "100vh" }}>
      <AppBar position="static" elevation={0}>
        <Toolbar>
          <MenuBookOutlinedIcon sx={{ mr: 1.5 }} />
          <Typography component="span" sx={{ fontWeight: 700 }} variant="h6">
            Minha Saúde Feminina
          </Typography>
        </Toolbar>
      </AppBar>

      <Container maxWidth="xl" sx={{ display: "flex", gap: 3, py: 3 }}>
        <Paper component="nav" variant="outlined" sx={{ flex: "0 0 240px", p: 1 }}>
          <List disablePadding>
            <ListItemButton component={Link} href="/artigos">
              <ListItemIcon>
                <ArticleOutlinedIcon />
              </ListItemIcon>
              <ListItemText primary="Artigos" />
            </ListItemButton>
          </List>
        </Paper>

        <Box component="main" sx={{ minWidth: 0, flex: 1 }}>
          {children}
        </Box>
      </Container>
    </Box>
  );
}
