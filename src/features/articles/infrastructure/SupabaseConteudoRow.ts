import type { ArticleDocument } from "@/features/articles/domain/article";

export type SupabaseArticleAudience =
  | "adolescente"
  | "gestante"
  | "tentante"
  | "menopausa";

export type SupabaseArticleStatus =
  | "rascunho"
  | "publicado"
  | "arquivado";

export interface SupabaseCategoriaRow {
  ID: number;
  NM_CATEGORIA: string;
}

export interface SupabaseConteudoRow {
  CATEGORIA: SupabaseCategoriaRow;
  DS_CORPO_TEXTO: ArticleDocument;
  DS_RESUMO: string | null;
  DS_URL_FONTE: string | null;
  DS_URL_IMAGEM: string | null;
  DT_ATUALIZACAO: string;
  DT_CADASTRO: string;
  ID: number;
  ID_CATEGORIA: number;
  NM_TITULO: string;
  TP_PERFIL_ALVO: SupabaseArticleAudience;
  TP_STATUS: SupabaseArticleStatus;
}

export interface SupabaseConteudoInsert {
  DS_CORPO_TEXTO: ArticleDocument;
  DS_RESUMO: string | null;
  DS_URL_FONTE: string | null;
  DS_URL_IMAGEM: string | null;
  ID_CATEGORIA: number;
  NM_TITULO: string;
  TP_PERFIL_ALVO: SupabaseArticleAudience;
  TP_STATUS: SupabaseArticleStatus;
}

export type SupabaseConteudoUpdate = Partial<SupabaseConteudoInsert>;
