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
} from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { useDispatch } from 'react-redux';
import { useGetBrandsQuery, useCreateBrandMutation, useDeleteBrandMutation, useUpdateBrandMutation } from '../../api/brandsApi';
import { Brand } from '../../types/api';

const ManageBrandsScreen = () => {
  const [brandName, setBrandName] = useState('');
  const [brandDescription, setBrandDescription] = useState('');
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedBrand, setSelectedBrand] = useState<Brand | null>(null);
  const [editName, setEditName] = useState('');
  const [editDescription, setEditDescription] = useState('');

  const dispatch = useDispatch();
  const { data: brands, isLoading, error, refetch } = useGetBrandsQuery();
  const [createBrand, { isLoading: isCreating }] = useCreateBrandMutation();
  const [updateBrand, { isLoading: isUpdating }] = useUpdateBrandMutation();
  const [deleteBrand, { isLoading: isDeleting }] = useDeleteBrandMutation();

  console.log('ManageBrandsScreen - Brands:', brands);
  console.log('ManageBrandsScreen - Loading:', isLoading);
  console.log('ManageBrandsScreen - Error:', error);

  const handleCreateBrand = async () => {
    if (!brandName.trim()) {
      Alert.alert('Error', 'El nombre de la marca es obligatorio');
      return;
    }

    try {
      await createBrand({
        name: brandName.trim(),
        description: brandDescription.trim(),
      }).unwrap();

      Alert.alert('Éxito', 'Marca creada correctamente');
      setBrandName('');
      setBrandDescription('');
      refetch();
    } catch (error: any) {
      Alert.alert('Error', error?.data?.message || 'Error al crear la marca');
    }
  };

  const handleDeleteBrand = (brand: Brand) => {
    Alert.alert(
      'Eliminar Marca',
      `¿Estás seguro de que quieres eliminar "${brand.name}"?`,
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Eliminar',
          style: 'destructive',
          onPress: async () => {
            try {
              await deleteBrand(brand.brandId).unwrap();
              Alert.alert('Éxito', 'Marca eliminada correctamente');
              refetch();
            } catch (error: any) {
              Alert.alert('Error', error?.data?.message || 'Error al eliminar la marca');
            }
          },
        },
      ]
    );
  };

  const openEditModal = (brand: Brand) => {
    setSelectedBrand(brand);
    setEditName(brand.name);
    setEditDescription(brand.description || '');
    setShowEditModal(true);
  };

  const closeEditModal = () => {
    setShowEditModal(false);
    setSelectedBrand(null);
    setEditName('');
    setEditDescription('');
  };

  const handleEditBrand = async () => {
    if (!selectedBrand) return;

    if (!editName.trim()) {
      Alert.alert('Error', 'El nombre de la marca es obligatorio');
      return;
    }

    try {
      await updateBrand({
        brandId: selectedBrand.brandId,
        brand: {
          name: editName.trim(),
          description: editDescription.trim(),
        },
      }).unwrap();

      Alert.alert('Éxito', 'Marca actualizada correctamente');
      closeEditModal();
      refetch();
    } catch (error: any) {
      Alert.alert('Error', error?.data?.message || 'Error al actualizar la marca');
    }
  };

  const renderBrandItem = ({ item }: { item: Brand }) => (
    <View style={styles.brandItem}>
      <View style={styles.brandInfo}>
        <Text style={styles.brandName}>{item.name}</Text>
        {item.description && (
          <Text style={styles.brandDescription}>{item.description}</Text>
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
          onPress={() => handleDeleteBrand(item)}
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
      <View style={styles.content}>
        {/* Formulario para crear marca */}
        <View style={styles.formContainer}>
          <Text style={styles.sectionTitle}>Crear Nueva Marca</Text>

          <TextInput
            style={styles.input}
            placeholder="Nombre de la marca"
            value={brandName}
            onChangeText={setBrandName}
            placeholderTextColor="#666"
          />

          <TextInput
            style={[styles.input, styles.textArea]}
            placeholder="Descripción (opcional)"
            value={brandDescription}
            onChangeText={setBrandDescription}
            multiline
            numberOfLines={3}
            placeholderTextColor="#666"
          />

          <TouchableOpacity
            style={[styles.createButton, isCreating && styles.buttonDisabled]}
            onPress={handleCreateBrand}
            disabled={isCreating}
          >
            {isCreating ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <>
                <MaterialIcons name="add" size={20} color="#fff" />
                <Text style={styles.createButtonText}>Crear Marca</Text>
              </>
            )}
          </TouchableOpacity>
        </View>

        {/* Lista de marcas existentes */}
        <View style={styles.listContainer}>
          <Text style={styles.sectionTitle}>Marcas Existentes</Text>

          {isLoading ? (
            <ActivityIndicator size="large" color="#dc3545" />
          ) : brands && brands.length > 0 ? (
            <FlatList
              data={brands}
              keyExtractor={(item) => item.brandId}
              renderItem={renderBrandItem}
              showsVerticalScrollIndicator={false}
            />
          ) : (
            <View style={styles.emptyContainer}>
              <MaterialIcons name="business" size={64} color="#ccc" />
              <Text style={styles.emptyText}>No hay marcas registradas</Text>
            </View>
          )}
        </View>
      </View>

      {/* Edit Brand Modal */}
      <Modal
        visible={showEditModal}
        transparent={true}
        animationType="fade"
        onRequestClose={closeEditModal}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Editar Marca</Text>
              <TouchableOpacity onPress={closeEditModal}>
                <MaterialIcons name="close" size={24} color="#666" />
              </TouchableOpacity>
            </View>

            <View style={styles.modalBody}>
              <TextInput
                style={styles.modalInput}
                placeholder="Nombre de la marca"
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
                onPress={handleEditBrand}
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
  brandItem: {
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
  brandInfo: {
    flex: 1,
  },
  brandName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 4,
  },
  brandDescription: {
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
});

export default ManageBrandsScreen;