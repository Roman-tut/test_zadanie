import { create } from 'zustand';
import type { Store } from '../store/types';
import type { Page, PricePlan, Product } from '../types/entities';

import productsData from '../../data/productsData.json';
import pricePlansData from '../../data/pricePlansData.json';
import pagesData from '../../data/pagesData.json';

export const useStore = create<Store>((set) => ({
  products: productsData as Product[],
  pricePlans: pricePlansData as PricePlan[],
  pages: pagesData as Page[],
  setProducts: (data) => set({ products: data }),
  setPricePlans: (data) => set({ pricePlans: data }),
  setPages: (data) => set({ pages: data }),
}));
