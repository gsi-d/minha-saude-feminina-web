import type { TipoUsuarioPublico } from "@/shared/enum";

export type ArticleId = string;

export type ArticleAudience = TipoUsuarioPublico;

export type ArticleStatus = "RASCUNHO" | "PUBLICADO" | "ARQUIVADO";

export interface ArticleCategory {
  id: string;
  name: string;
}

export interface ArticleContentMark {
  type: string;
  attrs?: Record<string, unknown>;
}

export interface ArticleContentNode {
  type: string;
  attrs?: Record<string, unknown>;
  content?: ArticleContentNode[];
  marks?: ArticleContentMark[];
  text?: string;
}

export interface ArticleDocument {
  schemaVersion: 1;
  document: {
    type: "doc";
    content: ArticleContentNode[];
  };
}

export interface Article {
  id: ArticleId;
  title: string;
  summary: string;
  content: ArticleDocument;
  coverImage: string | null;
  categoryId: string;
  tag: string;
  audience: ArticleAudience | null;
  status: ArticleStatus;
  createdAt: Date;
  updatedAt: Date;
}

export interface CreateArticleInput {
  audience: ArticleAudience;
  categoryId: string;
  content: ArticleDocument;
  coverImage: string | null;
  status: ArticleStatus;
  summary: string;
  title: string;
}

export type UpdateArticleInput = Partial<CreateArticleInput>;
