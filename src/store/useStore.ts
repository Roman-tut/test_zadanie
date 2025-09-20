import { create } from 'zustand';
import pagesData from '../data/pagesData.json';
import pricePlansData from '../data/pricePlansData.json';
import productsData from '../data/productsData.json';

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

export type Store = {
  products: Product[];
  pricePlans: PricePlan[];
  pages: Page[];
  setProducts: (data: Product[]) => void;
  setPricePlans: (data: PricePlan[]) => void;
  setPages: (data: Page[]) => void;
};

export const useStore = create<Store>((set) => ({
  products: productsData as Product[],
  pricePlans: pricePlansData as PricePlan[],
  pages: pagesData as Page[],
  setProducts: (data) => set({ products: data }),
  setPricePlans: (data) => set({ pricePlans: data }),
  setPages: (data) => set({ pages: data }),
}));
