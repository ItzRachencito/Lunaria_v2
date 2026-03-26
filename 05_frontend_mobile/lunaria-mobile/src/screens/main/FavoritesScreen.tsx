import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Alert,
  Modal,
  Image,
  ActivityIndicator,
} from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';

import { useGetUserFavoritesQuery, useRemoveFromFavoritesMutation } from '../../api/favoritesApi';
import { useGetItemsQuery } from '../../api/itemsApi';
import { Item, Favorite } from '../../types/api';
import { API_CONFIG } from '../../constants/config';

const FavoritesScreen: React.FC = () => {
  const { data: favorites = [], isLoading, refetch } = useGetUserFavoritesQuery();
  const { data: items = [] } = useGetItemsQuery();
  const [removeFromFavorites, { isLoading: isRemoving }] = useRemoveFromFavoritesMutation();

  const [selectedItem, setSelectedItem] = useState<Item | null>(null);
  const [showItemModal, setShowItemModal] = useState(false);

  // Get full item details from favorites
  const getFullItemDetails = (favorite: Favorite): Item | null => {
    // First try to get from the favorite.item if it's populated
    if (favorite.item) {
      return favorite.item as Item;
    }
    // Fallback: find in items list
    const item = items.find(i => i.itemId === favorite.itemId);
    return item || null;
  };

  const handleItemPress = (favorite: Favorite) => {
    const fullItem = getFullItemDetails(favorite);
    if (fullItem) {
      setSelectedItem(fullItem);
      setShowItemModal(true);
    }
  };

  const handleRemoveFavorite = async (itemId: string) => {
    Alert.alert(
      'Eliminar de Favoritos',
      '¿Estás seguro de que quieres eliminar este producto de favoritos?',
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Eliminar',
          style: 'destructive',
          onPress: async () => {
            try {
              await removeFromFavorites(itemId).unwrap();
              Alert.alert('Éxito', 'Producto eliminado de favoritos');
              refetch();
            } catch (error) {
              Alert.alert('Error', 'No se pudo eliminar el producto de favoritos');
            }
          },
        },
      ]
    );
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

  const renderFavoriteItem = ({ item: favorite }: { item: Favorite }) => {
    const fullItem = getFullItemDetails(favorite);
    
    if (!fullItem) return null;

    const processedImgUrl = processImageUrl(fullItem.imgUrl);

    return (
      <TouchableOpacity
        style={styles.itemCard}
        onPress={() => handleItemPress(favorite)}
      >
        {processedImgUrl ? (
          <Image source={{ uri: processedImgUrl }} style={styles.itemImage} />
        ) : (
          <View style={[styles.itemImage, styles.placeholderImage]}>
            <MaterialIcons name="image" size={32} color="#ccc" />
          </View>
        )}
        <View style={styles.itemInfo}>
          <Text style={styles.itemName} numberOfLines={2}>
            {fullItem.name}
          </Text>
          <Text style={styles.itemPrice}>${fullItem.price.toFixed(2)}</Text>
          {fullItem.installationPrice && (
            <Text style={styles.installationPrice}>
              Instalación: ${fullItem.installationPrice.toFixed(2)}
            </Text>
          )}
          {fullItem.category && (
            <Text style={styles.itemCategory}>{fullItem.category.name}</Text>
          )}
        </View>
        <TouchableOpacity
          style={styles.removeButton}
          onPress={() => handleRemoveFavorite(favorite.itemId)}
          disabled={isRemoving}
        >
          <MaterialIcons name="favorite" size={24} color="#dc3545" />
        </TouchableOpacity>
      </TouchableOpacity>
    );
  };

  const renderEmpty = () => (
    <View style={styles.emptyContainer}>
      <MaterialIcons name="favorite-border" size={64} color="#ccc" />
      <Text style={styles.emptyTitle}>No tienes favoritos</Text>
      <Text style={styles.emptySubtitle}>
        Agrega productos a favoritos desde la pantalla Explorar
      </Text>
    </View>
  );

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#007bff" />
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <FlatList
        data={favorites}
        keyExtractor={(item) => item.id.toString()}
        renderItem={renderFavoriteItem}
        ListEmptyComponent={renderEmpty}
        contentContainerStyle={favorites.length === 0 ? styles.emptyList : styles.list}
        showsVerticalScrollIndicator={false}
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
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  list: {
    padding: 16,
  },
  emptyList: {
    flex: 1,
  },
  itemCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    marginBottom: 12,
    flexDirection: 'row',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    overflow: 'hidden',
  },
  itemImage: {
    width: 100,
    height: 100,
  },
  placeholderImage: {
    backgroundColor: '#f5f5f5',
    justifyContent: 'center',
    alignItems: 'center',
  },
  itemInfo: {
    flex: 1,
    padding: 12,
    justifyContent: 'center',
  },
  itemName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 4,
  },
  itemPrice: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#007bff',
  },
  installationPrice: {
    fontSize: 14,
    color: '#17a2b8',
    marginTop: 2,
  },
  itemCategory: {
    fontSize: 12,
    color: '#666',
    marginTop: 4,
  },
  removeButton: {
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 32,
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#666',
    marginTop: 16,
  },
  emptySubtitle: {
    fontSize: 14,
    color: '#999',
    textAlign: 'center',
    marginTop: 8,
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

export default FavoritesScreen;
