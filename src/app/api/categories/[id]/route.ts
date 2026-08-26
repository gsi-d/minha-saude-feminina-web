import { NextResponse } from "next/server";

import {
  mapCategoryInputToRow,
  mapCategoryRowToDomain,
  parseCategoryInput,
  type SupabaseCategoryRow,
} from "@/features/categories/infrastructure/category-mappers";
import { createDevSupabaseAdminClient } from "@/shared/infrastructure/supabase/server";

interface CategoryRouteContext {
  params: Promise<{ id: string }>;
}

const categorySelect = "ID,NM_CATEGORIA,DS_CATEGORIA,IS_ATIVO,DT_CADASTRO";

function parseId(id: string) {
  const value = Number(id);
  if (!Number.isSafeInteger(value) || value <= 0) {
    throw new Error("O identificador da categoria é inválido.");
  }
  return value;
}

function categoryError(error: unknown, fallback: string) {
  if (error && typeof error === "object" && "code" in error && error.code === "23505") {
    return "Já existe uma categoria com esse nome.";
  }
  return error instanceof Error ? error.message : fallback;
}

export async function PUT(request: Request, context: CategoryRouteContext) {
  try {
    const { id } = await context.params;
    const input = parseCategoryInput(await request.json());
    const supabase = createDevSupabaseAdminClient(request);
    const { data, error } = await supabase
      .from("TB_CATEGORIA")
      .update(mapCategoryInputToRow(input))
      .eq("ID", parseId(id))
      .select(categorySelect)
      .single();

    if (error) throw error;
    return NextResponse.json(mapCategoryRowToDomain(data as SupabaseCategoryRow));
  } catch (error) {
    return NextResponse.json(
      { error: categoryError(error, "Não foi possível atualizar a categoria.") },
      { status: 400 },
    );
  }
}

export async function DELETE(request: Request, context: CategoryRouteContext) {
  try {
    const { id } = await context.params;
    const supabase = createDevSupabaseAdminClient(request);
    const { error } = await supabase
      .from("TB_CATEGORIA")
      .update({ IS_ATIVO: false })
      .eq("ID", parseId(id));

    if (error) throw error;
    return new NextResponse(null, { status: 204 });
  } catch (error) {
    return NextResponse.json(
      { error: categoryError(error, "Não foi possível desativar a categoria.") },
      { status: 400 },
    );
  }
}
