import { create } from 'zustand';
import type { IUniversity } from '../types';

interface CompareStore {
  compareList: IUniversity[];
  userEntScore: number | null;
  addToCompare: (university: IUniversity) => void;
  removeFromCompare: (id: string) => void;
  setEntScore: (score: number | null) => void;
}

export const useCompareStore = create<CompareStore>((set) => ({
  compareList: [],
  userEntScore: null,
  addToCompare: (university) =>
    set((state) => {
      // Проверяем, не добавлен ли уже университет
      if (state.compareList.some((u) => u.id === university.id)) {
        return state;
      }
      return {
        compareList: [...state.compareList, university],
      };
    }),
  removeFromCompare: (id) =>
    set((state) => ({
      compareList: state.compareList.filter((u) => u.id !== id),
    })),
  setEntScore: (score) =>
    set(() => ({
      userEntScore: score,
    })),
}));

