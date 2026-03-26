import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { API_CONFIG, STORAGE_KEYS } from '../constants/config';
import { Item, SaleResponse } from '../types/api';

// Create base query with auth handling
const baseQuery = fetchBaseQuery({
  baseUrl: API_CONFIG.BASE_URL,
  prepareHeaders: async (headers, { getState, endpoint }) => {
    try {
      const token = await AsyncStorage.getItem(STORAGE_KEYS.AUTH_TOKEN);
      if (token) {
        headers.set('Authorization', `Bearer ${token}`);
      }
    } catch (error) {
      console.error('Error getting auth token:', error);
    }

    // Don't set Content-Type for FormData requests (createItem)
    if (endpoint !== 'createItem') {
      headers.set('Content-Type', 'application/json');
    }

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
      purchasePrice?: number; // Precio de compra al proveedor (solo admin)
      installationPrice?: number; // Precio con instalación (mano de obra)
      stock: number;
      brandId?: string;
      categoryId?: string;
      image?: any;
    }>({
      query: (item) => {
        const formData = new FormData();

        // Create the item JSON string
        const itemData: any = {
          name: item.name,
          description: item.description,
          price: item.price,
          stockQuantity: item.stock,
          brandId: item.brandId || null,
          categoryId: item.categoryId || null,
        };

        // Add purchasePrice if provided (only for admin)
        if (item.purchasePrice && item.purchasePrice > 0) {
          itemData.purchasePrice = item.purchasePrice;
        }

        // Add installationPrice if provided
        if (item.installationPrice && item.installationPrice > 0) {
          itemData.installationPrice = item.installationPrice;
        }

        formData.append('item', JSON.stringify(itemData));

        // Add image if provided
        if (item.image) {
          const imageUri = item.image.uri;
          const filename = imageUri.split('/').pop() || 'image.jpg';
          const match = /\.(\w+)$/.exec(filename);
          const type = match ? `image/${match[1]}` : 'image/jpeg';

          formData.append('file', {
            uri: imageUri,
            name: filename,
            type: type,
          } as any);
        }

        return {
          url: '/admin/items',
          method: 'POST',
          body: formData,
        };
      },
      invalidatesTags: ['Items'],
    }),

    updateItem: builder.mutation<Item, {
      itemId: string;
      item: {
        name: string;
        description: string;
        price: number;
        purchasePrice?: number;
        installationPrice?: number;
        stock: number;
        brandId?: string;
        categoryId?: string;
      };
    }>({
      query: ({ itemId, item }) => ({
        url: `/admin/items/${itemId}`,
        method: 'PUT',
        body: {
          ...item,
          stockQuantity: item.stock,
          stock: undefined,
        },
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

    // Sales endpoints
    getLatestSales: builder.query<SaleResponse[], void>({
      query: () => '/sales/latest',
      providesTags: ['Sales'],
    }),
  }),
});

// Export hooks for usage in components
export const {
  useGetItemsQuery,
  useCreateItemMutation,
  useUpdateItemMutation,
  useDeleteItemMutation,
  useGetLatestSalesQuery,
  usePrefetch,
} = apiSlice;