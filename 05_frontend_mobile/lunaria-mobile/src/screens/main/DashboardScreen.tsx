import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { useSelector } from 'react-redux';
import { RootState } from '../../store/store';
import { useGetUserFavoritesQuery } from '../../api/favoritesApi';
import { useGetItemsQuery } from '../../api/itemsApi';
import { useGetLatestSalesQuery } from '../../api/baseApi';
import { useNavigation } from '@react-navigation/native';

const DashboardScreen = () => {
  const { user } = useSelector((state: RootState) => state.auth);
  const isAdmin = user?.role === 'ROLE_ADMIN';
  const navigation = useNavigation();
  
  // Fetch user favorites count
  const { data: favorites = [] } = useGetUserFavoritesQuery();
  const favoritesCount = favorites.length;
  
  // Fetch all items and calculate total stock
  const { data: items = [] } = useGetItemsQuery();
  const totalStock = items.reduce((sum, item) => sum + (item.stockQuantity || 0), 0);
  const totalProducts = items.length;
  
  // Fetch sales for today
  const { data: sales = [] } = useGetLatestSalesQuery();
  const today = new Date().toISOString().split('T')[0];
  const todaySales = sales.filter(sale => sale.createdAt && sale.createdAt.startsWith(today));
  const todaySalesCount = todaySales.length;
  const todaySalesTotal = todaySales.reduce((sum, sale) => sum + (sale.grandTotal || 0), 0);

  const UserDashboard = () => (
    <>
      <View style={styles.statsContainer}>
        <View style={styles.statCard}>
          <Text style={styles.statNumber}>{favoritesCount}</Text>
          <Text style={styles.statLabel}>Productos Favoritos</Text>
        </View>
        <View style={styles.statCard}>
          <Text style={styles.statNumber}>{totalStock}</Text>
          <Text style={styles.statLabel}>Ítems Disponibles</Text>
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Acciones Rápidas</Text>
        <View style={styles.quickActions}>
          <TouchableOpacity 
            style={[styles.actionButton, styles.exploreButton]}
            onPress={() => navigation.navigate('Explore' as never)}
          >
            <Text style={styles.actionText}>Explorar Productos</Text>
          </TouchableOpacity>
          <TouchableOpacity 
            style={[styles.actionButton, styles.favoritesButton]}
            onPress={() => navigation.navigate('Favorites' as never)}
          >
            <Text style={styles.actionText}>Ver Favoritos</Text>
          </TouchableOpacity>
        </View>
      </View>
    </>
  );

  const AdminDashboard = () => (
    <>
      <View style={styles.statsContainer}>
        <View style={styles.statCard}>
          <Text style={styles.statNumber}>{totalProducts}</Text>
          <Text style={styles.statLabel}>Productos Totales</Text>
        </View>
        <View style={styles.statCard}>
          <Text style={styles.statNumber}>${todaySalesTotal.toFixed(2)}</Text>
          <Text style={styles.statLabel}>Ventas del Día ({todaySalesCount})</Text>
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Panel de Administración</Text>
        <View style={styles.adminActions}>
          <TouchableOpacity 
            style={[styles.actionButton, styles.adminButton]}
            onPress={() => navigation.navigate('ManageItems' as never)}
          >
            <Text style={styles.actionText}>Gestionar Productos</Text>
          </TouchableOpacity>
          <TouchableOpacity 
            style={[styles.actionButton, styles.adminButton]}
            onPress={() => navigation.navigate('SaleHistory' as never)}
          >
            <Text style={styles.actionText}>Ventas Recientes</Text>
          </TouchableOpacity>
        </View>
      </View>
    </>
  );

  return (
    <ScrollView style={styles.container}>
      <View style={[styles.header, isAdmin && styles.adminHeader]}>
        <Text style={styles.welcomeText}>
          {isAdmin ? 'Panel Administrativo' : '¡Bienvenido!'}
        </Text>
        <Text style={styles.userName}>{user?.name || 'Usuario'}</Text>
        <Text style={styles.roleText}>
          {isAdmin ? 'Administrador' : 'Cliente'}
        </Text>
      </View>

      {isAdmin ? <AdminDashboard /> : <UserDashboard />}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  header: {
    backgroundColor: '#2C3335',
    padding: 20,
    paddingTop: 40,
  },
  adminHeader: {
    backgroundColor: '#8B0000',
  },
  welcomeText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
  },
  userName: {
    fontSize: 18,
    color: '#007bff',
    marginTop: 5,
  },
  roleText: {
    fontSize: 14,
    color: '#fff',
    opacity: 0.8,
    marginTop: 2,
  },
  statsContainer: {
    flexDirection: 'row',
    padding: 20,
    justifyContent: 'space-between',
  },
  statCard: {
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 20,
    flex: 1,
    marginHorizontal: 5,
    alignItems: 'center',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.22,
    shadowRadius: 2.22,
  },
  statNumber: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#007bff',
  },
  statLabel: {
    fontSize: 14,
    color: '#666',
    marginTop: 5,
    textAlign: 'center',
  },
  section: {
    padding: 20,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 15,
  },
  quickActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  adminActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  actionButton: {
    backgroundColor: '#007bff',
    borderRadius: 10,
    padding: 15,
    flex: 1,
    marginHorizontal: 5,
    alignItems: 'center',
  },
  exploreButton: {
    backgroundColor: '#28a745',
  },
  favoritesButton: {
    backgroundColor: '#ffc107',
  },
  adminButton: {
    backgroundColor: '#dc3545',
  },
  actionText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default DashboardScreen;