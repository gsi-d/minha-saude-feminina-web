import type { Category, CategoryInput } from "@/features/categories/domain/category";
import { authenticatedFetch } from "@/shared/lib/supabase/authenticated-fetch";

type Fetcher = (input: RequestInfo | URL, init?: RequestInit) => Promise<Response>;
type SerializedCategory = Omit<Category, "createdAt"> & { createdAt: string };

function deserialize(category: SerializedCategory): Category {
  return { ...category, createdAt: new Date(category.createdAt) };
}

export class HttpCategoryRepository {
  constructor(
    private readonly fetcher: Fetcher = authenticatedFetch,
  ) {}

  private async request<T>(path: string, init?: RequestInit): Promise<T> {
    const response = await this.fetcher(path, init);
    const body = (await response.json().catch(() => null)) as T | { error?: string } | null;
    if (!response.ok) {
      const message = body && typeof body === "object" && "error" in body
        ? body.error
        : undefined;
      throw new Error(message || "Não foi possível acessar as categorias.");
    }
    return body as T;
  }

  async list(onlyActive = false): Promise<Category[]> {
    const path = onlyActive ? "/api/categories?active=true" : "/api/categories";
    const categories = await this.request<SerializedCategory[]>(path);
    return categories.map(deserialize);
  }

  async create(input: CategoryInput): Promise<Category> {
    const category = await this.request<SerializedCategory>("/api/categories", {
      body: JSON.stringify(input),
      headers: { "Content-Type": "application/json" },
      method: "POST",
    });
    return deserialize(category);
  }

  async update(id: string, input: CategoryInput): Promise<Category> {
    const category = await this.request<SerializedCategory>(`/api/categories/${id}`, {
      body: JSON.stringify(input),
      headers: { "Content-Type": "application/json" },
      method: "PUT",
    });
    return deserialize(category);
  }

  async deactivate(id: string): Promise<void> {
    await this.request<void>(`/api/categories/${id}`, { method: "DELETE" });
  }
}
