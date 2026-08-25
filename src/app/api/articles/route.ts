import { NextResponse } from "next/server";

import type { CreateArticleInput } from "@/features/articles/domain/article";
import {
  mapCreateArticleToSupabaseInsert,
  mapSupabaseRowToArticle,
} from "@/features/articles/infrastructure/article-mappers";
import type { SupabaseConteudoRow } from "@/features/articles/infrastructure/SupabaseConteudoRow";
import { articleSelect } from "@/features/articles/infrastructure/supabase-article-query";
import { createDevSupabaseClient } from "@/shared/infrastructure/supabase/server";

export async function GET(request: Request) {
  try {
    const supabase = createDevSupabaseClient(request);
    const { data, error } = await supabase
      .from("TB_CONTEUDO")
      .select(articleSelect)
      .order("DT_ATUALIZACAO", { ascending: false });

    if (error) throw error;

    return NextResponse.json(
      (data as unknown as SupabaseConteudoRow[]).map(mapSupabaseRowToArticle),
    );
  } catch (error) {
    const message = error instanceof Error ? error.message : "Não foi possível carregar os artigos.";
    return NextResponse.json({ error: message }, { status: 503 });
  }
}

export async function POST(request: Request) {
  try {
    const input = (await request.json()) as CreateArticleInput;
    const supabase = createDevSupabaseClient(request);
    const { data, error } = await supabase
      .from("TB_CONTEUDO")
      .insert(mapCreateArticleToSupabaseInsert(input))
      .select(articleSelect)
      .single();

    if (error) throw error;

    return NextResponse.json(
      mapSupabaseRowToArticle(data as unknown as SupabaseConteudoRow),
      { status: 201 },
    );
  } catch (error) {
    const message = error instanceof Error ? error.message : "Não foi possível criar o artigo.";
    return NextResponse.json({ error: message }, { status: 400 });
  }
}
