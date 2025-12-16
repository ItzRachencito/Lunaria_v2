import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { API_CONFIG } from '../constants/config';
import { RootState } from '../store/store';
import { Brand } from '../types/api';

interface BrandRequest {
  name: string;
  description: string;
}

interface BrandResponse {
  id: number;
  brandId: string;
  name: string;
  description: string;
  createdAt: string;
  updatedAt: string;
}

export const brandsApi = createApi({
  reducerPath: 'brandsApi',
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
  tagTypes: ['Brands'],
  endpoints: (builder) => ({
    getBrands: builder.query<Brand[], void>({
      query: () => '/brands',
      transformResponse: (response: BrandResponse[]) =>
        response.map(brand => ({
          id: brand.id,
          brandId: brand.brandId,
          name: brand.name,
          description: brand.description,
          createdAt: brand.createdAt,
          updatedAt: brand.updatedAt,
        })),
      providesTags: ['Brands'],
    }),

    createBrand: builder.mutation<Brand, BrandRequest>({
      query: (brand) => ({
        url: '/admin/brands',
        method: 'POST',
        body: brand,
      }),
      transformResponse: (response: BrandResponse) => ({
        id: response.id,
        brandId: response.brandId,
        name: response.name,
        description: response.description,
        createdAt: response.createdAt,
        updatedAt: response.updatedAt,
      }),
      invalidatesTags: ['Brands'],
    }),

    updateBrand: builder.mutation<Brand, { brandId: string; brand: BrandRequest }>({
      query: ({ brandId, brand }) => ({
        url: `/admin/brands/${brandId}`,
        method: 'PUT',
        body: brand,
      }),
      transformResponse: (response: BrandResponse) => ({
        id: response.id,
        brandId: response.brandId,
        name: response.name,
        description: response.description,
        createdAt: response.createdAt,
        updatedAt: response.updatedAt,
      }),
      invalidatesTags: ['Brands'],
    }),

    deleteBrand: builder.mutation<void, string>({
      query: (brandId) => ({
        url: `/admin/brands/${brandId}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Brands'],
    }),
  }),
});

export const {
  useGetBrandsQuery,
  useCreateBrandMutation,
  useUpdateBrandMutation,
  useDeleteBrandMutation,
} = brandsApi;