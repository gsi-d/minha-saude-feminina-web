import ArticleOutlinedIcon from "@mui/icons-material/ArticleOutlined";
import type { SvgIconComponent } from "@mui/icons-material";

export interface NavigationItem {
  href: string;
  icon: SvgIconComponent;
  label: string;
}

export const navigationItems: readonly NavigationItem[] = [
  {
    href: "/artigos",
    icon: ArticleOutlinedIcon,
    label: "Artigos",
  },
];

export function isNavigationItemActive(pathname: string, href: string) {
  return pathname === href || pathname.startsWith(`${href}/`);
}
