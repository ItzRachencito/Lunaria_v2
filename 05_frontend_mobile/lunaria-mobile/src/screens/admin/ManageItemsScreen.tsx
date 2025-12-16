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
  ScrollView,
  Image,
} from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { MaterialIcons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import { useDispatch } from 'react-redux';
import { useGetItemsQuery, useCreateItemMutation, useDeleteItemMutation, useUpdateItemMutation } from '../../api/baseApi';
import { useGetBrandsQuery } from '../../api/brandsApi';
import { useGetCategoriesQuery } from '../../api/categoriesApi';
import { Item, Brand, Category } from '../../types/api';
import { API_CONFIG } from '../../constants/config';

const ManageItemsScreen = () => {
  const [itemName, setItemName] = useState('');
  const [itemDescription, setItemDescription] = useState('');
  const [itemPrice, setItemPrice] = useState('');
  const [itemStock, setItemStock] = useState('');
  const [selectedBrand, setSelectedBrand] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedItem, setSelectedItem] = useState<Item | null>(null);
  const [editName, setEditName] = useState('');
  const [editDescription, setEditDescription] = useState('');
  const [editPrice, setEditPrice] = useState('');
  const [editStock, setEditStock] = useState('');
  const [editBrandId, setEditBrandId] = useState('');
  const [editCategoryId, setEditCategoryId] = useState('');
  const [selectedImage, setSelectedImage] = useState<ImagePicker.ImagePickerAsset | null>(null);
  const [editImage, setEditImage] = useState<ImagePicker.ImagePickerAsset | null>(null);

  const dispatch = useDispatch();
  const { data: items, isLoading, error, refetch } = useGetItemsQuery();
  const { data: brands } = useGetBrandsQuery();
  const { data: categories } = useGetCategoriesQuery();
  const [createItem, { isLoading: isCreating }] = useCreateItemMutation();
  const [updateItem, { isLoading: isUpdating }] = useUpdateItemMutation();
  const [deleteItem, { isLoading: isDeleting }] = useDeleteItemMutation();

  console.log('ManageItemsScreen - Items:', items);
  console.log('ManageItemsScreen - Loading:', isLoading);
  console.log('ManageItemsScreen - Error:', error);

  // Request permissions for camera and media library
  useEffect(() => {
    (async () => {
      const cameraStatus = await ImagePicker.requestCameraPermissionsAsync();
      const mediaStatus = await ImagePicker.requestMediaLibraryPermissionsAsync();

      if (cameraStatus.status !== 'granted' || mediaStatus.status !== 'granted') {
        Alert.alert('Permisos requeridos', 'Se necesitan permisos de cámara y galería para seleccionar imágenes');
      }
    })();
  }, []);

  // Image picker functions
  const pickImageFromGallery = async () => {
    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [4, 3],
        quality: 0.8,
      });

      if (!result.canceled) {
        setSelectedImage(result.assets[0]);
      }
    } catch (error) {
      Alert.alert('Error', 'Error al seleccionar imagen de la galería');
    }
  };

  const takePhoto = async () => {
    try {
      const result = await ImagePicker.launchCameraAsync({
        allowsEditing: true,
        aspect: [4, 3],
        quality: 0.8,
      });

      if (!result.canceled) {
        setSelectedImage(result.assets[0]);
      }
    } catch (error) {
      Alert.alert('Error', 'Error al tomar foto');
    }
  };

  const showImagePickerOptions = () => {
    Alert.alert(
      'Seleccionar Imagen',
      '¿Cómo quieres agregar la imagen?',
      [
        { text: 'Cancelar', style: 'cancel' },
        { text: 'Tomar Foto', onPress: takePhoto },
        { text: 'Seleccionar de Galería', onPress: pickImageFromGallery },
      ]
    );
  };

  const handleCreateItem = async () => {
    if (!itemName.trim() || !itemPrice.trim() || !itemStock.trim()) {
      Alert.alert('Error', 'Nombre, precio y stock son obligatorios');
      return;
    }

    const price = parseFloat(itemPrice);
    const stock = parseInt(itemStock);

    if (isNaN(price) || price <= 0) {
      Alert.alert('Error', 'El precio debe ser un número positivo');
      return;
    }

    if (isNaN(stock) || stock < 0) {
      Alert.alert('Error', 'El stock debe ser un número no negativo');
      return;
    }

    try {
      await createItem({
        name: itemName.trim(),
        description: itemDescription.trim(),
        price: price,
        stock: stock,
        brandId: selectedBrand || undefined,
        categoryId: selectedCategory || undefined,
        image: selectedImage,
      }).unwrap();

      Alert.alert('Éxito', 'Producto creado correctamente');
      setItemName('');
      setItemDescription('');
      setItemPrice('');
      setItemStock('');
      setSelectedBrand('');
      setSelectedCategory('');
      setSelectedImage(null);
      refetch();
    } catch (error: any) {
      Alert.alert('Error', error?.data?.message || 'Error al crear el producto');
    }
  };

  const handleDeleteItem = (item: Item) => {
    Alert.alert(
      'Eliminar Producto',
      `¿Estás seguro de que quieres eliminar "${item.name}"?`,
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
              await deleteItem(item.itemId).unwrap();
              Alert.alert('Éxito', 'Producto eliminado correctamente');
              refetch();
            } catch (error: any) {
              Alert.alert('Error', error?.data?.message || 'Error al eliminar el producto');
            }
          },
        },
      ]
    );
  };

  const openEditModal = (item: Item) => {
    setSelectedItem(item);
    setEditName(item.name);
    setEditDescription(item.description || '');
    setEditPrice(item.price.toString());
    setEditStock(item.stockQuantity.toString());
    setEditBrandId(item.brand?.brandId || '');
    setEditCategoryId(item.category?.categoryId || '');
    setShowEditModal(true);
  };

  const closeEditModal = () => {
    setShowEditModal(false);
    setSelectedItem(null);
    setEditName('');
    setEditDescription('');
    setEditPrice('');
    setEditStock('');
    setEditBrandId('');
    setEditCategoryId('');
  };

  const handleEditItem = async () => {
    if (!selectedItem) return;

    if (!editName.trim() || !editPrice.trim() || !editStock.trim()) {
      Alert.alert('Error', 'Nombre, precio y stock son obligatorios');
      return;
    }

    const price = parseFloat(editPrice);
    const stock = parseInt(editStock);

    if (isNaN(price) || price <= 0) {
      Alert.alert('Error', 'El precio debe ser un número positivo');
      return;
    }

    if (isNaN(stock) || stock < 0) {
      Alert.alert('Error', 'El stock debe ser un número no negativo');
      return;
    }

    try {
      await updateItem({
        itemId: selectedItem.itemId,
        item: {
          name: editName.trim(),
          description: editDescription.trim(),
          price: price,
          stock: stock,
          brandId: editBrandId || undefined,
          categoryId: editCategoryId || undefined,
        },
      }).unwrap();

      Alert.alert('Éxito', 'Producto actualizado correctamente');
      closeEditModal();
      refetch();
    } catch (error: any) {
      Alert.alert('Error', error?.data?.message || 'Error al actualizar el producto');
    }
  };

  const renderItem = ({ item }: { item: Item }) => {
    // Replace localhost URLs with configured server URL for mobile compatibility
    const processedImgUrl = item.imgUrl ? item.imgUrl.replace('http://localhost:9090/api/v1.0', API_CONFIG.BASE_URL) : null;
    console.log('Rendering item:', item.name, 'original imgUrl:', item.imgUrl, 'processed:', processedImgUrl);

    return (
      <View style={styles.itemCard}>
        {processedImgUrl ? (
          <Image
            source={{ uri: processedImgUrl }}
            style={styles.itemImage}
            onError={(error) => console.log('Image load error for', item.name, ':', error.nativeEvent)}
            onLoad={() => console.log('Image loaded successfully for', item.name)}
          />
        ) : (
          <View style={[styles.itemImage, styles.placeholderImage]}>
            <MaterialIcons name="image" size={32} color="#ccc" />
          </View>
        )}
        <View style={styles.itemInfo}>
          <Text style={styles.itemName}>{item.name}</Text>
          <Text style={styles.itemDescription}>{item.description}</Text>
          <Text style={styles.itemPrice}>${item.price.toFixed(2)}</Text>
          <Text style={styles.itemStock}>Stock: {item.stockQuantity}</Text>
          {item.brand && (
            <Text style={styles.itemBrand}>Marca: {item.brand.name}</Text>
          )}
          {item.category && (
            <Text style={styles.itemCategory}>Categoría: {item.category.name}</Text>
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
          {item.canDelete ? (
            <TouchableOpacity
              onPress={() => handleDeleteItem(item)}
              style={styles.deleteButton}
              disabled={isDeleting}
            >
              <MaterialIcons name="delete" size={24} color="#dc3545" />
            </TouchableOpacity>
          ) : (
            <View style={styles.disabledButton}>
              <MaterialIcons name="delete" size={24} color="#ccc" />
            </View>
          )}
        </View>
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.scrollContainer}>
        <View style={styles.content}>
          {/* Formulario para crear producto */}
          <View style={styles.formContainer}>
            <Text style={styles.sectionTitle}>Crear Nuevo Producto</Text>

            <TextInput
              style={styles.input}
              placeholder="Nombre del producto"
              value={itemName}
              onChangeText={setItemName}
              placeholderTextColor="#666"
            />

            <TextInput
              style={[styles.input, styles.textArea]}
              placeholder="Descripción (opcional)"
              value={itemDescription}
              onChangeText={setItemDescription}
              multiline
              numberOfLines={3}
              placeholderTextColor="#666"
            />

            <TextInput
              style={styles.input}
              placeholder="Precio"
              value={itemPrice}
              onChangeText={setItemPrice}
              keyboardType="numeric"
              placeholderTextColor="#666"
            />

            <TextInput
              style={styles.input}
              placeholder="Stock"
              value={itemStock}
              onChangeText={setItemStock}
              keyboardType="numeric"
              placeholderTextColor="#666"
            />

            {/* Image picker */}
            <Text style={styles.sectionSubtitle}>Imagen del Producto</Text>
            <View style={styles.imagePickerContainer}>
              <TouchableOpacity
                style={styles.imagePickerButton}
                onPress={showImagePickerOptions}
              >
                <MaterialIcons name="add-photo-alternate" size={24} color="#dc3545" />
                <Text style={styles.imagePickerText}>
                  {selectedImage ? 'Cambiar Imagen' : 'Seleccionar Imagen'}
                </Text>
              </TouchableOpacity>

              {selectedImage && (
                <View style={styles.imagePreviewContainer}>
                  <Image source={{ uri: selectedImage.uri }} style={styles.imagePreview} />
                  <TouchableOpacity
                    style={styles.removeImageButton}
                    onPress={() => setSelectedImage(null)}
                  >
                    <MaterialIcons name="close" size={20} color="#fff" />
                  </TouchableOpacity>
                </View>
              )}
            </View>

            {/* Brand and Category selection */}
            <Text style={styles.sectionSubtitle}>Marca y Categoría</Text>

            <View style={styles.pickerContainer}>
              <Text style={styles.pickerLabel}>Seleccionar Marca:</Text>
              <View style={styles.pickerWrapper}>
                <Picker
                  selectedValue={selectedBrand}
                  onValueChange={(itemValue) => setSelectedBrand(itemValue)}
                  style={styles.picker}
                >
                  <Picker.Item label="Seleccionar marca..." value="" />
                  {brands?.map((brand) => (
                    <Picker.Item key={brand.brandId} label={brand.name} value={brand.brandId} />
                  ))}
                </Picker>
              </View>
            </View>

            <View style={styles.pickerContainer}>
              <Text style={styles.pickerLabel}>Seleccionar Categoría:</Text>
              <View style={styles.pickerWrapper}>
                <Picker
                  selectedValue={selectedCategory}
                  onValueChange={(itemValue) => setSelectedCategory(itemValue)}
                  style={styles.picker}
                >
                  <Picker.Item label="Seleccionar categoría..." value="" />
                  {categories?.map((category) => (
                    <Picker.Item key={category.categoryId} label={category.name} value={category.categoryId} />
                  ))}
                </Picker>
              </View>
            </View>

            <TouchableOpacity
              style={[styles.createButton, isCreating && styles.buttonDisabled]}
              onPress={handleCreateItem}
              disabled={isCreating}
            >
              {isCreating ? (
                <ActivityIndicator color="#fff" />
              ) : (
                <>
                  <MaterialIcons name="add" size={20} color="#fff" />
                  <Text style={styles.createButtonText}>Crear Producto</Text>
                </>
              )}
            </TouchableOpacity>
          </View>

          {/* Lista de productos existentes */}
          <View style={styles.listContainer}>
            <Text style={styles.sectionTitle}>Productos Existentes</Text>

            {isLoading ? (
              <ActivityIndicator size="large" color="#dc3545" />
            ) : items && items.length > 0 ? (
              <FlatList
                data={items}
                keyExtractor={(item) => item.itemId}
                renderItem={renderItem}
                scrollEnabled={false}
              />
            ) : (
              <View style={styles.emptyContainer}>
                <MaterialIcons name="inventory" size={64} color="#ccc" />
                <Text style={styles.emptyText}>No hay productos registrados</Text>
              </View>
            )}
          </View>
        </View>
      </ScrollView>

      {/* Edit Item Modal */}
      <Modal
        visible={showEditModal}
        transparent={true}
        animationType="fade"
        onRequestClose={closeEditModal}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Editar Producto</Text>
              <TouchableOpacity onPress={closeEditModal}>
                <MaterialIcons name="close" size={24} color="#666" />
              </TouchableOpacity>
            </View>

            <ScrollView style={styles.modalBody}>
              <TextInput
                style={styles.modalInput}
                placeholder="Nombre del producto"
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

              <TextInput
                style={styles.modalInput}
                placeholder="Precio"
                value={editPrice}
                onChangeText={setEditPrice}
                keyboardType="numeric"
                placeholderTextColor="#666"
              />

              <TextInput
                style={styles.modalInput}
                placeholder="Stock"
                value={editStock}
                onChangeText={setEditStock}
                keyboardType="numeric"
                placeholderTextColor="#666"
              />

              <View style={styles.modalPickerContainer}>
                <Text style={styles.modalPickerLabel}>Marca:</Text>
                <View style={styles.modalPickerWrapper}>
                  <Picker
                    selectedValue={editBrandId}
                    onValueChange={(itemValue) => setEditBrandId(itemValue)}
                    style={styles.modalPicker}
                  >
                    <Picker.Item label="Seleccionar marca..." value="" />
                    {brands?.map((brand) => (
                      <Picker.Item key={brand.brandId} label={brand.name} value={brand.brandId} />
                    ))}
                  </Picker>
                </View>
              </View>

              <View style={styles.modalPickerContainer}>
                <Text style={styles.modalPickerLabel}>Categoría:</Text>
                <View style={styles.modalPickerWrapper}>
                  <Picker
                    selectedValue={editCategoryId}
                    onValueChange={(itemValue) => setEditCategoryId(itemValue)}
                    style={styles.modalPicker}
                  >
                    <Picker.Item label="Seleccionar categoría..." value="" />
                    {categories?.map((category) => (
                      <Picker.Item key={category.categoryId} label={category.name} value={category.categoryId} />
                    ))}
                  </Picker>
                </View>
              </View>
            </ScrollView>

            <View style={styles.modalFooter}>
              <TouchableOpacity
                style={[styles.modalButton, styles.cancelButton]}
                onPress={closeEditModal}
              >
                <Text style={styles.cancelButtonText}>Cancelar</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.modalButton, styles.updateButton, isUpdating && styles.buttonDisabled]}
                onPress={handleEditItem}
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
  scrollContainer: {
    flex: 1,
  },
  content: {
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
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#dc3545',
    marginBottom: 16,
  },
  sectionSubtitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginTop: 8,
    marginBottom: 8,
  },
  imagePickerContainer: {
    marginBottom: 16,
  },
  imagePickerButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#f8f9fa',
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 12,
    borderStyle: 'dashed',
  },
  imagePickerText: {
    marginLeft: 8,
    fontSize: 16,
    color: '#dc3545',
    fontWeight: '500',
  },
  imagePreviewContainer: {
    position: 'relative',
    marginTop: 12,
    alignSelf: 'center',
  },
  imagePreview: {
    width: 120,
    height: 120,
    borderRadius: 8,
    borderWidth: 2,
    borderColor: '#dc3545',
  },
  removeImageButton: {
    position: 'absolute',
    top: -8,
    right: -8,
    backgroundColor: '#dc3545',
    borderRadius: 12,
    width: 24,
    height: 24,
    alignItems: 'center',
    justifyContent: 'center',
  },
  pickerContainer: {
    marginBottom: 16,
  },
  pickerLabel: {
    fontSize: 16,
    fontWeight: '500',
    color: '#333',
    marginBottom: 8,
  },
  pickerWrapper: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    backgroundColor: '#f8f9fa',
    overflow: 'hidden',
  },
  picker: {
    height: 50,
    color: '#333',
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
  noteText: {
    fontSize: 12,
    color: '#6c757d',
    marginBottom: 12,
    fontStyle: 'italic',
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
  itemCard: {
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
  itemImage: {
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
  itemInfo: {
    flex: 1,
  },
  itemName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 4,
  },
  itemDescription: {
    fontSize: 14,
    color: '#666',
    marginBottom: 4,
  },
  itemPrice: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#28a745',
    marginBottom: 2,
  },
  itemStock: {
    fontSize: 14,
    color: '#6c757d',
  },
  itemBrand: {
    fontSize: 12,
    color: '#007bff',
    fontStyle: 'italic',
  },
  itemCategory: {
    fontSize: 12,
    color: '#28a745',
    fontStyle: 'italic',
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
  disabledButton: {
    padding: 8,
    opacity: 0.5,
  },
  emptyContainer: {
    alignItems: 'center',
    padding: 32,
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
    maxHeight: '80%',
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
  modalPickerContainer: {
    marginBottom: 12,
  },
  modalPickerLabel: {
    fontSize: 14,
    fontWeight: '500',
    color: '#333',
    marginBottom: 4,
  },
  modalPickerWrapper: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 6,
    backgroundColor: '#f8f9fa',
    overflow: 'hidden',
  },
  modalPicker: {
    height: 40,
    color: '#333',
    fontSize: 14,
  },
});

export default ManageItemsScreen;