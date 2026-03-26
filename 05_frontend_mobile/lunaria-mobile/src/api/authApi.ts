import { apiSlice } from './baseApi';
import { LoginRequest, RegisterRequest, AuthResponse, User } from '../types/api';

export const authApi = apiSlice.injectEndpoints({
  overrideExisting: true,
  endpoints: (builder) => ({
    login: builder.mutation<AuthResponse, LoginRequest>({
      query: (credentials) => ({
        url: '/login',
        method: 'POST',
        body: credentials,
      }),
    }),

    register: builder.mutation<AuthResponse, RegisterRequest>({
      query: (userData) => ({
        url: '/register',
        method: 'POST',
        body: userData,
      }),
    }),

    // Password reset - Step 1: Request OTP
    requestPasswordReset: builder.mutation<{ success: boolean; message: string }, string>({
      query: (email) => ({
        url: '/password-reset/request',
        method: 'POST',
        body: { email },
      }),
    }),

    // Password reset - Step 2: Resend OTP
    resendPasswordResetOtp: builder.mutation<{ success: boolean; message: string }, string>({
      query: (email) => ({
        url: '/password-reset/resend',
        method: 'POST',
        body: { email },
      }),
    }),

    // Password reset - Step 3: Reset password with OTP
    resetPassword: builder.mutation<{ success: boolean; message: string }, { email: string; otp: string; newPassword: string }>({
      query: ({ email, otp, newPassword }) => ({
        url: '/password-reset/reset',
        method: 'POST',
        body: { email, otp, newPassword },
      }),
    }),

    getCurrentUser: builder.query<User, void>({
      query: () => '/user/profile',
      providesTags: ['User'],
    }),

    updateProfile: builder.mutation<User, Partial<User>>({
      query: (userData) => ({
        url: '/user/profile',
        method: 'PUT',
        body: userData,
      }),
      invalidatesTags: ['User'],
    }),
  }),
});

export const {
  useLoginMutation,
  useRegisterMutation,
  useRequestPasswordResetMutation,
  useResendPasswordResetOtpMutation,
  useResetPasswordMutation,
  useGetCurrentUserQuery,
  useUpdateProfileMutation,
} = authApi;