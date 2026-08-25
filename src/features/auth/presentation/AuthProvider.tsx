"use client";

import { createContext, type PropsWithChildren, useContext, useEffect, useState } from "react";

import {
  hasAdministratorSession,
  loginAsAdministrator,
  type LoginResult,
  logoutAdministrator,
} from "@/features/auth/application/admin-auth";

interface AuthContextValue {
  isAdmin: boolean;
  isReady: boolean;
  login: (email: string, password: string) => Promise<LoginResult>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: PropsWithChildren) {
  const [isAdmin, setIsAdmin] = useState(false);
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    let active = true;
    hasAdministratorSession()
      .then((authorized) => {
        if (active) setIsAdmin(authorized);
      })
      .catch(() => {
        if (active) setIsAdmin(false);
      })
      .finally(() => {
        if (active) setIsReady(true);
      });
    return () => {
      active = false;
    };
  }, []);

  async function login(email: string, password: string) {
    const result = await loginAsAdministrator(email, password);
    setIsAdmin(result === "success");
    return result;
  }

  async function logout() {
    await logoutAdministrator();
    setIsAdmin(false);
  }

  return (
    <AuthContext.Provider value={{ isAdmin, isReady, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth deve ser usado dentro de AuthProvider.");
  return context;
}
