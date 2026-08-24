import type { Article, ArticleAudience } from "@/features/articles/domain/article";

import type { SupabaseConteudoRow } from "./SupabaseConteudoRow";

const emptyDocument: Article["content"] = {
  schemaVersion: 1,
  document: { type: "doc", content: [{ type: "paragraph" }] },
};

function toAudience(value: SupabaseConteudoRow["TP_USUARIO"]): ArticleAudience {
  if (value === "GESTANTE" || value === "NAO_GESTANTE") {
    return value;
  }

  return "GERAL";
}

export function mapSupabaseRowToArticle(row: SupabaseConteudoRow): Article {
  const createdAt = row.CREATED_AT ? new Date(row.CREATED_AT) : new Date(0);

  return {
    id: row.ID,
    title: row.TITULO,
    summary: row.RESUMO ?? "",
    content: row.CONTEUDO_COMPLETO ?? structuredClone(emptyDocument),
    coverImage: row.IMAGEM_CAPA,
    tag: row.TAG ?? "",
    audience: toAudience(row.TP_USUARIO),
    status: row.STATUS,
    createdAt,
    updatedAt: row.UPDATED_AT ? new Date(row.UPDATED_AT) : createdAt,
  };
}
