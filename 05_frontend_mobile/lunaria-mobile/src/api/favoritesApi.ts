import { apiSlice } from './baseApi';
import { Favorite } from '../types/api';

export const favoritesApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getUserFavorites: builder.query<Favorite[], void>({
      query: () => '/favorites',
      providesTags: ['Favorites'],
    }),

    addToFavorites: builder.mutation<Favorite, string>({
      query: (itemId) => ({
        url: `/favorites/${itemId}`,
        method: 'POST',
      }),
      invalidatesTags: ['Favorites'],
    }),

    removeFromFavorites: builder.mutation<void, string>({
      query: (itemId) => ({
        url: `/favorites/${itemId}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Favorites'],
    }),

    checkFavoriteStatus: builder.query<{ isFavorite: boolean }, string>({
      query: (itemId) => `/favorites/${itemId}/status`,
      providesTags: ['Favorites'],
    }),
  }),
});

export const {
  useGetUserFavoritesQuery,
  useAddToFavoritesMutation,
  useRemoveFromFavoritesMutation,
  useCheckFavoriteStatusQuery,
} = favoritesApi;