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
} from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { useDispatch } from 'react-redux';
import { useGetItemsQuery, useCreateItemMutation, useDeleteItemMutation, useUpdateItemMutation } from '../../api/baseApi';
import { Item } from '../../types/api';

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

  const dispatch = useDispatch();
  const { data: items, isLoading, error, refetch } = useGetItemsQuery();
  const [createItem, { isLoading: isCreating }] = useCreateItemMutation();
  const [updateItem, { isLoading: isUpdating }] = useUpdateItemMutation();
  const [deleteItem, { isLoading: isDeleting }] = useDeleteItemMutation();

  console.log('ManageItemsScreen - Items:', items);
  console.log('ManageItemsScreen - Loading:', isLoading);
  console.log('ManageItemsScreen - Error:', error);

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
        brandId: selectedBrand || null,
        categoryId: selectedCategory || null,
      }).unwrap();

      Alert.alert('Éxito', 'Producto creado correctamente');
      setItemName('');
      setItemDescription('');
      setItemPrice('');
      setItemStock('');
      setSelectedBrand('');
      setSelectedCategory('');
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

  const renderItem = ({ item }: { item: Item }) => (
    <View style={styles.itemCard}>
      <View style={styles.itemInfo}>
        <Text style={styles.itemName}>{item.name}</Text>
        <Text style={styles.itemDescription}>{item.description}</Text>
        <Text style={styles.itemPrice}>${item.price.toFixed(2)}</Text>
        <Text style={styles.itemStock}>Stock: {item.stockQuantity}</Text>
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
          onPress={() => handleDeleteItem(item)}
          style={styles.deleteButton}
          disabled={isDeleting}
        >
          <MaterialIcons name="delete" size={24} color="#dc3545" />
        </TouchableOpacity>
      </View>
    </View>
  );

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

            {/* TODO: Add brand and category pickers */}
            <Text style={styles.noteText}>Nota: Selección de marca y categoría próximamente</Text>

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
});

export default ManageItemsScreen;