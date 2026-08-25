import { getSupabaseClient } from "@/shared/lib/supabase/client";

export type AuthenticatedFetcher = (
  input: RequestInfo | URL,
  init?: RequestInit,
) => Promise<Response>;

export function withBearerToken(init: RequestInit = {}, accessToken: string): RequestInit {
  const headers = new Headers(init.headers);
  headers.set("Authorization", `Bearer ${accessToken}`);
  return { ...init, headers };
}

export const authenticatedFetch: AuthenticatedFetcher = async (input, init) => {
  const supabase = getSupabaseClient();
  const { data, error } = await supabase.auth.getSession();

  if (error) throw new Error(`Não foi possível validar a sessão: ${error.message}`);
  if (!data.session?.access_token) {
    throw new Error("Sua sessão expirou. Entre novamente para continuar.");
  }

  return globalThis.fetch(input, withBearerToken(init, data.session.access_token));
};
