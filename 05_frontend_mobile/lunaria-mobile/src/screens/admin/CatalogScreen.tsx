import React, { useState, useMemo } from 'react';
import {
  View,
  StyleSheet,
  Alert,
  TextInput,
  TouchableOpacity,
  Text,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MaterialIcons } from '@expo/vector-icons';

import { useGetItemsQuery, useGetCategoriesQuery } from '../../api/itemsApi';
import { useCreateSaleMutation } from '../../api/salesApi';
import { Item, Category, CartItem } from '../../types/api';

import CustomerForm from '../../components/CustomerForm';
import CategoryDropdown from '../../components/CategoryDropdown';
import ItemsList from '../../components/ItemsList';
import ReceiptPopup from '../../components/ReceiptPopup';

const CatalogScreen = () => {
  const [customerName, setCustomerName] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');
  const [selectedCategoryId, setSelectedCategoryId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [showReceipt, setShowReceipt] = useState(false);
  const [lastSale, setLastSale] = useState<any>(null);

  // API calls
  const { data: items = [], isLoading: itemsLoading, refetch: refetchItems } = useGetItemsQuery();
  const { data: categories = [] } = useGetCategoriesQuery();
  const [createSale] = useCreateSaleMutation();

  // Ensure arrays are defined
  const safeItems = items || [];
  const safeCategories = categories || [];

  // Filter items based on selected category and search query
  const filteredItems = useMemo(() => {
    if (!safeItems || safeItems.length === 0) return [];
    
    let filtered = safeItems;
    
    // Filter by category
    if (selectedCategoryId) {
      filtered = filtered.filter(item => item.category?.categoryId === selectedCategoryId);
    }
    
    // Filter by search query
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase().trim();
      filtered = filtered.filter(item => 
        item.name?.toLowerCase().includes(query) ||
        item.brand?.name?.toLowerCase().includes(query) ||
        item.category?.name?.toLowerCase().includes(query)
      );
    }
    
    return filtered;
  }, [safeItems, selectedCategoryId, searchQuery]);

  const handleClearFilters = () => {
    setSearchQuery('');
    setSelectedCategoryId(null);
  };

  const handleItemPress = (item: Item) => {
    // Add item to cart or show quantity selector
    const existingItem = cartItems.find(cartItem => cartItem.itemId === item.itemId);
    if (existingItem) {
      // Increase quantity
      setCartItems(cartItems.map(cartItem =>
        cartItem.itemId === item.itemId
          ? { ...cartItem, quantity: cartItem.quantity + 1 }
          : cartItem
      ));
    } else {
      // Add new item
      const cartItem: CartItem = {
        itemId: item.itemId,
        name: item.name,
        price: item.price,
        quantity: 1,
        imgUrl: item.imgUrl,
      };
      setCartItems([...cartItems, cartItem]);
    }
    Alert.alert('Producto agregado', `${item.name} agregado al carrito`);
  };

  const handleUpdateCartQuantity = (itemId: string, newQuantity: number) => {
    if (newQuantity <= 0) {
      // Remove item if quantity is 0 or less
      setCartItems(cartItems.filter(item => item.itemId !== itemId));
    } else {
      setCartItems(cartItems.map(item =>
        item.itemId === itemId
          ? { ...item, quantity: newQuantity }
          : item
      ));
    }
  };

  const handleRemoveFromCart = (itemId: string) => {
    setCartItems(cartItems.filter(item => item.itemId !== itemId));
    Alert.alert('Producto removido', 'El producto ha sido removido del carrito');
  };

  const handlePaymentPress = async () => {
    if (cartItems.length === 0) {
      Alert.alert('Error', 'No hay productos en el carrito');
      return;
    }

    try {
      // Calculate subtotal and grandTotal
      const subtotal = cartItems.reduce((sum, item) => sum + (item.price * (item.quantity || 1)), 0);
      const grandTotal = subtotal; // No tax for now

      const saleData = {
        customerName,
        phoneNumber: customerPhone,
        subtotal,
        grandTotal,
        cartItems: cartItems.map(item => ({
          itemId: item.itemId,
          name: item.name,
          quantity: item.quantity || 1,
          price: item.price,
        })),
        paymentMethod: 'CASH' as const, // Default payment method
      };

      const response = await createSale(saleData as any).unwrap();
      setLastSale(response);
      setCartItems([]); // Clear cart
      setShowReceipt(true);
      
      // Refetch items to update stock
      refetchItems();
    } catch (error) {
      Alert.alert('Error', 'No se pudo procesar la venta');
      console.error('Sale creation error:', error);
    }
  };

  const handleReceiptPress = () => {
    setShowReceipt(true);
  };

  const handleCloseReceipt = () => {
    setShowReceipt(false);
    setLastSale(null);
  };

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView 
        style={styles.container}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <ScrollView style={styles.scrollView} contentContainerStyle={styles.scrollContent}>
        {/* Customer Form */}
        <CustomerForm
          customerName={customerName}
          customerPhone={customerPhone}
          cartItems={cartItems}
          onNameChange={setCustomerName}
          onPhoneChange={setCustomerPhone}
          onUpdateCartQuantity={handleUpdateCartQuantity}
          onRemoveFromCart={handleRemoveFromCart}
          onPaymentPress={handlePaymentPress}
          onReceiptPress={handleReceiptPress}
          showReceiptButton={!!lastSale}
        />

        {/* Search and Filter */}
        <View style={styles.searchContainer}>
          <View style={styles.searchInputContainer}>
            <MaterialIcons name="search" size={20} color="#666" style={styles.searchIcon} />
            <TextInput
              style={styles.searchInput}
              placeholder="Buscar productos..."
              placeholderTextColor="#999"
              value={searchQuery}
              onChangeText={setSearchQuery}
            />
            {searchQuery.length > 0 && (
              <TouchableOpacity onPress={() => setSearchQuery('')}>
                <MaterialIcons name="close" size={20} color="#666" />
              </TouchableOpacity>
            )}
          </View>
          <TouchableOpacity style={styles.clearButton} onPress={handleClearFilters}>
            <Text style={styles.clearButtonText}>Limpiar</Text>
          </TouchableOpacity>
        </View>

        {/* Category Filter */}
        <CategoryDropdown
          categories={safeCategories}
          selectedCategoryId={selectedCategoryId}
          onCategorySelect={setSelectedCategoryId}
        />

        {/* Items List */}
        <ItemsList
          items={filteredItems || []}
          onItemPress={handleItemPress}
        />
        </ScrollView>

      {/* Receipt Modal */}
      <ReceiptPopup
        visible={showReceipt && !!lastSale}
        orderDetails={lastSale || {} as any}
        onClose={handleCloseReceipt}
        onPrint={() => Alert.alert('Imprimir', 'Funcionalidad de impresión')}
      />
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 20,
  },
  content: {
    flex: 1,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 8,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  searchInputContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f0f0f0',
    borderRadius: 8,
    paddingHorizontal: 10,
    height: 40,
  },
  searchIcon: {
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    color: '#333',
  },
  clearButton: {
    marginLeft: 10,
    paddingHorizontal: 12,
    paddingVertical: 8,
    backgroundColor: '#dc3545',
    borderRadius: 6,
  },
  clearButtonText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 14,
  },
});

export default CatalogScreen;