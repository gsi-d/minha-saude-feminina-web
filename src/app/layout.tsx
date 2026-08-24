import type { Metadata } from "next";
import InitColorSchemeScript from "@mui/material/InitColorSchemeScript";
import type { PropsWithChildren } from "react";

import "./globals.css";

import { AppShell } from "@/shared/components/AppShell";
import { ArticlesProvider } from "@/features/articles/presentation/ArticlesProvider";
import { AppThemeProvider } from "@/shared/providers/AppThemeProvider";

export const metadata: Metadata = {
  title: "Gestão de artigos | Minha Saúde Feminina",
  description: "Painel administrativo de conteúdos do Minha Saúde Feminina.",
};

export default function RootLayout({ children }: PropsWithChildren) {
  return (
    <html lang="pt-BR" suppressHydrationWarning>
      <body>
        <InitColorSchemeScript attribute="class" defaultMode="system" />
        <AppThemeProvider>
          <ArticlesProvider>
            <AppShell>{children}</AppShell>
          </ArticlesProvider>
        </AppThemeProvider>
      </body>
    </html>
  );
}
