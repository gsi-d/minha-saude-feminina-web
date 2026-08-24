import type { ArticleRepository } from "@/features/articles/application/ArticleRepository";
import type {
  Article,
  ArticleId,
  CreateArticleInput,
  UpdateArticleInput,
} from "@/features/articles/domain/article";

function cloneArticle(article: Article): Article {
  return {
    ...article,
    content: structuredClone(article.content),
    createdAt: new Date(article.createdAt),
    updatedAt: new Date(article.updatedAt),
  };
}

export class InMemoryArticleRepository implements ArticleRepository {
  private articles: Article[];

  constructor(initialArticles: Article[] = []) {
    this.articles = initialArticles.map(cloneArticle);
  }

  async list(): Promise<Article[]> {
    return this.articles
      .map(cloneArticle)
      .sort((first, second) => second.updatedAt.getTime() - first.updatedAt.getTime());
  }

  async findById(id: ArticleId): Promise<Article | null> {
    const article = this.articles.find((candidate) => candidate.id === id);
    return article ? cloneArticle(article) : null;
  }

  async create(input: CreateArticleInput): Promise<Article> {
    const now = new Date();
    const article: Article = {
      ...input,
      content: structuredClone(input.content),
      id: crypto.randomUUID(),
      createdAt: now,
      updatedAt: now,
    };
    this.articles.push(article);
    return cloneArticle(article);
  }

  async update(
    id: ArticleId,
    input: UpdateArticleInput,
  ): Promise<Article> {
    const articleIndex = this.articles.findIndex((article) => article.id === id);

    if (articleIndex === -1) {
      throw new Error("Artigo não encontrado.");
    }

    const updatedArticle: Article = {
      ...this.articles[articleIndex],
      ...input,
      content: input.content
        ? structuredClone(input.content)
        : this.articles[articleIndex].content,
      updatedAt: new Date(),
    };
    this.articles[articleIndex] = updatedArticle;
    return cloneArticle(updatedArticle);
  }

  async remove(id: ArticleId): Promise<void> {
    this.articles = this.articles.filter((article) => article.id !== id);
  }
}
