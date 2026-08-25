import type { ArticleRepository } from "@/features/articles/application/ArticleRepository";
import type {
  Article,
  ArticleId,
  CreateArticleInput,
  UpdateArticleInput,
} from "@/features/articles/domain/article";
import { authenticatedFetch } from "@/shared/lib/supabase/authenticated-fetch";

type Fetcher = (
  input: RequestInfo | URL,
  init?: RequestInit,
) => Promise<Response>;

type SerializedArticle = Omit<Article, "createdAt" | "updatedAt"> & {
  createdAt: string;
  updatedAt: string;
};

function deserializeArticle(article: SerializedArticle): Article {
  return {
    ...article,
    createdAt: new Date(article.createdAt),
    updatedAt: new Date(article.updatedAt),
  };
}

export class HttpArticleRepository implements ArticleRepository {
  constructor(
    private readonly fetcher: Fetcher = authenticatedFetch,
  ) {}

  private async request<T>(path: string, init?: RequestInit): Promise<T> {
    const response = await this.fetcher(path, init);
    const body = (await response.json().catch(() => null)) as
      | { error?: string }
      | T
      | null;

    if (!response.ok) {
      const message = body && typeof body === "object" && "error" in body
        ? body.error
        : undefined;
      throw new Error(message || "Não foi possível acessar os dados dos artigos.");
    }

    return body as T;
  }

  async list(): Promise<Article[]> {
    const articles = await this.request<SerializedArticle[]>("/api/articles");
    return articles.map(deserializeArticle);
  }

  async findById(id: ArticleId): Promise<Article | null> {
    const article = await this.request<SerializedArticle>(`/api/articles/${id}`);
    return deserializeArticle(article);
  }

  async create(input: CreateArticleInput): Promise<Article> {
    const article = await this.request<SerializedArticle>("/api/articles", {
      body: JSON.stringify(input),
      headers: { "Content-Type": "application/json" },
      method: "POST",
    });
    return deserializeArticle(article);
  }

  async update(id: ArticleId, input: UpdateArticleInput): Promise<Article> {
    const article = await this.request<SerializedArticle>(`/api/articles/${id}`, {
      body: JSON.stringify(input),
      headers: { "Content-Type": "application/json" },
      method: "PUT",
    });
    return deserializeArticle(article);
  }

  async remove(id: ArticleId): Promise<void> {
    const response = await this.fetcher(`/api/articles/${id}`, { method: "DELETE" });
    if (!response.ok) {
      const body = (await response.json().catch(() => null)) as { error?: string } | null;
      throw new Error(body?.error || "Não foi possível excluir o artigo.");
    }
  }
}
