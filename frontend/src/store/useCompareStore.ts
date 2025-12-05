import { create } from 'zustand';
import { IUniversity } from '../types';

interface CompareStore {
  compareList: IUniversity[];
  addToCompare: (university: IUniversity) => void;
  removeFromCompare: (id: string) => void;
}

export const useCompareStore = create<CompareStore>((set) => ({
  compareList: [],
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
}));

