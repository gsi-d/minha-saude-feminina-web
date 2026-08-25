import type { PropsWithChildren } from "react";

import { AdminGuard } from "@/features/auth/presentation/AdminGuard";
import { AppShell } from "@/shared/components/AppShell";

export default function CategoriesLayout({ children }: PropsWithChildren) {
  return <AdminGuard><AppShell>{children}</AppShell></AdminGuard>;
}
