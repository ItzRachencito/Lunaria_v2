import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { useSelector } from 'react-redux';
import { RootState } from '../../store/store';

const DashboardScreen = () => {
  const { user } = useSelector((state: RootState) => state.auth);
  const isAdmin = user?.role === 'ROLE_ADMIN';

  const UserDashboard = () => (
    <>
      <View style={styles.statsContainer}>
        <View style={styles.statCard}>
          <Text style={styles.statNumber}>0</Text>
          <Text style={styles.statLabel}>Productos Favoritos</Text>
        </View>
        <View style={styles.statCard}>
          <Text style={styles.statNumber}>0</Text>
          <Text style={styles.statLabel}>Compras Realizadas</Text>
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Acciones Rápidas</Text>
        <View style={styles.quickActions}>
          <View style={[styles.actionButton, styles.exploreButton]}>
            <Text style={styles.actionText}>Explorar Productos</Text>
          </View>
          <View style={[styles.actionButton, styles.favoritesButton]}>
            <Text style={styles.actionText}>Ver Favoritos</Text>
          </View>
        </View>
      </View>
    </>
  );

  const AdminDashboard = () => (
    <>
      <View style={styles.statsContainer}>
        <View style={styles.statCard}>
          <Text style={styles.statNumber}>0</Text>
          <Text style={styles.statLabel}>Productos Totales</Text>
        </View>
        <View style={styles.statCard}>
          <Text style={styles.statNumber}>0</Text>
          <Text style={styles.statLabel}>Ventas del Día</Text>
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Panel de Administración</Text>
        <View style={styles.adminActions}>
          <View style={[styles.actionButton, styles.adminButton]}>
            <Text style={styles.actionText}>Gestionar Productos</Text>
          </View>
          <View style={[styles.actionButton, styles.adminButton]}>
            <Text style={styles.actionText}>Ver Reportes</Text>
          </View>
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