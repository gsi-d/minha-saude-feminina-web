import type { PropsWithChildren } from "react";

import { ArticlesProvider } from "@/features/articles/presentation/ArticlesProvider";
import { AppShell } from "@/shared/components/AppShell";

export default function ArticlesLayout({ children }: PropsWithChildren) {
  return (
    <ArticlesProvider>
      <AppShell>{children}</AppShell>
    </ArticlesProvider>
  );
}
