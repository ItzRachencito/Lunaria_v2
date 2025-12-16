import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { MaterialIcons } from '@expo/vector-icons';
import { useSelector, useDispatch } from 'react-redux';
import { TouchableOpacity, Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { RootState } from '../store/store';
import { logout } from '../store/slices/authSlice';

import DashboardScreen from '../screens/main/DashboardScreen';
import ExploreScreen from '../screens/main/ExploreScreen';
import FavoritesScreen from '../screens/main/FavoritesScreen';
import ProfileScreen from '../screens/main/ProfileScreen';

// Admin screens (to be created)
import ManageItemsScreen from '../screens/admin/ManageItemsScreen';
import ManageBrandsScreen from '../screens/admin/ManageBrandsScreen';
import ManageCategoriesScreen from '../screens/admin/ManageCategoriesScreen';
import SaleHistoryScreen from '../screens/admin/SaleHistoryScreen';

// Logout Button Component
const LogoutButton = () => {
  const dispatch = useDispatch();

  const handleLogout = () => {
    Alert.alert(
      'Cerrar Sesión',
      '¿Estás seguro de que quieres cerrar sesión?',
      [
        {
          text: 'Cancelar',
          style: 'cancel',
        },
        {
          text: 'Cerrar Sesión',
          style: 'destructive',
          onPress: () => {
            dispatch(logout());
            // Navigation will automatically go to login due to auth state change
          },
        },
      ]
    );
  };

  return (
    <TouchableOpacity
      onPress={handleLogout}
      style={{ marginRight: 15 }}
    >
      <MaterialIcons name="exit-to-app" size={24} color="#fff" />
    </TouchableOpacity>
  );
};

export type UserTabParamList = {
  Dashboard: undefined;
  Explore: undefined;
  Favorites: undefined;
  Profile: undefined;
};

export type AdminTabParamList = {
  Dashboard: undefined;
  ManageItems: undefined;
  ManageBrands: undefined;
  ManageCategories: undefined;
  SaleHistory: undefined;
};

const UserTab = createBottomTabNavigator<UserTabParamList>();
const AdminTab = createBottomTabNavigator<AdminTabParamList>();

const UserNavigator = () => {
  return (
    <UserTab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          let iconName: keyof typeof MaterialIcons.glyphMap = 'home';

          if (route.name === 'Dashboard') {
            iconName = 'dashboard';
          } else if (route.name === 'Explore') {
            iconName = 'search';
          } else if (route.name === 'Favorites') {
            iconName = focused ? 'favorite' : 'favorite-border';
          } else if (route.name === 'Profile') {
            iconName = 'person';
          }

          return <MaterialIcons name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: '#007bff',
        tabBarInactiveTintColor: 'gray',
        headerStyle: {
          backgroundColor: '#2C3335',
        },
        headerTintColor: '#fff',
        headerTitleStyle: {
          fontWeight: 'bold',
        },
        headerRight: () => <LogoutButton />,
      })}
    >
      <UserTab.Screen
        name="Dashboard"
        component={DashboardScreen}
        options={{ title: 'Inicio' }}
      />
      <UserTab.Screen
        name="Explore"
        component={ExploreScreen}
        options={{ title: 'Explorar' }}
      />
      <UserTab.Screen
        name="Favorites"
        component={FavoritesScreen}
        options={{ title: 'Favoritos' }}
      />
      <UserTab.Screen
        name="Profile"
        component={ProfileScreen}
        options={{ title: 'Perfil' }}
      />
    </UserTab.Navigator>
  );
};

const AdminNavigator = () => {
  return (
    <AdminTab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          let iconName: keyof typeof MaterialIcons.glyphMap = 'home';

          if (route.name === 'Dashboard') {
            iconName = 'dashboard';
          } else if (route.name === 'ManageItems') {
            iconName = 'inventory';
          } else if (route.name === 'ManageBrands') {
            iconName = 'business';
          } else if (route.name === 'ManageCategories') {
            iconName = 'category';
          } else if (route.name === 'SaleHistory') {
            iconName = 'receipt';
          }

          return <MaterialIcons name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: '#dc3545',
        tabBarInactiveTintColor: 'gray',
        headerStyle: {
          backgroundColor: '#8B0000',
        },
        headerTintColor: '#fff',
        headerTitleStyle: {
          fontWeight: 'bold',
        },
        headerRight: () => <LogoutButton />,
      })}
    >
      <AdminTab.Screen
        name="Dashboard"
        component={DashboardScreen}
        options={{ title: 'Panel Admin' }}
      />
      <AdminTab.Screen
        name="ManageItems"
        component={ManageItemsScreen}
        options={{ title: 'Productos' }}
      />
      <AdminTab.Screen
        name="ManageBrands"
        component={ManageBrandsScreen}
        options={{ title: 'Marcas' }}
      />
      <AdminTab.Screen
        name="ManageCategories"
        component={ManageCategoriesScreen}
        options={{ title: 'Categorías' }}
      />
      <AdminTab.Screen
        name="SaleHistory"
        component={SaleHistoryScreen}
        options={{ title: 'Ventas' }}
      />
    </AdminTab.Navigator>
  );
};

const MainNavigator = () => {
  const { user } = useSelector((state: RootState) => state.auth);

  // Check if user has admin role
  const isAdmin = user?.role === 'ROLE_ADMIN';

  return isAdmin ? <AdminNavigator /> : <UserNavigator />;
};

export default MainNavigator;