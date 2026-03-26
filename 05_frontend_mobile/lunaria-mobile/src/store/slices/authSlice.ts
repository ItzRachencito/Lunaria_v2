import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { STORAGE_KEYS } from '../../constants/config';
import { User, AuthState } from '../../types/api';
import { apiSlice } from '../../api/baseApi';

const initialState: AuthState = {
  token: null,
  user: null,
  isAuthenticated: false,
  isLoading: true,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setCredentials: (state, action: PayloadAction<{ token: string; user: User }>) => {
      const { token, user } = action.payload;
      state.token = token;
      state.user = user;
      state.isAuthenticated = true;
      state.isLoading = false;

      // Persist to AsyncStorage
      AsyncStorage.setItem(STORAGE_KEYS.AUTH_TOKEN, token);
      AsyncStorage.setItem(STORAGE_KEYS.USER_DATA, JSON.stringify(user));
    },

    updateUser: (state, action: PayloadAction<User>) => {
      state.user = action.payload;
      AsyncStorage.setItem(STORAGE_KEYS.USER_DATA, JSON.stringify(action.payload));
    },

    logout: (state) => {
      state.token = null;
      state.user = null;
      state.isAuthenticated = false;
      state.isLoading = false;

      // Clear AsyncStorage
      AsyncStorage.removeItem(STORAGE_KEYS.AUTH_TOKEN);
      AsyncStorage.removeItem(STORAGE_KEYS.USER_DATA);
    },

    setLoading: (state, action: PayloadAction<boolean>) => {
      state.isLoading = action.payload;
    },

    initializeAuth: (state) => {
      // This will be handled by the app initialization
      state.isLoading = false;
    },
  },
});

export const { setCredentials, updateUser, logout, setLoading, initializeAuth } = authSlice.actions;

// Thunk for logout that also clears API cache
export const logoutAndClearCache = () => async (dispatch: any) => {
  dispatch(logout());
  // Clear all RTK Query cache (includes favorites since it uses injectEndpoints)
  dispatch(apiSlice.util.resetApiState());
};

export default authSlice.reducer;