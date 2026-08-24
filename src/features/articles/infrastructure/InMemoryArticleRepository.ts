import type { ArticleRepository } from "@/features/articles/application/ArticleRepository";
import type {
  Article,
  ArticleId,
  CreateArticleInput,
  UpdateArticleInput,
} from "@/features/articles/domain/article";

const NOT_IMPLEMENTED_MESSAGE =
  "O repositório em memória será implementado junto com o CRUD.";

export class InMemoryArticleRepository implements ArticleRepository {
  async list(): Promise<Article[]> {
    throw new Error(NOT_IMPLEMENTED_MESSAGE);
  }

  async findById(id: ArticleId): Promise<Article | null> {
    void id;
    throw new Error(NOT_IMPLEMENTED_MESSAGE);
  }

  async create(input: CreateArticleInput): Promise<Article> {
    void input;
    throw new Error(NOT_IMPLEMENTED_MESSAGE);
  }

  async update(
    id: ArticleId,
    input: UpdateArticleInput,
  ): Promise<Article> {
    void id;
    void input;
    throw new Error(NOT_IMPLEMENTED_MESSAGE);
  }

  async remove(id: ArticleId): Promise<void> {
    void id;
    throw new Error(NOT_IMPLEMENTED_MESSAGE);
  }
}
