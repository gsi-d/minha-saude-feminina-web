import type {
  Article,
  ArticleId,
  CreateArticleInput,
  UpdateArticleInput,
} from "@/features/articles/domain/article";

export interface ArticleRepository {
  list(): Promise<Article[]>;
  findById(id: ArticleId): Promise<Article | null>;
  create(input: CreateArticleInput): Promise<Article>;
  update(id: ArticleId, input: UpdateArticleInput): Promise<Article>;
  remove(id: ArticleId): Promise<void>;
}
