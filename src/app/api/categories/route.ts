import { NextResponse } from "next/server";

import type { SupabaseCategoriaRow } from "@/features/articles/infrastructure/SupabaseConteudoRow";
import { createDevSupabaseClient } from "@/shared/infrastructure/supabase/server";

export async function GET() {
  try {
    const supabase = createDevSupabaseClient();
    const { data, error } = await supabase
      .from("TB_CATEGORIA")
      .select("ID,NM_CATEGORIA")
      .eq("TP_CATEGORIA", "conteudo")
      .eq("IS_ATIVO", true)
      .order("NM_CATEGORIA");

    if (error) throw error;

    const categories = (data as SupabaseCategoriaRow[]).map((category) => ({
      id: String(category.ID),
      name: category.NM_CATEGORIA,
    }));

    return NextResponse.json(categories);
  } catch (error) {
    const message = error instanceof Error ? error.message : "Não foi possível carregar as categorias.";
    return NextResponse.json({ error: message }, { status: 503 });
  }
}
