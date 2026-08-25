import type { PropsWithChildren } from "react";

import { ArticlesProvider } from "@/features/articles/presentation/ArticlesProvider";
import { AdminGuard } from "@/features/auth/presentation/AdminGuard";
import { AppShell } from "@/shared/components/AppShell";

export default function ArticlesLayout({ children }: PropsWithChildren) {
  return (
    <AdminGuard>
      <ArticlesProvider>
        <AppShell>{children}</AppShell>
      </ArticlesProvider>
    </AdminGuard>
  );
}
