import "server-only";

import { createClient } from "@supabase/supabase-js";

import { getDevDatabaseConfig } from "@/shared/config/dev-database-access";

function requireAuthorizationHeader(request: Request) {
  const authorization = request.headers.get("Authorization");

  if (!authorization?.startsWith("Bearer ")) {
    throw new Error("Sessão administrativa não informada.");
  }

  return authorization;
}

export function createDevSupabaseClient(request: Request) {
  const { anonKey, url } = getDevDatabaseConfig();
  const authorization = requireAuthorizationHeader(request);

  return createClient(url, anonKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
    global: { headers: { Authorization: authorization } },
  });
}

export function createDevSupabaseAdminClient(request: Request) {
  const { serviceRoleKey, url } = getDevDatabaseConfig();
  requireAuthorizationHeader(request);

  if (!serviceRoleKey) {
    return createDevSupabaseClient(request);
  }

  return createClient(url, serviceRoleKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
    global: {
      headers: {
        Authorization: `Bearer ${serviceRoleKey}`,
      },
    },
  });
}
