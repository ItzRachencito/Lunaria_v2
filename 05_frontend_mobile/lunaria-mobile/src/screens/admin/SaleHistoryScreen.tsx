import React, { useState, useEffect, useMemo } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  FlatList,
  TouchableOpacity,
  TextInput,
  Alert,
} from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { useGetLatestSalesQuery } from '../../api/baseApi';
import { Sale } from '../../types/api';

const SaleHistoryScreen = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const { data: sales = [], isLoading, error } = useGetLatestSalesQuery();

  // Filter sales based on search query
  const filteredSales = useMemo(() => {
    if (!searchQuery.trim()) return sales;

    const query = searchQuery.toLowerCase();
    return sales.filter((sale: Sale) =>
      sale.customerName.toLowerCase().includes(query) ||
      sale.phoneNumber.includes(query) ||
      sale.saleId.toLowerCase().includes(query)
    );
  }, [sales, searchQuery]);

  const renderSaleItem = ({ item }: { item: Sale }) => (
    <View style={styles.saleCard}>
      <View style={styles.saleHeader}>
        <Text style={styles.saleId}>#{item.saleId.substring(0, 8)}...</Text>
        <Text style={styles.saleDate}>
          {new Date(item.createdAt).toLocaleDateString([], {
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
          })}
        </Text>
      </View>

      <View style={styles.saleInfo}>
        <View style={styles.customerInfo}>
          <MaterialIcons name="person" size={16} color="#666" />
          <Text style={styles.customerName}>{item.customerName}</Text>
        </View>

        <View style={styles.customerInfo}>
          <MaterialIcons name="phone" size={16} color="#666" />
          <Text style={styles.customerPhone}>{item.phoneNumber}</Text>
        </View>
      </View>

      <View style={styles.saleFooter}>
        <View style={styles.totalContainer}>
          <Text style={styles.totalLabel}>Total:</Text>
          <Text style={styles.totalAmount}>${item.grandTotal?.toFixed(2) || '0.00'}</Text>
        </View>

        <View style={styles.paymentContainer}>
          <Text style={[styles.paymentMethod, { backgroundColor: item.paymentMethod === 'CASH' ? '#28a745' : '#007bff' }]}>
            {item.paymentMethod}
          </Text>
        </View>
      </View>
    </View>
  );

  const renderEmpty = () => (
    <View style={styles.emptyContainer}>
      <MaterialIcons name="receipt" size={64} color="#ccc" />
      <Text style={styles.emptyTitle}>
        {searchQuery ? 'No se encontraron ventas' : 'No hay ventas recientes'}
      </Text>
      <Text style={styles.emptySubtitle}>
        {searchQuery ? 'Intenta con otros términos de búsqueda' : 'Las ventas aparecerán aquí'}
      </Text>
    </View>
  );

  if (error) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.errorContainer}>
          <MaterialIcons name="error" size={64} color="#dc3545" />
          <Text style={styles.errorTitle}>Error al cargar ventas</Text>
          <Text style={styles.errorSubtitle}>Por favor intenta de nuevo</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Historial de Ventas</Text>
        <Text style={styles.subtitle}>{filteredSales.length} ventas encontradas</Text>
      </View>

      {/* Search Bar */}
      <View style={styles.searchContainer}>
        <MaterialIcons name="search" size={20} color="#666" style={styles.searchIcon} />
        <TextInput
          style={styles.searchInput}
          placeholder="Buscar por nombre, teléfono o ID de venta..."
          value={searchQuery}
          onChangeText={setSearchQuery}
          placeholderTextColor="#999"
        />
        {searchQuery ? (
          <TouchableOpacity onPress={() => setSearchQuery('')}>
            <MaterialIcons name="clear" size={20} color="#666" />
          </TouchableOpacity>
        ) : null}
      </View>

      {/* Sales List */}
      <FlatList
        data={filteredSales}
        keyExtractor={(item) => item.saleId}
        renderItem={renderSaleItem}
        ListEmptyComponent={renderEmpty}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.listContainer}
        refreshing={isLoading}
        onRefresh={() => {
          // Trigger refetch
          window.location.reload();
        }}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  header: {
    padding: 16,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#e9ecef',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#dc3545',
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 14,
    color: '#6c757d',
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    margin: 16,
    marginTop: 0,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#dee2e6',
  },
  searchIcon: {
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    color: '#333',
  },
  listContainer: {
    padding: 16,
    paddingTop: 0,
  },
  saleCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  saleHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  saleId: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#dc3545',
  },
  saleDate: {
    fontSize: 12,
    color: '#6c757d',
  },
  saleInfo: {
    marginBottom: 12,
  },
  customerInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  customerName: {
    fontSize: 16,
    fontWeight: '500',
    color: '#333',
    marginLeft: 8,
  },
  customerPhone: {
    fontSize: 14,
    color: '#666',
    marginLeft: 8,
  },
  saleFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  totalContainer: {
    flex: 1,
  },
  totalLabel: {
    fontSize: 12,
    color: '#6c757d',
  },
  totalAmount: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#28a745',
  },
  paymentContainer: {
    marginLeft: 12,
  },
  paymentMethod: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#fff',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    overflow: 'hidden',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: 100,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#666',
    marginTop: 16,
    textAlign: 'center',
  },
  emptySubtitle: {
    fontSize: 14,
    color: '#999',
    textAlign: 'center',
    marginTop: 8,
    paddingHorizontal: 32,
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  errorTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#dc3545',
    marginTop: 16,
    textAlign: 'center',
  },
  errorSubtitle: {
    fontSize: 14,
    color: '#6c757d',
    textAlign: 'center',
    marginTop: 8,
  },
});

export default SaleHistoryScreen;