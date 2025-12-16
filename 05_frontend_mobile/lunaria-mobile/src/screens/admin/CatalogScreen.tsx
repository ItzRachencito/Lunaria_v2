import React, { useState, useMemo } from 'react';
import {
  View,
  ScrollView,
  StyleSheet,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

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
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [showReceipt, setShowReceipt] = useState(false);
  const [lastSale, setLastSale] = useState<any>(null);

  // API calls
  const { data: items = [], isLoading: itemsLoading } = useGetItemsQuery();
  const { data: categories = [] } = useGetCategoriesQuery();
  const [createSale] = useCreateSaleMutation();

  // Filter items based on selected category
  const filteredItems = useMemo(() => {
    if (!items || items.length === 0) return [];
    if (!selectedCategoryId) return items;
    return items.filter(item => item.category?.categoryId === selectedCategoryId);
  }, [items, selectedCategoryId]);

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
      <View style={styles.content}>
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

        {/* Category Filter */}
        <CategoryDropdown
          categories={categories}
          selectedCategoryId={selectedCategoryId}
          onCategorySelect={setSelectedCategoryId}
        />

        {/* Items List */}
        <ItemsList
          items={filteredItems || []}
          onItemPress={handleItemPress}
        />
      </View>

      {/* Receipt Modal */}
      <ReceiptPopup
        visible={showReceipt && !!lastSale}
        orderDetails={lastSale || {} as any}
        onClose={handleCloseReceipt}
        onPrint={() => Alert.alert('Imprimir', 'Funcionalidad de impresión')}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  content: {
    flex: 1,
  },
});

export default CatalogScreen;