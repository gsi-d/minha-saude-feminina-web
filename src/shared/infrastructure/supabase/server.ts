import "server-only";

import { createClient } from "@supabase/supabase-js";

import { getDevDatabaseConfig } from "@/shared/config/dev-database-access";

export function createDevSupabaseClient(request: Request) {
  const { anonKey, url } = getDevDatabaseConfig();
  const authorization = request.headers.get("Authorization");

  if (!authorization?.startsWith("Bearer ")) {
    throw new Error("Sessão administrativa não informada.");
  }

  return createClient(url, anonKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
    global: { headers: { Authorization: authorization } },
  });
}
