import type {
  Article,
  ArticleAudience,
  ArticleStatus,
  CreateArticleInput,
  UpdateArticleInput,
} from "@/features/articles/domain/article";
import { enumTipoUsuario } from "@/shared/enum";

import type {
  SupabaseArticleAudience,
  SupabaseArticleStatus,
  SupabaseConteudoInsert,
  SupabaseConteudoRow,
  SupabaseConteudoUpdate,
} from "./SupabaseConteudoRow";

const audiencesFromDatabase: Record<SupabaseArticleAudience, ArticleAudience> = {
  adolescente: enumTipoUsuario.Adolescente,
  gestante: enumTipoUsuario.Gestante,
  menopausa: enumTipoUsuario.Menopausa,
  tentante: enumTipoUsuario.Tentante,
};

const audiencesToDatabase: Record<ArticleAudience, SupabaseArticleAudience> = {
  [enumTipoUsuario.Adolescente]: "adolescente",
  [enumTipoUsuario.Gestante]: "gestante",
  [enumTipoUsuario.Menopausa]: "menopausa",
  [enumTipoUsuario.Tentante]: "tentante",
};

const statusesFromDatabase: Record<SupabaseArticleStatus, ArticleStatus> = {
  arquivado: "ARQUIVADO",
  publicado: "PUBLICADO",
  rascunho: "RASCUNHO",
};

const statusesToDatabase: Record<ArticleStatus, SupabaseArticleStatus> = {
  ARQUIVADO: "arquivado",
  PUBLICADO: "publicado",
  RASCUNHO: "rascunho",
};

function toDatabaseCategoryId(categoryId: string) {
  const numericId = Number(categoryId);
  if (!Number.isSafeInteger(numericId) || numericId <= 0) {
    throw new Error("A categoria selecionada é inválida.");
  }
  return numericId;
}

export function mapSupabaseRowToArticle(row: SupabaseConteudoRow): Article {
  return {
    audience: audiencesFromDatabase[row.TP_PERFIL_ALVO] ?? null,
    categoryId: String(row.ID_CATEGORIA),
    content: row.DS_CORPO_TEXTO,
    coverImage: row.DS_URL_IMAGEM,
    createdAt: new Date(row.DT_CADASTRO),
    id: String(row.ID),
    status: statusesFromDatabase[row.TP_STATUS],
    summary: row.DS_RESUMO ?? "",
    tag: row.CATEGORIA.NM_CATEGORIA,
    title: row.NM_TITULO,
    updatedAt: new Date(row.DT_ATUALIZACAO),
  };
}

export function mapCreateArticleToSupabaseInsert(
  input: CreateArticleInput,
): SupabaseConteudoInsert {
  return {
    DS_CORPO_TEXTO: input.content,
    DS_RESUMO: input.summary || null,
    DS_URL_FONTE: null,
    DS_URL_IMAGEM: input.coverImage,
    ID_CATEGORIA: toDatabaseCategoryId(input.categoryId),
    NM_TITULO: input.title,
    TP_PERFIL_ALVO: audiencesToDatabase[input.audience],
    TP_STATUS: statusesToDatabase[input.status],
  };
}

export function mapUpdateArticleToSupabaseUpdate(
  input: UpdateArticleInput,
): SupabaseConteudoUpdate {
  const update: SupabaseConteudoUpdate = {};

  if (input.audience !== undefined) update.TP_PERFIL_ALVO = audiencesToDatabase[input.audience];
  if (input.categoryId !== undefined) update.ID_CATEGORIA = toDatabaseCategoryId(input.categoryId);
  if (input.content !== undefined) update.DS_CORPO_TEXTO = input.content;
  if (input.coverImage !== undefined) update.DS_URL_IMAGEM = input.coverImage;
  if (input.status !== undefined) update.TP_STATUS = statusesToDatabase[input.status];
  if (input.summary !== undefined) update.DS_RESUMO = input.summary || null;
  if (input.title !== undefined) update.NM_TITULO = input.title;

  return update;
}
