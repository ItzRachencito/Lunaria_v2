import { apiSlice } from './baseApi';
import { Item, Category, Brand } from '../types/api';

export const itemsApi = apiSlice.injectEndpoints({
  overrideExisting: true,
  endpoints: (builder) => ({
    getItems: builder.query<Item[], void>({
      query: () => '/items',
      transformResponse: (response: any[]): Item[] =>
        response.map(item => ({
          id: item.id,
          itemId: item.itemId,
          name: item.name,
          description: item.description,
          price: item.price,
          purchasePrice: item.purchasePrice,
          installationPrice: item.installationPrice,
          imgUrl: item.imgUrl,
          stockQuantity: item.stockQuantity,
          category: item.categoryName ? {
            id: item.categoryId,
            categoryId: String(item.categoryId),
            name: item.categoryName,
            description: '',
            createdAt: '',
            updatedAt: '',
          } : {
            id: 0,
            categoryId: '',
            name: '',
            description: '',
            createdAt: '',
            updatedAt: '',
          },
          categoryId: item.categoryId ? String(item.categoryId) : undefined,
          brand: item.brandName ? {
            id: item.brandId,
            brandId: String(item.brandId),
            name: item.brandName,
            description: '',
            createdAt: '',
            updatedAt: '',
          } : undefined,
          brandId: item.brandId ? String(item.brandId) : undefined,
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