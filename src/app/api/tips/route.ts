import { NextResponse } from "next/server";

import {
  mapTipInputToRow,
  mapTipRowToDomain,
  parseTipInput,
  type SupabaseTipRow,
} from "@/features/tips/infrastructure/tip-mappers";
import { createDevSupabaseClient } from "@/shared/infrastructure/supabase/server";
import { getSupabaseErrorMessage } from "@/shared/infrastructure/supabase/supabase-error";

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

export async function GET(request: Request) {
  try {
    const supabase = createDevSupabaseClient(request);
    const { data, error } = await supabase
      .from("TB_DICA")
      .select(tipSelect)
      .order("DT_CADASTRO", { ascending: false });

    if (error) throw error;
    return NextResponse.json(
      (data as unknown as SupabaseTipRow[]).map(mapTipRowToDomain),
    );
  } catch (error) {
    const message = getSupabaseErrorMessage(error, "Não foi possível carregar as dicas.");
    return NextResponse.json({ error: message }, { status: 503 });
  }
}

export async function POST(request: Request) {
  try {
    const input = parseTipInput(await request.json());
    const supabase = createDevSupabaseClient(request);
    const { data, error } = await supabase
      .from("TB_DICA")
      .insert(mapTipInputToRow(input))
      .select(tipSelect)
      .single();

    if (error) throw error;
    return NextResponse.json(
      mapTipRowToDomain(data as unknown as SupabaseTipRow),
      { status: 201 },
    );
  } catch (error) {
    const message = getSupabaseErrorMessage(error, "Não foi possível criar a dica.");
    return NextResponse.json({ error: message }, { status: 400 });
  }
}
