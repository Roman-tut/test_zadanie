import type { Product, PricePlan, Page } from '../../shared/types/entities';

export type Store = {
  products: Product[];
  pricePlans: PricePlan[];
  pages: Page[];
  setProducts: (data: Product[]) => void;
  setPricePlans: (data: PricePlan[]) => void;
  setPages: (data: Page[]) => void;
};
