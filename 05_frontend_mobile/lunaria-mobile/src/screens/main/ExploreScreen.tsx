import React, { useState, useMemo } from 'react';
import {
  View,
  Text,
  FlatList,
  TextInput,
  TouchableOpacity,
  RefreshControl,
  StyleSheet,
  Alert,
} from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';

import { useGetItemsQuery, useGetCategoriesQuery } from '../../api/itemsApi';
import { useAddToFavoritesMutation, useRemoveFromFavoritesMutation } from '../../api/favoritesApi';
import { useCheckFavoriteStatusQuery } from '../../api/favoritesApi';
import { Item, Category } from '../../types/api';

import ItemCard from '../../components/ItemCard';
import CategoryFilter from '../../components/CategoryFilter';

const ExploreScreen = () => {
  const [selectedCategoryId, setSelectedCategoryId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [refreshing, setRefreshing] = useState(false);

  // API calls
  const { data: items = [], isLoading: itemsLoading, refetch: refetchItems } = useGetItemsQuery();
  const { data: categories = [], isLoading: categoriesLoading } = useGetCategoriesQuery();

  const [addToFavorites] = useAddToFavoritesMutation();
  const [removeFromFavorites] = useRemoveFromFavoritesMutation();

  // Filter items based on category and search
  const filteredItems = useMemo(() => {
    let filtered = items;

    // Filter by category
    if (selectedCategoryId) {
      filtered = filtered.filter(item => item.category?.categoryId === selectedCategoryId);
    }

    // Filter by search query
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(item =>
        item.name.toLowerCase().includes(query) ||
        item.description.toLowerCase().includes(query) ||
        item.category?.name.toLowerCase().includes(query)
      );
    }

    return filtered;
  }, [items, selectedCategoryId, searchQuery]);

  const handleRefresh = async () => {
    setRefreshing(true);
    await refetchItems();
    setRefreshing(false);
  };

  const handleItemPress = (item: Item) => {
    // TODO: Navigate to item detail screen
    Alert.alert('Producto', `Detalles de: ${item.name}`);
  };

  const handleFavoritePress = async (item: Item) => {
    try {
      // Check if item is already favorite
      const isFavorite = await checkIfFavorite(item.itemId);

      if (isFavorite) {
        await removeFromFavorites(item.itemId).unwrap();
        Alert.alert('Éxito', 'Removido de favoritos');
      } else {
        await addToFavorites(item.itemId).unwrap();
        Alert.alert('Éxito', 'Agregado a favoritos');
      }
    } catch (error) {
      Alert.alert('Error', 'No se pudo actualizar favoritos');
    }
  };

  const checkIfFavorite = async (itemId: string): Promise<boolean> => {
    // This is a simplified check - in a real app you'd track this in state
    return false; // TODO: Implement proper favorite status checking
  };

  const renderItem = ({ item }: { item: Item }) => (
    <ItemCard
      item={item}
      onPress={() => handleItemPress(item)}
      onFavoritePress={() => handleFavoritePress(item)}
      showFavoriteButton={true}
    />
  );

  const renderEmpty = () => (
    <View style={styles.emptyContainer}>
      <MaterialIcons name="search-off" size={64} color="#ccc" />
      <Text style={styles.emptyTitle}>No se encontraron productos</Text>
      <Text style={styles.emptySubtitle}>
        {searchQuery ? 'Intenta con otros términos de búsqueda' : 'No hay productos disponibles'}
      </Text>
    </View>
  );

  const renderHeader = () => (
    <>
      {/* Search Bar */}
      <View style={styles.searchContainer}>
        <MaterialIcons name="search" size={24} color="#666" style={styles.searchIcon} />
        <TextInput
          style={styles.searchInput}
          placeholder="Buscar productos..."
          value={searchQuery}
          onChangeText={setSearchQuery}
          clearButtonMode="while-editing"
        />
        {searchQuery ? (
          <TouchableOpacity onPress={() => setSearchQuery('')}>
            <MaterialIcons name="clear" size={24} color="#666" />
          </TouchableOpacity>
        ) : null}
      </View>

      {/* Category Filter */}
      {!categoriesLoading && categories.length > 0 && (
        <CategoryFilter
          categories={categories}
          selectedCategoryId={selectedCategoryId}
          onCategorySelect={setSelectedCategoryId}
        />
      )}

      {/* Results Count */}
      <View style={styles.resultsContainer}>
        <Text style={styles.resultsText}>
          {filteredItems.length} producto{filteredItems.length !== 1 ? 's' : ''} encontrado{filteredItems.length !== 1 ? 's' : ''}
        </Text>
      </View>
    </>
  );

  return (
    <SafeAreaView style={styles.container}>
      <FlatList
        data={filteredItems}
        keyExtractor={(item) => item.id.toString()}
        renderItem={renderItem}
        ListHeaderComponent={renderHeader}
        ListEmptyComponent={renderEmpty}
        numColumns={2}
        contentContainerStyle={styles.listContainer}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={handleRefresh} />
        }
        showsVerticalScrollIndicator={false}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    margin: 16,
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 12,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  searchIcon: {
    marginRight: 12,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    color: '#333',
  },
  resultsContainer: {
    paddingHorizontal: 16,
    paddingBottom: 8,
  },
  resultsText: {
    fontSize: 14,
    color: '#666',
    fontWeight: '500',
  },
  listContainer: {
    paddingBottom: 20,
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
  },
  emptySubtitle: {
    fontSize: 14,
    color: '#999',
    textAlign: 'center',
    marginTop: 8,
    paddingHorizontal: 32,
  },
});

export default ExploreScreen;