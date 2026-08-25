interface DevDatabaseConfig {
  anonKey: string;
  url: string;
}

type Environment = Record<string, string | undefined>;

export function getDevDatabaseConfig(
  environment: Environment = process.env,
  nodeEnvironment = process.env.NODE_ENV,
): DevDatabaseConfig {
  if (nodeEnvironment === "production") {
    throw new Error("O acesso temporário ao banco está indisponível em produção.");
  }

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

  return { anonKey, url };
}
