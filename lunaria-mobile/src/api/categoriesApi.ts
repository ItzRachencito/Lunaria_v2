import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { API_CONFIG } from '../constants/config';
import { RootState } from '../store/store';
import { Category } from '../types/api';

interface CategoryRequest {
  name: string;
  description: string;
}

interface CategoryResponse {
  id: number;
  categoryId: string;
  name: string;
  description: string;
  imageUrl?: string;
  createdAt: string;
  updatedAt: string;
}

export const categoriesApi = createApi({
  reducerPath: 'categoriesApi',
  baseQuery: fetchBaseQuery({
    baseUrl: API_CONFIG.BASE_URL,
    prepareHeaders: (headers, { getState }) => {
      const token = (getState() as RootState).auth.token;
      // Include token for all requests (both public and protected)
      if (token) {
        headers.set('authorization', `Bearer ${token}`);
      }
      return headers;
    },
  }),
  tagTypes: ['Categories'],
  endpoints: (builder) => ({
    getCategories: builder.query<Category[], void>({
      query: () => '/categories',
      transformResponse: (response: CategoryResponse[]) =>
        response.map(category => ({
          id: category.id,
          categoryId: category.categoryId,
          name: category.name,
          description: category.description,
          imageUrl: category.imageUrl,
          createdAt: category.createdAt,
          updatedAt: category.updatedAt,
        })),
      providesTags: ['Categories'],
    }),

    createCategory: builder.mutation<Category, CategoryRequest>({
      query: (category) => ({
        url: '/admin/categories',
        method: 'POST',
        body: category,
      }),
      transformResponse: (response: CategoryResponse) => ({
        id: response.id,
        categoryId: response.categoryId,
        name: response.name,
        description: response.description,
        imageUrl: response.imageUrl,
        createdAt: response.createdAt,
        updatedAt: response.updatedAt,
      }),
      invalidatesTags: ['Categories'],
    }),

    updateCategory: builder.mutation<Category, { categoryId: string; category: CategoryRequest }>({
      query: ({ categoryId, category }) => ({
        url: `/admin/categories/${categoryId}`,
        method: 'PUT',
        body: category,
      }),
      transformResponse: (response: CategoryResponse) => ({
        id: response.id,
        categoryId: response.categoryId,
        name: response.name,
        description: response.description,
        imageUrl: response.imageUrl,
        createdAt: response.createdAt,
        updatedAt: response.updatedAt,
      }),
      invalidatesTags: ['Categories'],
    }),

    deleteCategory: builder.mutation<void, string>({
      query: (categoryId) => ({
        url: `/admin/categories/${categoryId}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Categories'],
    }),
  }),
});

export const {
  useGetCategoriesQuery,
  useCreateCategoryMutation,
  useUpdateCategoryMutation,
  useDeleteCategoryMutation,
} = categoriesApi;