"use client";

import List from "@mui/material/List";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import Link from "next/link";
import { usePathname } from "next/navigation";

import { isNavigationItemActive, navigationItems } from "@/shared/config/navigation";

interface SideNavigationProps {
  onNavigate?: () => void;
}

export function SideNavigation({ onNavigate }: SideNavigationProps) {
  const pathname = usePathname();

  return (
    <List component="nav" sx={{ px: 1 }}>
      {navigationItems.map((item) => {
        const active = isNavigationItemActive(pathname, item.href);
        const Icon = item.icon;

        return (
          <ListItemButton
            aria-current={active ? "page" : undefined}
            component={Link}
            href={item.href}
            key={item.href}
            onClick={onNavigate}
            selected={active}
          >
            <ListItemIcon>
              <Icon />
            </ListItemIcon>
            <ListItemText primary={item.label} />
          </ListItemButton>
        );
      })}
    </List>
  );
}
