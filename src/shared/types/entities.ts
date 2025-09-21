export type Product = {
  id: number;
  name: string;
  options: { size: string; amount: number };
  active: boolean;
  createdAt: string;
};

export type PricePlan = {
  id: number;
  description: string;
  active: boolean;
  createdAt: string;
  removedAt: string | null;
};

export type Page = {
  id: number;
  title: string;
  active: boolean;
  updatedAt: string;
  publishedAt: string;
};
