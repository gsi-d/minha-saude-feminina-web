export interface Category {
  createdAt: Date;
  description: string;
  id: string;
  isActive: boolean;
  name: string;
}

export interface CategoryInput {
  description: string;
  isActive: boolean;
  name: string;
}
