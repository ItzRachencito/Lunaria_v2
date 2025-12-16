import React, { useEffect } from 'react';
import { StatusBar } from 'expo-status-bar';
import { Provider } from 'react-redux';
import { NavigationContainer } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';

import { store } from './src/store/store';
import { STORAGE_KEYS } from './src/constants/config';
import { setCredentials, initializeAuth } from './src/store/slices/authSlice';
import { loadCartFromStorage } from './src/store/slices/cartSlice';
import { loadFavoritesFromStorage } from './src/store/slices/favoritesSlice';

import AppNavigator from './src/navigation/AppNavigator';
import { User, CartItem, Item } from './src/types/api';

export default function App() {
  useEffect(() => {
    const initializeApp = async () => {
      try {
        // Load auth data
        const token = await AsyncStorage.getItem(STORAGE_KEYS.AUTH_TOKEN);
        const userData = await AsyncStorage.getItem(STORAGE_KEYS.USER_DATA);

        if (token && userData) {
          const user: User = JSON.parse(userData);
          store.dispatch(setCredentials({ token, user }));
        }

        // Load cart data
        const cartData = await AsyncStorage.getItem(STORAGE_KEYS.CART_ITEMS);
        if (cartData) {
          const cartItems: CartItem[] = JSON.parse(cartData);
          store.dispatch(loadCartFromStorage(cartItems));
        }

        // Load favorites data
        const favoritesData = await AsyncStorage.getItem(STORAGE_KEYS.FAVORITES);
        if (favoritesData) {
          const favorites: Item[] = JSON.parse(favoritesData);
          store.dispatch(loadFavoritesFromStorage(favorites));
        }

      } catch (error) {
        console.error('Error initializing app:', error);
      } finally {
        store.dispatch(initializeAuth());
      }
    };

    initializeApp();
  }, []);

  return (
    <Provider store={store}>
      <NavigationContainer>
        <AppNavigator />
        <StatusBar style="auto" />
      </NavigationContainer>
    </Provider>
  );
}
