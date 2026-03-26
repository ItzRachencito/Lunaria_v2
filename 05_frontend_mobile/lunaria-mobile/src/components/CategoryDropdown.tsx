import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Modal,
  FlatList,
  StyleSheet,
} from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { Category } from '../types/api';

interface DropdownItem {
  categoryId: string | null;
  name: string;
  description?: string;
}

interface CategoryDropdownProps {
  categories: Category[];
  selectedCategoryId: string | null;
  onCategorySelect: (categoryId: string | null) => void;
}

const CategoryDropdown: React.FC<CategoryDropdownProps> = ({
  categories,
  selectedCategoryId,
  onCategorySelect,
}) => {
  const [modalVisible, setModalVisible] = useState(false);

  // Ensure categories is an array
  const safeCategories = categories || [];

  const selectedCategory = safeCategories.find(cat => cat.categoryId === selectedCategoryId);

  const handleCategorySelect = (categoryId: string | null) => {
    onCategorySelect(categoryId);
    setModalVisible(false);
  };

  const renderCategoryItem = ({ item }: { item: DropdownItem }) => (
    <TouchableOpacity
      style={[
        styles.categoryItem,
        selectedCategoryId === item.categoryId && styles.selectedCategoryItem,
      ]}
      onPress={() => handleCategorySelect(item.categoryId)}
    >
      <Text
        style={[
          styles.categoryText,
          selectedCategoryId === item.categoryId && styles.selectedCategoryText,
        ]}
      >
        {item.name}
      </Text>
      {selectedCategoryId === item.categoryId && (
        <MaterialIcons name="check" size={20} color="#007bff" />
      )}
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.label}>Filtrar por Categoría</Text>

      <TouchableOpacity
        style={styles.dropdownButton}
        onPress={() => setModalVisible(true)}
      >
        <Text style={styles.dropdownText}>
          {selectedCategory ? selectedCategory.name : 'Todas las categorías'}
        </Text>
        <MaterialIcons name="arrow-drop-down" size={24} color="#666" />
      </TouchableOpacity>

      <Modal
        visible={modalVisible}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Seleccionar Categoría</Text>
              <TouchableOpacity
                onPress={() => setModalVisible(false)}
                style={styles.closeButton}
              >
                <MaterialIcons name="close" size={24} color="#666" />
              </TouchableOpacity>
            </View>

            <FlatList
              data={
                [
                  { categoryId: null, name: 'Todas las categorías' },
                  ...safeCategories.map((cat) => ({
                    categoryId: cat.categoryId,
                    name: cat.name,
                    description: cat.description,
                  })),
                ] as DropdownItem[]
              }
              keyExtractor={(item) => item.categoryId || 'all'}
              renderItem={renderCategoryItem}
              showsVerticalScrollIndicator={false}
              style={styles.categoryList}
            />
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginHorizontal: 16,
    marginBottom: 16,
  },
  label: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 8,
  },
  dropdownButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#fff',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 8,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  dropdownText: {
    fontSize: 16,
    color: '#333',
    flex: 1,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: '#fff',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    maxHeight: '70%',
  },
  modalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  closeButton: {
    padding: 4,
  },
  categoryList: {
    maxHeight: 300,
  },
  categoryItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  selectedCategoryItem: {
    backgroundColor: '#f8f9ff',
  },
  categoryText: {
    fontSize: 16,
    color: '#333',
  },
  selectedCategoryText: {
    color: '#007bff',
    fontWeight: 'bold',
  },
});

export default CategoryDropdown;