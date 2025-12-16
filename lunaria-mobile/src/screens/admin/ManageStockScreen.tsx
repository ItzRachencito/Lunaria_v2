import React from 'react';
import { View, Text, StyleSheet, SafeAreaView } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';

const ManageStockScreen = () => {
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <MaterialIcons name="warehouse" size={64} color="#dc3545" />
        <Text style={styles.title}>Gestión de Inventario</Text>
        <Text style={styles.subtitle}>Próximamente: Control de stock</Text>
        <Text style={styles.description}>
          Administra el inventario, movimientos de stock y alertas de productos.
        </Text>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#dc3545',
    marginTop: 16,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 16,
    color: '#6c757d',
    marginTop: 8,
    textAlign: 'center',
  },
  description: {
    fontSize: 14,
    color: '#495057',
    marginTop: 16,
    textAlign: 'center',
    lineHeight: 20,
  },
});

export default ManageStockScreen;