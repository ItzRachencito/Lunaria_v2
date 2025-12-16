import { apiSlice } from './baseApi';
import { Item, Category, Brand } from '../types/api';

export const itemsApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getItems: builder.query<Item[], void>({
      query: () => '/items',
      transformResponse: (response: any[]) =>
        response.map(item => ({
          id: item.id,
          itemId: item.itemId,
          name: item.name,
          description: item.description,
          price: item.price,
          imgUrl: item.imgUrl,
          stockQuantity: item.stockQuantity,
          category: item.categoryName ? {
            id: item.categoryId,
            categoryId: item.categoryId,
            name: item.categoryName,
            description: '',
          } : undefined,
          brand: item.brandName ? {
            id: item.brandId,
            brandId: item.brandId,
            name: item.brandName,
            description: '',
          } : undefined,
          createdAt: item.createdAt,
          updatedAt: item.updatedAt,
          canDelete: item.canDelete,
        })),
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