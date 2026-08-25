"use client";

import {
  createContext,
  type PropsWithChildren,
  useContext,
  useEffect,
  useState,
} from "react";

import type {
  Article,
  ArticleCategory,
  ArticleId,
  CreateArticleInput,
  UpdateArticleInput,
} from "@/features/articles/domain/article";
import { HttpArticleRepository } from "@/features/articles/infrastructure/HttpArticleRepository";

interface ArticlesContextValue {
  articles: Article[];
  categories: ArticleCategory[];
  createArticle(input: CreateArticleInput): Promise<Article>;
  error: string | null;
  findArticle(id: ArticleId): Article | null;
  loading: boolean;
  reload(): Promise<void>;
  removeArticle(id: ArticleId): Promise<void>;
  updateArticle(id: ArticleId, input: UpdateArticleInput): Promise<Article>;
}

const ArticlesContext = createContext<ArticlesContextValue | null>(null);

async function loadCategories(): Promise<ArticleCategory[]> {
  const response = await fetch("/api/categories");
  const body = (await response.json().catch(() => null)) as
    | ArticleCategory[]
    | { error?: string }
    | null;

  if (!response.ok) {
    const message = body && !Array.isArray(body) ? body.error : undefined;
    throw new Error(message || "Não foi possível carregar as categorias.");
  }

  return body as ArticleCategory[];
}

async function loadProviderData(repository: HttpArticleRepository) {
  const [articles, categories] = await Promise.all([
    repository.list(),
    loadCategories(),
  ]);
  return { articles, categories };
}

export function ArticlesProvider({ children }: PropsWithChildren) {
  const [repository] = useState(() => new HttpArticleRepository());
  const [articles, setArticles] = useState<Article[]>([]);
  const [categories, setCategories] = useState<ArticleCategory[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  async function reload() {
    setLoading(true);
    setError(null);

    try {
      const data = await loadProviderData(repository);
      setArticles(data.articles);
      setCategories(data.categories);
    } catch (loadError) {
      setError(loadError instanceof Error ? loadError.message : "Não foi possível carregar os dados.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    let active = true;

    void loadProviderData(repository)
      .then((data) => {
        if (!active) return;
        setArticles(data.articles);
        setCategories(data.categories);
      })
      .catch((loadError: unknown) => {
        if (!active) return;
        setError(loadError instanceof Error ? loadError.message : "Não foi possível carregar os dados.");
      })
      .finally(() => {
        if (active) setLoading(false);
      });

    return () => {
      active = false;
    };
  }, [repository]);

  async function createArticle(input: CreateArticleInput) {
    const article = await repository.create(input);
    setArticles((current) => [article, ...current]);
    return article;
  }

  async function updateArticle(id: ArticleId, input: UpdateArticleInput) {
    const article = await repository.update(id, input);
    setArticles((current) => current.map((item) => item.id === id ? article : item));
    return article;
  }

  async function removeArticle(id: ArticleId) {
    await repository.remove(id);
    setArticles((current) => current.filter((article) => article.id !== id));
  }

  function findArticle(id: ArticleId) {
    return articles.find((article) => article.id === id) ?? null;
  }

  return (
    <ArticlesContext.Provider
      value={{
        articles,
        categories,
        createArticle,
        error,
        findArticle,
        loading,
        reload,
        removeArticle,
        updateArticle,
      }}
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
