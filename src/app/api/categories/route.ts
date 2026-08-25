import { NextResponse } from "next/server";

import {
  mapCategoryInputToRow,
  mapCategoryRowToDomain,
  parseCategoryInput,
  type SupabaseCategoryRow,
} from "@/features/categories/infrastructure/category-mappers";
import { createDevSupabaseClient } from "@/shared/infrastructure/supabase/server";

const categorySelect = "ID,NM_CATEGORIA,DS_CATEGORIA,IS_ATIVO,DT_CADASTRO";

function categoryError(error: unknown, fallback: string) {
  if (error && typeof error === "object" && "code" in error && error.code === "23505") {
    return "Já existe uma categoria com esse nome.";
  }
  return error instanceof Error ? error.message : fallback;
}

export async function GET(request: Request) {
  try {
    const onlyActive = new URL(request.url).searchParams.get("active") === "true";
    const supabase = createDevSupabaseClient(request);
    let query = supabase
      .from("TB_CATEGORIA")
      .select(categorySelect)
      .order("NM_CATEGORIA");

    if (onlyActive) query = query.eq("IS_ATIVO", true);
    const { data, error } = await query;
    if (error) throw error;

    return NextResponse.json(
      (data as SupabaseCategoryRow[]).map(mapCategoryRowToDomain),
    );
  } catch (error) {
    return NextResponse.json(
      { error: categoryError(error, "Não foi possível carregar as categorias.") },
      { status: 503 },
    );
  }
}

export async function POST(request: Request) {
  try {
    const input = parseCategoryInput(await request.json());
    const supabase = createDevSupabaseClient(request);
    const { data, error } = await supabase
      .from("TB_CATEGORIA")
      .insert(mapCategoryInputToRow(input))
      .select(categorySelect)
      .single();

    if (error) throw error;
    return NextResponse.json(
      mapCategoryRowToDomain(data as SupabaseCategoryRow),
      { status: 201 },
    );
  } catch (error) {
    return NextResponse.json(
      { error: categoryError(error, "Não foi possível criar a categoria.") },
      { status: 400 },
    );
  }
}
