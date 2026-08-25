import { NextResponse } from "next/server";

import type { UpdateArticleInput } from "@/features/articles/domain/article";
import {
  mapSupabaseRowToArticle,
  mapUpdateArticleToSupabaseUpdate,
} from "@/features/articles/infrastructure/article-mappers";
import type { SupabaseConteudoRow } from "@/features/articles/infrastructure/SupabaseConteudoRow";
import { articleSelect } from "@/features/articles/infrastructure/supabase-article-query";
import { createDevSupabaseClient } from "@/shared/infrastructure/supabase/server";

interface ArticleRouteContext {
  params: Promise<{ id: string }>;
}

function parseArticleId(id: string) {
  const numericId = Number(id);
  if (!Number.isSafeInteger(numericId) || numericId <= 0) {
    throw new Error("O identificador do artigo é inválido.");
  }
  return numericId;
}

export async function GET(_request: Request, context: ArticleRouteContext) {
  try {
    const { id } = await context.params;
    const supabase = createDevSupabaseClient();
    const { data, error } = await supabase
      .from("TB_CONTEUDO")
      .select(articleSelect)
      .eq("ID", parseArticleId(id))
      .maybeSingle();

    if (error) throw error;
    if (!data) return NextResponse.json({ error: "Artigo não encontrado." }, { status: 404 });

    return NextResponse.json(mapSupabaseRowToArticle(data as unknown as SupabaseConteudoRow));
  } catch (error) {
    const message = error instanceof Error ? error.message : "Não foi possível carregar o artigo.";
    return NextResponse.json({ error: message }, { status: 400 });
  }
}

export async function PUT(request: Request, context: ArticleRouteContext) {
  try {
    const { id } = await context.params;
    const input = (await request.json()) as UpdateArticleInput;
    const supabase = createDevSupabaseClient();
    const { data, error } = await supabase
      .from("TB_CONTEUDO")
      .update(mapUpdateArticleToSupabaseUpdate(input))
      .eq("ID", parseArticleId(id))
      .select(articleSelect)
      .single();

    if (error) throw error;

    return NextResponse.json(mapSupabaseRowToArticle(data as unknown as SupabaseConteudoRow));
  } catch (error) {
    const message = error instanceof Error ? error.message : "Não foi possível atualizar o artigo.";
    return NextResponse.json({ error: message }, { status: 400 });
  }
}

export async function DELETE(_request: Request, context: ArticleRouteContext) {
  try {
    const { id } = await context.params;
    const supabase = createDevSupabaseClient();
    const { error } = await supabase
      .from("TB_CONTEUDO")
      .delete()
      .eq("ID", parseArticleId(id));

    if (error) throw error;

    return new NextResponse(null, { status: 204 });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Não foi possível excluir o artigo.";
    return NextResponse.json({ error: message }, { status: 400 });
  }
}
