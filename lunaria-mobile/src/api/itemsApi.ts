import { apiSlice } from './baseApi';
import { Item, Category, Brand } from '../types/api';

export const itemsApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getItems: builder.query<Item[], void>({
      query: () => '/items',
      providesTags: ['Items'],
    }),

    getCategories: builder.query<Category[], void>({
      query: () => '/categories',
      providesTags: ['Categories'],
    }),

    getBrands: builder.query<Brand[], void>({
      query: () => '/brands',
      providesTags: ['Brands'],
    }),

    getItemsByCategory: builder.query<Item[], string>({
      query: (categoryId) => `/items?categoryId=${categoryId}`,
      providesTags: ['Items'],
    }),

    searchItems: builder.query<Item[], string>({
      query: (searchTerm) => `/items?search=${encodeURIComponent(searchTerm)}`,
      providesTags: ['Items'],
    }),
  }),
});

export const {
  useGetItemsQuery,
  useGetCategoriesQuery,
  useGetBrandsQuery,
  useGetItemsByCategoryQuery,
  useSearchItemsQuery,
} = itemsApi;