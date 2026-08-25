import type { TipoUsuarioPublico } from "@/shared/enum";

export interface Tip {
  audience: TipoUsuarioPublico;
  categoryId: string;
  categoryName: string;
  createdAt: Date;
  id: string;
  isActive: boolean;
  suggestedDisplayDate: string | null;
  text: string;
}

export interface TipInput {
  audience: TipoUsuarioPublico;
  categoryId: string;
  isActive: boolean;
  suggestedDisplayDate: string | null;
  text: string;
}
