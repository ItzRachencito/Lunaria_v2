import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { STORAGE_KEYS } from '../../constants/config';
import { Item, FavoritesState } from '../../types/api';

const initialState: FavoritesState = {
  items: [],
  isLoading: false,
};

const favoritesSlice = createSlice({
  name: 'favorites',
  initialState,
  reducers: {
    setFavorites: (state, action: PayloadAction<Item[]>) => {
      state.items = action.payload;
      saveFavoritesToStorage(state.items);
    },

    addToFavorites: (state, action: PayloadAction<Item>) => {
      const exists = state.items.find(item => item.id === action.payload.id);
      if (!exists) {
        state.items.push(action.payload);
        saveFavoritesToStorage(state.items);
      }
    },

    removeFromFavorites: (state, action: PayloadAction<number>) => {
      state.items = state.items.filter(item => item.id !== action.payload);
      saveFavoritesToStorage(state.items);
    },

    setLoading: (state, action: PayloadAction<boolean>) => {
      state.isLoading = action.payload;
    },

    loadFavoritesFromStorage: (state, action: PayloadAction<Item[]>) => {
      state.items = action.payload;
    },

    clearFavorites: (state) => {
      state.items = [];
      AsyncStorage.removeItem(STORAGE_KEYS.FAVORITES);
    },
  },
});

// Helper function to save favorites to AsyncStorage
const saveFavoritesToStorage = async (items: Item[]) => {
  try {
    await AsyncStorage.setItem(STORAGE_KEYS.FAVORITES, JSON.stringify(items));
  } catch (error) {
    console.error('Error saving favorites to storage:', error);
  }
};

export const {
  setFavorites,
  addToFavorites,
  removeFromFavorites,
  setLoading,
  loadFavoritesFromStorage,
  clearFavorites
} = favoritesSlice.actions;

export default favoritesSlice.reducer;