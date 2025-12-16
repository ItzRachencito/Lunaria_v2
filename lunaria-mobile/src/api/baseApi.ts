import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { API_CONFIG, STORAGE_KEYS } from '../constants/config';

// Create base query with auth handling
const baseQuery = fetchBaseQuery({
  baseUrl: API_CONFIG.BASE_URL,
  prepareHeaders: async (headers) => {
    try {
      const token = await AsyncStorage.getItem(STORAGE_KEYS.AUTH_TOKEN);
      if (token) {
        headers.set('Authorization', `Bearer ${token}`);
      }
    } catch (error) {
      console.error('Error getting auth token:', error);
    }
    headers.set('Content-Type', 'application/json');
    return headers;
  },
});

// Enhanced base query with token refresh logic
const baseQueryWithReauth = async (args: any, api: any, extraOptions: any) => {
  let result = await baseQuery(args, api, extraOptions);

  if (result.error && result.error.status === 401) {
    // Token might be expired, clear storage and redirect to login
    try {
      await AsyncStorage.removeItem(STORAGE_KEYS.AUTH_TOKEN);
      await AsyncStorage.removeItem(STORAGE_KEYS.USER_DATA);
      // You might want to dispatch a logout action here
    } catch (error) {
      console.error('Error clearing auth data:', error);
    }
  }

  return result;
};

// Create the main API slice
export const apiSlice = createApi({
  reducerPath: 'api',
  baseQuery: baseQueryWithReauth,
  tagTypes: ['Items', 'Categories', 'Brands', 'Sales', 'Favorites', 'User'],
  endpoints: (builder) => ({
    // Items endpoints
    getItems: builder.query<Item[], void>({
      query: () => '/items',
      providesTags: ['Items'],
    }),

    createItem: builder.mutation<Item, {
      name: string;
      description: string;
      price: number;
      stock: number;
      brandId?: string;
      categoryId?: string;
    }>({
      query: (item) => ({
        url: '/admin/items',
        method: 'POST',
        body: item,
      }),
      invalidatesTags: ['Items'],
    }),

    updateItem: builder.mutation<Item, {
      itemId: string;
      item: {
        name: string;
        description: string;
        price: number;
        stock: number;
        brandId?: string;
        categoryId?: string;
      };
    }>({
      query: ({ itemId, item }) => ({
        url: `/admin/items/${itemId}`,
        method: 'PUT',
        body: item,
      }),
      invalidatesTags: ['Items'],
    }),

    deleteItem: builder.mutation<void, string>({
      query: (itemId) => ({
        url: `/admin/items/${itemId}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Items'],
    }),
  }),
});

// Export hooks for usage in components
export const {
  useGetItemsQuery,
  useCreateItemMutation,
  useUpdateItemMutation,
  useDeleteItemMutation,
  usePrefetch,
} = apiSlice;