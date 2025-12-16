import React from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { Item } from '../types/api';

interface ItemCardProps {
  item: Item;
  onPress: () => void;
  onFavoritePress?: () => void;
  isFavorite?: boolean;
  showFavoriteButton?: boolean;
}

const ItemCard: React.FC<ItemCardProps> = ({
  item,
  onPress,
  onFavoritePress,
  isFavorite = false,
  showFavoriteButton = true,
}) => {
  return (
    <TouchableOpacity style={styles.card} onPress={onPress}>
      <View style={styles.imageContainer}>
        {item.imgUrl ? (
          <Image source={{ uri: item.imgUrl }} style={styles.image} />
        ) : (
          <View style={styles.placeholderImage}>
            <MaterialIcons name="image" size={40} color="#ccc" />
          </View>
        )}
        {showFavoriteButton && onFavoritePress && (
          <TouchableOpacity
            style={styles.favoriteButton}
            onPress={onFavoritePress}
          >
            <MaterialIcons
              name={isFavorite ? 'favorite' : 'favorite-border'}
              size={24}
              color={isFavorite ? '#ff4444' : '#666'}
            />
          </TouchableOpacity>
        )}
      </View>

      <View style={styles.content}>
        <Text style={styles.name} numberOfLines={2}>
          {item.name}
        </Text>

        <Text style={styles.description} numberOfLines={2}>
          {item.description}
        </Text>

        <View style={styles.footer}>
          <Text style={styles.price}>${item.price.toFixed(2)}</Text>
          <Text style={styles.stock}>
            Stock: {item.stockQuantity}
          </Text>
        </View>

        {item.category && (
          <View style={styles.categoryBadge}>
            <Text style={styles.categoryText}>{item.category.name}</Text>
          </View>
        )}
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#fff',
    borderRadius: 12,
    margin: 8,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    overflow: 'hidden',
  },
  imageContainer: {
    position: 'relative',
    height: 150,
  },
  image: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  placeholderImage: {
    width: '100%',
    height: '100%',
    backgroundColor: '#f5f5f5',
    justifyContent: 'center',
    alignItems: 'center',
  },
  favoriteButton: {
    position: 'absolute',
    top: 8,
    right: 8,
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    borderRadius: 20,
    padding: 8,
  },
  content: {
    padding: 12,
  },
  name: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 4,
  },
  description: {
    fontSize: 14,
    color: '#666',
    marginBottom: 8,
    lineHeight: 18,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  price: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#007bff',
  },
  stock: {
    fontSize: 12,
    color: '#666',
  },
  categoryBadge: {
    position: 'absolute',
    top: 8,
    left: 8,
    backgroundColor: 'rgba(0, 123, 255, 0.9)',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  categoryText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: 'bold',
  },
});

export default ItemCard;