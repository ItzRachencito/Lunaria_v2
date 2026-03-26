import React, { useState, useMemo, useRef } from 'react';
import {
  View,
  Text,
  FlatList,
  TextInput,
  TouchableOpacity,
  RefreshControl,
  StyleSheet,
  Alert,
  Modal,
  Image,
} from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';

import { useGetItemsQuery, useGetCategoriesQuery } from '../../api/itemsApi';
import { useGetUserFavoritesQuery, useAddToFavoritesMutation, useRemoveFromFavoritesMutation } from '../../api/favoritesApi';
import { Item, Category } from '../../types/api';
import { API_CONFIG } from '../../constants/config';

import ItemCard from '../../components/ItemCard';
import CategoryFilter from '../../components/CategoryFilter';

const ExploreScreen = () => {
  const [selectedCategoryId, setSelectedCategoryId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [refreshing, setRefreshing] = useState(false);
  const [selectedItem, setSelectedItem] = useState<Item | null>(null);
  const [showItemModal, setShowItemModal] = useState(false);

  // API calls
  const { data: items = [], isLoading: itemsLoading, refetch: refetchItems } = useGetItemsQuery();
  const { data: categories = [], isLoading: categoriesLoading } = useGetCategoriesQuery();
  const { data: favorites = [], refetch: refetchFavorites } = useGetUserFavoritesQuery();

  const [addToFavorites] = useAddToFavoritesMutation();
  const [removeFromFavorites] = useRemoveFromFavoritesMutation();

  // Use ref for favorite IDs to avoid unnecessary re-renders
  const favoriteIdsRef = useRef<Set<string>>(new Set());

  // Only update the ref when favorites change, don't trigger re-render
  if (favorites && favorites.length > 0) {
    const ids = new Set(favorites.map(fav => fav.itemId));
    favoriteIdsRef.current = ids;
  } else {
    favoriteIdsRef.current = new Set();
  }

  // Helper function to check if item is favorite
  const isItemFavorite = (itemId: string) => favoriteIdsRef.current.has(itemId);

  // Filter items based on category and search
  const filteredItems = useMemo(() => {
    let filtered = items;

    // Filter by category - convert to string for comparison
    if (selectedCategoryId) {
      filtered = filtered.filter(item => 
        String(item.category?.categoryId) === selectedCategoryId || 
        String(item.categoryId) === selectedCategoryId
      );
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
    setSelectedItem(item);
    setShowItemModal(true);
  };

  const closeModal = () => {
    setShowItemModal(false);
    setSelectedItem(null);
  };

  // Process image URL for mobile
  const processImageUrl = (imgUrl: string | undefined) => {
    if (!imgUrl) return null;
    return imgUrl.replace('http://localhost:9090/api/v1.0', API_CONFIG.BASE_URL);
  };

  const handleFavoritePress = async (item: Item) => {
    try {
      const isFavorite = isItemFavorite(item.itemId);

      if (isFavorite) {
        await removeFromFavorites(item.itemId).unwrap();
        Alert.alert('Éxito', 'Removido de favoritos');
      } else {
        await addToFavorites(item.itemId).unwrap();
        Alert.alert('Éxito', 'Agregado a favoritos');
      }
      // Refetch favorites to update the UI
      await refetchFavorites();
    } catch (error) {
      console.error('Error updating favorites:', error);
      Alert.alert('Error', 'No se pudo actualizar favoritos');
    }
  };

  const renderItem = ({ item }: { item: Item }) => (
    <ItemCard
      item={item}
      onPress={() => handleItemPress(item)}
      onFavoritePress={() => handleFavoritePress(item)}
      isFavorite={isItemFavorite(item.itemId)}
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

  // Search Bar and Category Filter are now rendered directly in the return statement
  // to prevent re-render issues with TextInput

  return (
    <SafeAreaView style={styles.container}>
      {/* Search Bar - Outside FlatList to prevent keyboard issues */}
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

      {/* Category Filter - Outside FlatList */}
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

      <FlatList
        data={filteredItems}
        keyExtractor={(item) => item.id.toString()}
        renderItem={renderItem}
        ListEmptyComponent={renderEmpty}
        numColumns={2}
        contentContainerStyle={styles.listContainer}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={handleRefresh} />
        }
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
        keyboardDismissMode="on-drag"
      />

      {/* Item Detail Modal */}
      <Modal
        visible={showItemModal}
        transparent={true}
        animationType="fade"
        onRequestClose={closeModal}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <TouchableOpacity style={styles.closeButton} onPress={closeModal}>
              <MaterialIcons name="close" size={24} color="#666" />
            </TouchableOpacity>

            {selectedItem && (
              <>
                {selectedItem.imgUrl && (
                  <Image
                    source={{ uri: processImageUrl(selectedItem.imgUrl) || undefined }}
                    style={styles.modalImage}
                  />
                )}
                <Text style={styles.modalTitle}>{selectedItem.name}</Text>
                {selectedItem.description && (
                  <Text style={styles.modalDescription}>
                    {selectedItem.description}
                  </Text>
                )}
                <View style={styles.priceContainer}>
                  <Text style={styles.modalPrice}>
                    ${selectedItem.price.toFixed(2)}
                  </Text>
                  {selectedItem.installationPrice && (
                    <Text style={styles.modalInstallationPrice}>
                      Con instalación: ${selectedItem.installationPrice.toFixed(2)}
                    </Text>
                  )}
                </View>
                <Text style={styles.modalStock}>
                  Stock disponible: {selectedItem.stockQuantity}
                </Text>
              </>
            )}
          </View>
        </View>
      </Modal>
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
  // Modal styles
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 20,
    width: '85%',
    maxWidth: 400,
    alignItems: 'center',
  },
  closeButton: {
    position: 'absolute',
    top: 10,
    right: 10,
    zIndex: 1,
    padding: 8,
  },
  modalImage: {
    width: 200,
    height: 200,
    borderRadius: 12,
    marginBottom: 16,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    textAlign: 'center',
    marginBottom: 8,
  },
  modalDescription: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
    marginBottom: 16,
  },
  priceContainer: {
    alignItems: 'center',
    marginBottom: 12,
  },
  modalPrice: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#007bff',
  },
  modalInstallationPrice: {
    fontSize: 16,
    color: '#17a2b8',
    marginTop: 4,
  },
  modalStock: {
    fontSize: 14,
    color: '#666',
  },
});

export default ExploreScreen;