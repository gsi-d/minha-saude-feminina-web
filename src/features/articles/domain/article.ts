export type ArticleId = string;

export type ArticleAudience = "GERAL" | "GESTANTE" | "NAO_GESTANTE";

export interface Article {
  id: ArticleId;
  title: string;
  summary: string;
  content: string;
  tag: string;
  audience: ArticleAudience;
  createdAt: Date;
  updatedAt: Date;
}

export type CreateArticleInput = Omit<Article, "id" | "createdAt" | "updatedAt">;

export type UpdateArticleInput = Partial<CreateArticleInput>;
