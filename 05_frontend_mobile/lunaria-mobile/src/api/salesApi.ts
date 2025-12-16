import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { API_CONFIG, STORAGE_KEYS } from '../constants/config';
import { SaleRequest, Sale } from '../types/api';

// Create base query for sales API
const salesBaseQuery = fetchBaseQuery({
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

export const salesApi = createApi({
  reducerPath: 'salesApi',
  baseQuery: salesBaseQuery,
  tagTypes: ['Sales'],
  endpoints: (builder) => ({
    createSale: builder.mutation<Sale, SaleRequest>({
      query: (saleData) => ({
        url: '/sales',
        method: 'POST',
        body: saleData,
      }),
      invalidatesTags: ['Sales'],
    }),

    getLatestSales: builder.query<Sale[], void>({
      query: () => '/sales/latest',
      providesTags: ['Sales'],
    }),

    deleteSale: builder.mutation<void, string>({
      query: (saleId) => ({
        url: `/sales/${saleId}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Sales'],
    }),
  }),
});

export const {
  useCreateSaleMutation,
  useGetLatestSalesQuery,
  useDeleteSaleMutation,
} = salesApi;