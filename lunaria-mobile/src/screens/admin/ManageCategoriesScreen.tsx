import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  TextInput,
  TouchableOpacity,
  FlatList,
  Alert,
  ActivityIndicator,
  Modal,
  Image,
} from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { useDispatch } from 'react-redux';
import { useGetCategoriesQuery, useCreateCategoryMutation, useDeleteCategoryMutation, useUpdateCategoryMutation } from '../../api/categoriesApi';
import { Category } from '../../types/api';
import * as ImagePicker from 'expo-image-picker';
import { API_CONFIG } from '../../constants/config';

const ManageCategoriesScreen = () => {
  const [categoryName, setCategoryName] = useState('');
  const [categoryDescription, setCategoryDescription] = useState('');
  const [categoryImage, setCategoryImage] = useState<any>(null);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(null);
  const [editName, setEditName] = useState('');
  const [editDescription, setEditDescription] = useState('');
  const [editImage, setEditImage] = useState<any>(null);

  const dispatch = useDispatch();
  const { data: categories, isLoading, error, refetch } = useGetCategoriesQuery();
  const [createCategory, { isLoading: isCreating }] = useCreateCategoryMutation();
  const [updateCategory, { isLoading: isUpdating }] = useUpdateCategoryMutation();
  const [deleteCategory, { isLoading: isDeleting }] = useDeleteCategoryMutation();

  console.log('ManageCategoriesScreen - Categories:', categories);
  console.log('ManageCategoriesScreen - Loading:', isLoading);
  console.log('ManageCategoriesScreen - Error:', error);

  // Debug category images
  if (categories) {
    categories.forEach((cat: Category) => {
      console.log(`Category ${cat.name}: imgUrl = ${cat.imgUrl}`);
    });
  }

  // Image picker functions
  const pickImage = async () => {
    Alert.alert(
      'Seleccionar Imagen',
      '¿Cómo quieres seleccionar la imagen?',
      [
        {
          text: 'Cámara',
          onPress: () => pickImageFromCamera(),
        },
        {
          text: 'Galería',
          onPress: () => pickImageFromGallery(),
        },
        {
          text: 'Cancelar',
          style: 'cancel',
        },
      ]
    );
  };

  const pickImageFromCamera = async () => {
    const { status } = await ImagePicker.requestCameraPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Permiso denegado', 'Necesitas dar permiso para acceder a la cámara');
      return;
    }

    const result = await ImagePicker.launchCameraAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.8,
    });

    if (!result.canceled) {
      setCategoryImage(result.assets[0]);
    }
  };

  const pickImageFromGallery = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Permiso denegado', 'Necesitas dar permiso para acceder a la galería');
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.8,
    });

    if (!result.canceled) {
      setCategoryImage(result.assets[0]);
    }
  };

  const removeImage = () => {
    setCategoryImage(null);
  };

  const handleCreateCategory = async () => {
    if (!categoryName.trim()) {
      Alert.alert('Error', 'El nombre de la categoría es obligatorio');
      return;
    }

    try {
      await createCategory({
        name: categoryName.trim(),
        description: categoryDescription.trim(),
        image: categoryImage,
      }).unwrap();

      Alert.alert('Éxito', 'Categoría creada correctamente');
      setCategoryName('');
      setCategoryDescription('');
      setCategoryImage(null);
      refetch();
    } catch (error: any) {
      Alert.alert('Error', error?.data?.message || 'Error al crear la categoría');
    }
  };

  const handleDeleteCategory = (category: Category) => {
    Alert.alert(
      'Eliminar Categoría',
      `¿Estás seguro de que quieres eliminar "${category.name}"?`,
      [
        {
          text: 'Cancelar',
          style: 'cancel',
        },
        {
          text: 'Eliminar',
          style: 'destructive',
          onPress: async () => {
            try {
              await deleteCategory(category.categoryId).unwrap();
              Alert.alert('Éxito', 'Categoría eliminada correctamente');
              refetch();
            } catch (error: any) {
              Alert.alert('Error', error?.data?.message || 'Error al eliminar la categoría');
            }
          },
        },
      ]
    );
  };

  const openEditModal = (category: Category) => {
    setSelectedCategory(category);
    setEditName(category.name);
    setEditDescription(category.description || '');
    setShowEditModal(true);
  };

  const closeEditModal = () => {
    setShowEditModal(false);
    setSelectedCategory(null);
    setEditName('');
    setEditDescription('');
  };

  const handleEditCategory = async () => {
    if (!selectedCategory) return;

    if (!editName.trim()) {
      Alert.alert('Error', 'El nombre de la categoría es obligatorio');
      return;
    }

    try {
      await updateCategory({
        categoryId: selectedCategory.categoryId,
        category: {
          name: editName.trim(),
          description: editDescription.trim(),
        },
      }).unwrap();

      Alert.alert('Éxito', 'Categoría actualizada correctamente');
      closeEditModal();
      refetch();
    } catch (error: any) {
      Alert.alert('Error', error?.data?.message || 'Error al actualizar la categoría');
    }
  };

  const renderCategoryItem = ({ item }: { item: Category }) => {
    // Replace localhost URLs with configured server URL for mobile compatibility
    const processedImgUrl = item.imgUrl ? item.imgUrl.replace('http://localhost:9090/api/v1.0', API_CONFIG.BASE_URL) : null;
    console.log('Rendering category:', item.name, 'original imgUrl:', item.imgUrl, 'processed:', processedImgUrl);

    return (
      <View style={styles.categoryItem}>
        {processedImgUrl ? (
          <Image
            source={{ uri: processedImgUrl }}
            style={styles.categoryImage}
            onError={(error) => console.log('Image load error for category', item.name, ':', error.nativeEvent)}
            onLoad={() => console.log('Image loaded successfully for category', item.name)}
          />
        ) : (
          <View style={[styles.categoryImage, styles.placeholderImage]}>
            <MaterialIcons name="image" size={32} color="#ccc" />
          </View>
        )}
        <View style={styles.categoryInfo}>
          <Text style={styles.categoryName}>{item.name}</Text>
          {item.description && (
            <Text style={styles.categoryDescription}>{item.description}</Text>
          )}
        </View>
        <View style={styles.actionButtons}>
          <TouchableOpacity
            onPress={() => openEditModal(item)}
            style={styles.editButton}
            disabled={isUpdating}
          >
            <MaterialIcons name="edit" size={24} color="#007bff" />
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => handleDeleteCategory(item)}
            style={styles.deleteButton}
            disabled={isDeleting}
          >
            <MaterialIcons name="delete" size={24} color="#dc3545" />
          </TouchableOpacity>
        </View>
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        {/* Formulario para crear categoría */}
        <View style={styles.formContainer}>
          <Text style={styles.sectionTitle}>Crear Nueva Categoría</Text>

          <TextInput
            style={styles.input}
            placeholder="Nombre de la categoría"
            value={categoryName}
            onChangeText={setCategoryName}
            placeholderTextColor="#666"
          />

          <TextInput
            style={[styles.input, styles.textArea]}
            placeholder="Descripción (opcional)"
            value={categoryDescription}
            onChangeText={setCategoryDescription}
            multiline
            numberOfLines={3}
            placeholderTextColor="#666"
          />

          {/* Image Picker */}
          <View style={styles.imageSection}>
            <Text style={styles.imageLabel}>Imagen de la categoría (opcional)</Text>
            {categoryImage ? (
              <View style={styles.imagePreviewContainer}>
                <Image source={{ uri: categoryImage.uri }} style={styles.imagePreview} />
                <View style={styles.imageActions}>
                  <TouchableOpacity
                    style={styles.changeImageButton}
                    onPress={pickImage}
                  >
                    <MaterialIcons name="edit" size={16} color="#fff" />
                    <Text style={styles.changeImageText}>Cambiar</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={styles.removeImageButton}
                    onPress={removeImage}
                  >
                    <MaterialIcons name="delete" size={16} color="#fff" />
                  </TouchableOpacity>
                </View>
              </View>
            ) : (
              <TouchableOpacity
                style={styles.imagePickerButton}
                onPress={pickImage}
              >
                <MaterialIcons name="add-photo-alternate" size={24} color="#dc3545" />
                <Text style={styles.imagePickerText}>Seleccionar Imagen</Text>
              </TouchableOpacity>
            )}
          </View>

          <TouchableOpacity
            style={[styles.createButton, isCreating && styles.buttonDisabled]}
            onPress={handleCreateCategory}
            disabled={isCreating}
          >
            {isCreating ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <>
                <MaterialIcons name="add" size={20} color="#fff" />
                <Text style={styles.createButtonText}>Crear Categoría</Text>
              </>
            )}
          </TouchableOpacity>
        </View>

        {/* Lista de categorías existentes */}
        <View style={styles.listContainer}>
          <Text style={styles.sectionTitle}>Categorías Existentes</Text>

          {isLoading ? (
            <ActivityIndicator size="large" color="#dc3545" />
          ) : categories && categories.length > 0 ? (
            <FlatList
              data={categories}
              keyExtractor={(item) => item.categoryId}
              renderItem={renderCategoryItem}
              showsVerticalScrollIndicator={false}
            />
          ) : (
            <View style={styles.emptyContainer}>
              <MaterialIcons name="category" size={64} color="#ccc" />
              <Text style={styles.emptyText}>No hay categorías registradas</Text>
            </View>
          )}
        </View>
      </View>

      {/* Edit Category Modal */}
      <Modal
        visible={showEditModal}
        transparent={true}
        animationType="fade"
        onRequestClose={closeEditModal}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Editar Categoría</Text>
              <TouchableOpacity onPress={closeEditModal}>
                <MaterialIcons name="close" size={24} color="#666" />
              </TouchableOpacity>
            </View>

            <View style={styles.modalBody}>
              <TextInput
                style={styles.modalInput}
                placeholder="Nombre de la categoría"
                value={editName}
                onChangeText={setEditName}
                placeholderTextColor="#666"
              />

              <TextInput
                style={[styles.modalInput, styles.modalTextArea]}
                placeholder="Descripción (opcional)"
                value={editDescription}
                onChangeText={setEditDescription}
                multiline
                numberOfLines={3}
                placeholderTextColor="#666"
              />
            </View>

            <View style={styles.modalFooter}>
              <TouchableOpacity
                style={[styles.modalButton, styles.cancelButton]}
                onPress={closeEditModal}
              >
                <Text style={styles.cancelButtonText}>Cancelar</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.modalButton, styles.updateButton, isUpdating && styles.buttonDisabled]}
                onPress={handleEditCategory}
                disabled={isUpdating}
              >
                {isUpdating ? (
                  <ActivityIndicator color="#fff" size="small" />
                ) : (
                  <Text style={styles.updateButtonText}>Actualizar</Text>
                )}
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
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
    padding: 16,
  },
  formContainer: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.22,
    shadowRadius: 2.22,
  },
  listContainer: {
    flex: 1,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#dc3545',
    marginBottom: 16,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 12,
    marginBottom: 12,
    fontSize: 16,
    backgroundColor: '#f8f9fa',
  },
  textArea: {
    height: 80,
    textAlignVertical: 'top',
  },
  createButton: {
    backgroundColor: '#28a745',
    borderRadius: 8,
    padding: 14,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonDisabled: {
    opacity: 0.6,
  },
  createButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
    marginLeft: 8,
  },
  categoryItem: {
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 16,
    marginBottom: 8,
    flexDirection: 'row',
    alignItems: 'center',
    elevation: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.18,
    shadowRadius: 1.0,
  },
  categoryImage: {
    width: 80,
    height: 80,
    borderRadius: 8,
    marginRight: 12,
    borderWidth: 1,
    borderColor: '#ddd',
  },
  placeholderImage: {
    backgroundColor: '#f8f9fa',
    justifyContent: 'center',
    alignItems: 'center',
    borderStyle: 'dashed',
    borderColor: '#ccc',
  },
  categoryInfo: {
    flex: 1,
  },
  categoryName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 4,
  },
  categoryDescription: {
    fontSize: 14,
    color: '#666',
  },
  actionButtons: {
    flexDirection: 'row',
    gap: 8,
  },
  editButton: {
    padding: 8,
  },
  deleteButton: {
    padding: 8,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyText: {
    fontSize: 16,
    color: '#666',
    marginTop: 16,
    textAlign: 'center',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: '#fff',
    borderRadius: 12,
    width: '90%',
    maxWidth: 400,
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  modalBody: {
    padding: 16,
  },
  modalInput: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 12,
    marginBottom: 12,
    fontSize: 16,
    backgroundColor: '#f8f9fa',
  },
  modalTextArea: {
    height: 80,
    textAlignVertical: 'top',
  },
  modalFooter: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: '#eee',
    gap: 12,
  },
  modalButton: {
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 6,
    minWidth: 80,
    alignItems: 'center',
  },
  cancelButton: {
    backgroundColor: '#6c757d',
  },
  cancelButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '500',
  },
  updateButton: {
    backgroundColor: '#28a745',
  },
  updateButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '500',
  },
  imageSection: {
    marginBottom: 16,
  },
  imageLabel: {
    fontSize: 16,
    fontWeight: '500',
    color: '#333',
    marginBottom: 8,
  },
  imagePickerButton: {
    borderWidth: 2,
    borderColor: '#ddd',
    borderStyle: 'dashed',
    borderRadius: 8,
    padding: 20,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#f8f9fa',
  },
  imagePickerText: {
    color: '#dc3545',
    fontSize: 16,
    fontWeight: '500',
    marginTop: 8,
  },
  imagePreviewContainer: {
    position: 'relative',
    alignItems: 'center',
  },
  imagePreview: {
    width: 120,
    height: 120,
    borderRadius: 8,
    borderWidth: 2,
    borderColor: '#ddd',
  },
  imageActions: {
    flexDirection: 'row',
    marginTop: 8,
    gap: 8,
  },
  changeImageButton: {
    backgroundColor: '#28a745',
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 6,
    gap: 4,
  },
  changeImageText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '500',
  },
  removeImageButton: {
    backgroundColor: '#dc3545',
    padding: 8,
    borderRadius: 6,
  },
});

export default ManageCategoriesScreen;