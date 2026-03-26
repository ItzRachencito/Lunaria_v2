import React from 'react';
import { View, Text, TouchableOpacity, ScrollView, StyleSheet, Image } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { Category } from '../types/api';
import { API_CONFIG } from '../constants/config';

interface CategoryFilterProps {
  categories: Category[];
  selectedCategoryId: string | null;
  onCategorySelect: (categoryId: string | null) => void;
}

const CategoryFilter: React.FC<CategoryFilterProps> = ({
  categories,
  selectedCategoryId,
  onCategorySelect,
}) => {
  // Process image URL for mobile compatibility
  const processImageUrl = (imgUrl: string | undefined) => {
    if (!imgUrl) return null;
    return imgUrl.replace('http://localhost:9090/api/v1.0', API_CONFIG.BASE_URL);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Categorías</Text>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.scrollContainer}
      >
        {/* Botón "Todas" sin imagen */}
        <TouchableOpacity
          style={[
            styles.categoryButton,
            selectedCategoryId === null && styles.selectedButton,
          ]}
          onPress={() => onCategorySelect(null)}
        >
          <Text
            style={[
              styles.categoryText,
              selectedCategoryId === null && styles.selectedText,
            ]}
          >
            Todas
          </Text>
        </TouchableOpacity>

        {categories.map((category) => {
          const isSelected = selectedCategoryId === category.categoryId;
          const processedImgUrl = processImageUrl(category.imgUrl);

          return (
            <TouchableOpacity
              key={category.categoryId}
              style={[
                styles.categoryItem,
                isSelected && styles.selectedItem,
                { backgroundColor: category.bgColor || '#6c757d' },
              ]}
              onPress={() => onCategorySelect(category.categoryId)}
            >
              {processedImgUrl ? (
                <Image
                  source={{ uri: processedImgUrl }}
                  style={styles.categoryImage}
                />
              ) : (
                <View style={styles.imagePlaceholder}>
                  <MaterialIcons name="category" size={24} color="#fff" />
                </View>
              )}
              <Text
                style={[
                  styles.categoryName,
                  isSelected && styles.selectedText,
                ]}
                numberOfLines={1}
              >
                {category.name}
              </Text>
            </TouchableOpacity>
          );
        })}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingVertical: 12,
    paddingHorizontal: 16,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  title: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 8,
  },
  scrollContainer: {
    paddingRight: 16,
  },
  categoryButton: {
    backgroundColor: '#f5f5f5',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    marginRight: 8,
    borderWidth: 1,
    borderColor: '#e0e0e0',
  },
  selectedButton: {
    backgroundColor: '#007bff',
    borderColor: '#007bff',
  },
  categoryItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 16,
    marginRight: 8,
    minWidth: 120,
    maxWidth: 200,
  },
  selectedItem: {
    borderWidth: 2,
    borderColor: '#fff',
  },
  categoryImage: {
    width: 28,
    height: 28,
    borderRadius: 14,
    marginRight: 6,
  },
  imagePlaceholder: {
    width: 28,
    height: 28,
    borderRadius: 14,
    marginRight: 6,
    backgroundColor: 'rgba(255,255,255,0.3)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  categoryName: {
    fontSize: 12,
    color: '#fff',
    fontWeight: '600',
  },
  categoryText: {
    fontSize: 14,
    color: '#666',
    fontWeight: '500',
  },
  selectedText: {
    color: '#fff',
  },
});

export default CategoryFilter;
