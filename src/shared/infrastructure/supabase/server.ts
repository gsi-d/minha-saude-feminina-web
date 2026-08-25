import "server-only";

import { createClient } from "@supabase/supabase-js";

import { getDevDatabaseConfig } from "@/shared/config/dev-database-access";

export function createDevSupabaseClient() {
  const { serviceRoleKey, url } = getDevDatabaseConfig();

  return createClient(url, serviceRoleKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  });
}
