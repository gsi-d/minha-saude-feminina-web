import type { Tip, TipInput } from "@/features/tips/domain/tip";
import {
  enumTipoUsuario,
  isTipoUsuarioPublico,
  type TipoUsuarioPublico,
} from "@/shared/enum";

export type SupabaseTipAudience =
  | "adolescente"
  | "gestante"
  | "tentante"
  | "menopausa";

export interface SupabaseTipRow {
  CATEGORIA: { ID: number; NM_CATEGORIA: string };
  DS_DICA: string;
  DT_CADASTRO: string;
  DT_EXIBICAO_SUGERIDA: string | null;
  ID: number;
  ID_CATEGORIA: number;
  IS_ATIVO: boolean;
  TP_PERFIL_ALVO: SupabaseTipAudience;
}

export interface SupabaseTipWriteRow {
  DS_DICA: string;
  DT_EXIBICAO_SUGERIDA: string | null;
  ID_CATEGORIA: number;
  IS_ATIVO: boolean;
  TP_PERFIL_ALVO: SupabaseTipAudience;
}

const audienceFromDatabase: Record<SupabaseTipAudience, TipoUsuarioPublico> = {
  adolescente: enumTipoUsuario.Adolescente,
  gestante: enumTipoUsuario.Gestante,
  menopausa: enumTipoUsuario.Menopausa,
  tentante: enumTipoUsuario.Tentante,
};

const audienceToDatabase: Record<TipoUsuarioPublico, SupabaseTipAudience> = {
  [enumTipoUsuario.Adolescente]: "adolescente",
  [enumTipoUsuario.Gestante]: "gestante",
  [enumTipoUsuario.Menopausa]: "menopausa",
  [enumTipoUsuario.Tentante]: "tentante",
};

function parseCategoryId(value: unknown) {
  const categoryId = typeof value === "string" ? value.trim() : "";
  const numericId = Number(categoryId);
  if (!Number.isSafeInteger(numericId) || numericId <= 0) {
    throw new Error("Informe uma categoria válida.");
  }
  return categoryId;
}

function parseSuggestedDate(value: unknown) {
  if (value === null || value === undefined || value === "") return null;
  if (typeof value !== "string" || !/^\d{4}-\d{2}-\d{2}$/.test(value)) {
    throw new Error("Informe uma data sugerida válida.");
  }
  return value;
}

export function parseTipInput(value: unknown): TipInput {
  const input = value && typeof value === "object"
    ? value as Record<string, unknown>
    : {};
  const text = typeof input.text === "string" ? input.text.trim() : "";

  if (!text) throw new Error("Informe o texto da dica.");
  if (text.length > 500) {
    throw new Error("A dica deve ter no máximo 500 caracteres.");
  }
  if (!isTipoUsuarioPublico(input.audience)) {
    throw new Error("Informe o público da dica.");
  }

  return {
    audience: input.audience,
    categoryId: parseCategoryId(input.categoryId),
    isActive: typeof input.isActive === "boolean" ? input.isActive : true,
    suggestedDisplayDate: parseSuggestedDate(input.suggestedDisplayDate),
    text,
  };
}

export function mapTipRowToDomain(row: SupabaseTipRow): Tip {
  return {
    audience: audienceFromDatabase[row.TP_PERFIL_ALVO],
    categoryId: String(row.ID_CATEGORIA),
    categoryName: row.CATEGORIA.NM_CATEGORIA,
    createdAt: new Date(row.DT_CADASTRO),
    id: String(row.ID),
    isActive: row.IS_ATIVO,
    suggestedDisplayDate: row.DT_EXIBICAO_SUGERIDA,
    text: row.DS_DICA,
  };
}

export function mapTipInputToRow(input: TipInput): SupabaseTipWriteRow {
  return {
    DS_DICA: input.text,
    DT_EXIBICAO_SUGERIDA: input.suggestedDisplayDate,
    ID_CATEGORIA: Number(input.categoryId),
    IS_ATIVO: input.isActive,
    TP_PERFIL_ALVO: audienceToDatabase[input.audience],
  };
}
