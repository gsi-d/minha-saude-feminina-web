interface DevDatabaseConfig {
  anonKey: string;
  serviceRoleKey: string | null;
  url: string;
}

type Environment = Record<string, string | undefined>;

export function getDevDatabaseConfig(
  environment: Environment = process.env
): DevDatabaseConfig {

  if (environment.ENABLE_INSECURE_DEV_DATABASE_ACCESS !== "true") {
    throw new Error("O acesso temporário ao banco não está habilitado.");
  }

  const url = environment.NEXT_PUBLIC_SUPABASE_URL?.trim();
  if (!url) {
    throw new Error("Defina NEXT_PUBLIC_SUPABASE_URL em .env.local.");
  }

  const anonKey = environment.NEXT_PUBLIC_SUPABASE_ANON_KEY?.trim();
  if (!anonKey) {
    throw new Error("Defina NEXT_PUBLIC_SUPABASE_ANON_KEY em .env.local.");
  }

  const serviceRoleKey = environment.SUPABASE_SERVICE_ROLE_KEY?.trim()
    || environment.SUPABASE_SECRET_KEY?.trim()
    || null;

  return { anonKey, serviceRoleKey, url };
}
