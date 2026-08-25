import type { User } from "@supabase/supabase-js";

import { getSupabaseClient } from "@/shared/lib/supabase/client";

export type LoginResult = "success" | "invalid_credentials" | "not_admin";

async function isAdministrator(user: User): Promise<boolean> {
  const { data, error } = await getSupabaseClient()
    .from("TB_USUARIO")
    .select("IS_ADM")
    .eq("ID_AUTH", user.id)
    .maybeSingle();

  if (error) throw new Error(`Não foi possível validar o acesso administrativo: ${error.message}`);
  return data?.IS_ADM === true;
}

export async function loginAsAdministrator(email: string, password: string): Promise<LoginResult> {
  const supabase = getSupabaseClient();
  const { data, error } = await supabase.auth.signInWithPassword({
    email: email.trim().toLowerCase(),
    password,
  });

  if (error || !data.user) return "invalid_credentials";
  if (!(await isAdministrator(data.user))) {
    await supabase.auth.signOut();
    return "not_admin";
  }
  return "success";
}

export async function hasAdministratorSession(): Promise<boolean> {
  const supabase = getSupabaseClient();
  const { data, error } = await supabase.auth.getUser();
  if (error || !data.user) return false;

  const authorized = await isAdministrator(data.user);
  if (!authorized) await supabase.auth.signOut();
  return authorized;
}

export async function logoutAdministrator(): Promise<void> {
  const { error } = await getSupabaseClient().auth.signOut();
  if (error) throw error;
}
