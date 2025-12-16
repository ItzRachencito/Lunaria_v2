import { configureStore } from '@reduxjs/toolkit';
import { apiSlice } from '../api/baseApi';
import { brandsApi } from '../api/brandsApi';
import authReducer from './slices/authSlice';
import cartReducer from './slices/cartSlice';
import favoritesReducer from './slices/favoritesSlice';

export const store = configureStore({
  reducer: {
    [apiSlice.reducerPath]: apiSlice.reducer,
    [brandsApi.reducerPath]: brandsApi.reducer,
    auth: authReducer,
    cart: cartReducer,
    favorites: favoritesReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: ['persist/PERSIST', 'persist/REHYDRATE'],
      },
    }).concat(apiSlice.middleware, brandsApi.middleware),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;