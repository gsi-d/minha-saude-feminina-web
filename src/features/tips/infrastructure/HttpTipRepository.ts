import type { Tip, TipInput } from "@/features/tips/domain/tip";
import { authenticatedFetch } from "@/shared/lib/supabase/authenticated-fetch";

type Fetcher = (input: RequestInfo | URL, init?: RequestInit) => Promise<Response>;
type SerializedTip = Omit<Tip, "createdAt"> & { createdAt: string };

function deserialize(tip: SerializedTip): Tip {
  return { ...tip, createdAt: new Date(tip.createdAt) };
}

export class HttpTipRepository {
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
      throw new Error(message || "Não foi possível acessar as dicas.");
    }
    return body as T;
  }

  async list(): Promise<Tip[]> {
    const tips = await this.request<SerializedTip[]>("/api/tips");
    return tips.map(deserialize);
  }

  async create(input: TipInput): Promise<Tip> {
    const tip = await this.request<SerializedTip>("/api/tips", {
      body: JSON.stringify(input),
      headers: { "Content-Type": "application/json" },
      method: "POST",
    });
    return deserialize(tip);
  }

  async update(id: string, input: TipInput): Promise<Tip> {
    const tip = await this.request<SerializedTip>(`/api/tips/${id}`, {
      body: JSON.stringify(input),
      headers: { "Content-Type": "application/json" },
      method: "PUT",
    });
    return deserialize(tip);
  }

  async deactivate(id: string): Promise<void> {
    await this.request<void>(`/api/tips/${id}`, { method: "DELETE" });
  }
}
