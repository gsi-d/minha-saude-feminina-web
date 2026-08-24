export type ArticleId = string;

export type ArticleAudience = "GERAL" | "GESTANTE" | "NAO_GESTANTE";

export type ArticleStatus = "RASCUNHO" | "PUBLICADO" | "ARQUIVADO";

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
  tag: string;
  audience: ArticleAudience;
  status: ArticleStatus;
  createdAt: Date;
  updatedAt: Date;
}

export type CreateArticleInput = Omit<Article, "id" | "createdAt" | "updatedAt">;

export type UpdateArticleInput = Partial<CreateArticleInput>;
