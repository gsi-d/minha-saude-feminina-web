import type { Metadata } from "next";
import type { PropsWithChildren } from "react";

import "./globals.css";

import { AdminShell } from "@/shared/components/AdminShell";
import { AppThemeProvider } from "@/shared/providers/AppThemeProvider";

export const metadata: Metadata = {
  title: "Gestão de artigos | Minha Saúde Feminina",
  description: "Painel administrativo de conteúdos do Minha Saúde Feminina.",
};

export default function RootLayout({ children }: PropsWithChildren) {
  return (
    <html lang="pt-BR">
      <body>
        <AppThemeProvider>
          <AdminShell>{children}</AdminShell>
        </AppThemeProvider>
      </body>
    </html>
  );
}
