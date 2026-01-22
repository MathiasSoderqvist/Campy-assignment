import AsyncStorage from '@react-native-async-storage/async-storage';
import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

import type { Location } from '../types/location';

type FavoritesState = {
  favorites: Location[];
  addFavorite: (location: Location) => void;
  removeFavorite: (uid: string) => void;
  isFavorite: (uid: string) => boolean;
  toggleFavorite: (location: Location) => void;
};

export const useFavoritesStore = create<FavoritesState>()(
  persist(
    (set, get) => ({
      favorites: [],
      addFavorite: (location) =>
        set((state) => ({
          favorites: [...state.favorites, location],
        })),
      removeFavorite: (uid) =>
        set((state) => ({
          favorites: state.favorites.filter((loc) => loc.uid !== uid),
        })),
      isFavorite: (uid) => get().favorites.some((loc) => loc.uid === uid),
      toggleFavorite: (location) => {
        const { favorites } = get();
        const exists = favorites.some((loc) => loc.uid === location.uid);
        if (exists) {
          set({ favorites: favorites.filter((loc) => loc.uid !== location.uid) });
        } else {
          set({ favorites: [...favorites, location] });
        }
      },
    }),
    {
      name: 'favorites-storage',
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);
