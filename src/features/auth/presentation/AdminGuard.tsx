"use client";

import CircularProgress from "@mui/material/CircularProgress";
import Stack from "@mui/material/Stack";
import { useRouter } from "next/navigation";
import { type PropsWithChildren, useEffect } from "react";

import { useAuth } from "@/features/auth/presentation/AuthProvider";

export function AdminGuard({ children }: PropsWithChildren) {
  const { isAdmin, isReady } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (isReady && !isAdmin) router.replace("/login");
  }, [isAdmin, isReady, router]);

  if (!isReady || !isAdmin) {
    return (
      <Stack sx={{ alignItems: "center", justifyContent: "center", minHeight: "100vh" }}>
        <CircularProgress aria-label="Validando acesso administrativo" />
      </Stack>
    );
  }

  return children;
}
