import { NextResponse } from "next/server";

import {
  mapTipInputToRow,
  mapTipRowToDomain,
  parseTipInput,
  type SupabaseTipRow,
} from "@/features/tips/infrastructure/tip-mappers";
import { createDevSupabaseAdminClient } from "@/shared/infrastructure/supabase/server";
import { getSupabaseErrorMessage } from "@/shared/infrastructure/supabase/supabase-error";

interface TipRouteContext {
  params: Promise<{ id: string }>;
}

const tipSelect = [
  "ID",
  "ID_CATEGORIA",
  "DS_DICA",
  "TP_PERFIL_ALVO",
  "DT_EXIBICAO_SUGERIDA",
  "IS_ATIVO",
  "DT_CADASTRO",
  "CATEGORIA:TB_CATEGORIA!inner(ID,NM_CATEGORIA)",
].join(",");

function parseId(id: string) {
  const value = Number(id);
  if (!Number.isSafeInteger(value) || value <= 0) {
    throw new Error("O identificador da dica é inválido.");
  }
  return value;
}

export async function PUT(request: Request, context: TipRouteContext) {
  try {
    const { id } = await context.params;
    const input = parseTipInput(await request.json());
    const supabase = createDevSupabaseAdminClient(request);
    const { data, error } = await supabase
      .from("TB_DICA")
      .update(mapTipInputToRow(input))
      .eq("ID", parseId(id))
      .select(tipSelect)
      .single();

    if (error) throw error;
    return NextResponse.json(mapTipRowToDomain(data as unknown as SupabaseTipRow));
  } catch (error) {
    const message = getSupabaseErrorMessage(error, "Não foi possível atualizar a dica.");
    return NextResponse.json({ error: message }, { status: 400 });
  }
}

export async function DELETE(request: Request, context: TipRouteContext) {
  try {
    const { id } = await context.params;
    const supabase = createDevSupabaseAdminClient(request);
    const { error } = await supabase
      .from("TB_DICA")
      .update({ IS_ATIVO: false })
      .eq("ID", parseId(id));

    if (error) throw error;
    return new NextResponse(null, { status: 204 });
  } catch (error) {
    const message = getSupabaseErrorMessage(error, "Não foi possível desativar a dica.");
    return NextResponse.json({ error: message }, { status: 400 });
  }
}
