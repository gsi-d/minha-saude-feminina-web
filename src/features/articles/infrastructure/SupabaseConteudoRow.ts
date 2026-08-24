import type {
  ArticleDocument,
  ArticleStatus,
} from "@/features/articles/domain/article";

export interface SupabaseConteudoRow {
  ID: string;
  TITULO: string;
  RESUMO: string | null;
  CONTEUDO_COMPLETO: ArticleDocument | null;
  TAG: string | null;
  TP_USUARIO: string | number | null;
  STATUS: ArticleStatus;
  IMAGEM_CAPA: string | null;
  CREATED_AT: string | null;
  UPDATED_AT: string | null;
}
