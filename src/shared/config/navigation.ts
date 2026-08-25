import ArticleOutlinedIcon from "@mui/icons-material/ArticleOutlined";
import CategoryOutlinedIcon from "@mui/icons-material/CategoryOutlined";
import TipsAndUpdatesOutlinedIcon from '@mui/icons-material/TipsAndUpdatesOutlined';
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
  {
    href: "/dicas",
    icon: TipsAndUpdatesOutlinedIcon,
    label: "Dicas",
  },
  {
    href: "/categorias",
    icon: CategoryOutlinedIcon,
    label: "Categorias",
  },
];

export function isNavigationItemActive(pathname: string, href: string) {
  return pathname === href || pathname.startsWith(`${href}/`);
}
