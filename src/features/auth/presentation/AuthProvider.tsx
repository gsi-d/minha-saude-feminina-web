"use client";

import { createContext, type PropsWithChildren, useContext, useEffect, useState } from "react";

import {
  getAdministratorName,
  hasAdministratorSession,
  loginAsAdministrator,
  type LoginResult,
  logoutAdministrator,
} from "@/features/auth/application/admin-auth";

interface AuthContextValue {
  isAdmin: boolean;
  isReady: boolean;
  userName: string | null;
  login: (email: string, password: string) => Promise<LoginResult>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: PropsWithChildren) {
  const [isAdmin, setIsAdmin] = useState(false);
  const [isReady, setIsReady] = useState(false);
  const [userName, setUserName] = useState<string | null>(null);

  useEffect(() => {
    let active = true;
    hasAdministratorSession()
      .then(async (authorized) => {
        if (!active) return;
        setIsAdmin(authorized);
        setUserName(authorized ? await getAdministratorName() : null);
      })
      .catch(() => {
        if (active) {
          setIsAdmin(false);
          setUserName(null);
        }
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
    setUserName(result === "success" ? await getAdministratorName() : null);
    return result;
  }

  async function logout() {
    await logoutAdministrator();
    setIsAdmin(false);
    setUserName(null);
  }

  return (
    <AuthContext.Provider value={{ isAdmin, isReady, userName, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth deve ser usado dentro de AuthProvider.");
  return context;
}
