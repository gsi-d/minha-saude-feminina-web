"use client";

import {
  createContext,
  type PropsWithChildren,
  useContext,
  useState,
} from "react";

import type {
  Article,
  ArticleId,
  CreateArticleInput,
  UpdateArticleInput,
} from "@/features/articles/domain/article";
import { mapSupabaseRowToArticle } from "@/features/articles/infrastructure/article-mappers";
import { fakeSupabaseConteudoRows } from "@/features/articles/infrastructure/fake-articles";
import { InMemoryArticleRepository } from "@/features/articles/infrastructure/InMemoryArticleRepository";

interface ArticlesContextValue {
  articles: Article[];
  createArticle(input: CreateArticleInput): Promise<Article>;
  findArticle(id: ArticleId): Article | null;
  removeArticle(id: ArticleId): Promise<void>;
  updateArticle(id: ArticleId, input: UpdateArticleInput): Promise<Article>;
}

const ArticlesContext = createContext<ArticlesContextValue | null>(null);

export function ArticlesProvider({ children }: PropsWithChildren) {
  const [repository] = useState(
    () => new InMemoryArticleRepository(fakeSupabaseConteudoRows.map(mapSupabaseRowToArticle)),
  );
  const [articles, setArticles] = useState(() =>
    fakeSupabaseConteudoRows.map(mapSupabaseRowToArticle),
  );

  async function refreshArticles() {
    setArticles(await repository.list());
  }

  async function createArticle(input: CreateArticleInput) {
    const article = await repository.create(input);
    await refreshArticles();
    return article;
  }

  async function updateArticle(id: ArticleId, input: UpdateArticleInput) {
    const article = await repository.update(id, input);
    await refreshArticles();
    return article;
  }

  async function removeArticle(id: ArticleId) {
    await repository.remove(id);
    await refreshArticles();
  }

  function findArticle(id: ArticleId) {
    return articles.find((article) => article.id === id) ?? null;
  }

  return (
    <ArticlesContext.Provider
      value={{ articles, createArticle, findArticle, removeArticle, updateArticle }}
    >
      {children}
    </ArticlesContext.Provider>
  );
}

export function useArticles() {
  const context = useContext(ArticlesContext);

  if (!context) {
    throw new Error("useArticles deve ser utilizado dentro de ArticlesProvider.");
  }

  return context;
}
