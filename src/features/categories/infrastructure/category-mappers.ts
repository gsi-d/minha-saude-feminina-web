import type { Category, CategoryInput } from "@/features/categories/domain/category";

export interface SupabaseCategoryRow {
  DS_CATEGORIA: string | null;
  DT_CADASTRO: string;
  ID: number;
  IS_ATIVO: boolean;
  NM_CATEGORIA: string;
}

export interface SupabaseCategoryWriteRow {
  DS_CATEGORIA: string | null;
  IS_ATIVO: boolean;
  NM_CATEGORIA: string;
}

export function parseCategoryInput(value: unknown): CategoryInput {
  const input = value && typeof value === "object"
    ? value as Record<string, unknown>
    : {};
  const name = typeof input.name === "string" ? input.name.trim() : "";
  const description = typeof input.description === "string"
    ? input.description.trim()
    : "";

  if (!name) throw new Error("Informe o nome da categoria.");
  if (name.length > 100) {
    throw new Error("O nome da categoria deve ter no máximo 100 caracteres.");
  }

  return {
    description,
    isActive: typeof input.isActive === "boolean" ? input.isActive : true,
    name,
  };
}

export function mapCategoryRowToDomain(row: SupabaseCategoryRow): Category {
  return {
    createdAt: new Date(row.DT_CADASTRO),
    description: row.DS_CATEGORIA ?? "",
    id: String(row.ID),
    isActive: row.IS_ATIVO,
    name: row.NM_CATEGORIA,
  };
}

export function mapCategoryInputToRow(
  input: CategoryInput,
): SupabaseCategoryWriteRow {
  return {
    DS_CATEGORIA: input.description || null,
    IS_ATIVO: input.isActive,
    NM_CATEGORIA: input.name,
  };
}
