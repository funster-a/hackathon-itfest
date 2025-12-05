import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { IUniversity } from '../types';

interface FavoritesStore {
  favorites: IUniversity[];
  addToFavorites: (university: IUniversity) => void;
  removeFromFavorites: (id: string) => void;
  isFavorite: (id: string) => boolean;
}

export const useFavoritesStore = create<FavoritesStore>()(
  persist(
    (set, get) => ({
      favorites: [],
      addToFavorites: (university) => {
        const { favorites } = get();
        if (!favorites.some((u) => u.id === university.id)) {
          set({ favorites: [...favorites, university] });
        }
      },
      removeFromFavorites: (id) => {
        set({ favorites: get().favorites.filter((u) => u.id !== id) });
      },
      isFavorite: (id) => {
        return get().favorites.some((u) => u.id === id);
      },
    }),
    {
      name: 'favorites-storage',
    }
  )
);

