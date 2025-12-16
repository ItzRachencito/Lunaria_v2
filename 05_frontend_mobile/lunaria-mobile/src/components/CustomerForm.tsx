import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  ScrollView,
} from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import CartItem from './CartItem';

interface CartItem {
  itemId: string;
  name: string;
  quantity: number;
  price: number;
}

interface CustomerFormProps {
  customerName: string;
  customerPhone: string;
  cartItems: CartItem[];
  onNameChange: (name: string) => void;
  onPhoneChange: (phone: string) => void;
  onUpdateCartQuantity: (itemId: string, quantity: number) => void;
  onRemoveFromCart: (itemId: string) => void;
  onPaymentPress: () => void;
  onReceiptPress: () => void;
  showReceiptButton: boolean;
}

const CustomerForm: React.FC<CustomerFormProps> = ({
  customerName,
  customerPhone,
  cartItems,
  onNameChange,
  onPhoneChange,
  onUpdateCartQuantity,
  onRemoveFromCart,
  onPaymentPress,
  onReceiptPress,
  showReceiptButton,
}) => {
  const validateForm = () => {
    if (!customerName.trim()) {
      Alert.alert('Error', 'Por favor ingrese el nombre del cliente');
      return false;
    }
    if (!customerPhone.trim()) {
      Alert.alert('Error', 'Por favor ingrese el teléfono del cliente');
      return false;
    }
    if (!/^\d{10}$/.test(customerPhone.trim())) {
      Alert.alert('Error', 'El teléfono debe tener 10 dígitos');
      return false;
    }
    return true;
  };

  const handlePaymentPress = () => {
    if (validateForm()) {
      onPaymentPress();
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Información del Cliente</Text>

      <View style={styles.inputContainer}>
        <MaterialIcons name="person" size={20} color="#666" style={styles.icon} />
        <TextInput
          style={styles.input}
          placeholder="Nombre del cliente"
          value={customerName}
          onChangeText={onNameChange}
          placeholderTextColor="#999"
        />
      </View>

      <View style={styles.inputContainer}>
        <MaterialIcons name="phone" size={20} color="#666" style={styles.icon} />
        <TextInput
          style={styles.input}
          placeholder="Teléfono (10 dígitos)"
          value={customerPhone}
          onChangeText={(text) => {
            // Only allow numbers and limit to 10 digits
            const cleaned = text.replace(/\D/g, '');
            if (cleaned.length <= 10) {
              onPhoneChange(cleaned);
            }
          }}
          keyboardType="numeric"
          maxLength={10}
          placeholderTextColor="#999"
        />
      </View>

      {/* Cart Status */}
      <View style={styles.cartContainer}>
        <Text style={styles.cartTitle}>Productos en el carrito:</Text>
        {cartItems.length === 0 ? (
          <Text style={styles.emptyCartText}>El carrito está vacío</Text>
        ) : (
          <View style={styles.cartItemsContainer}>
            {cartItems.slice(0, 3).map((item, index) => (
              <CartItem
                key={`${item.itemId}-${index}`}
                item={item}
                onUpdateQuantity={onUpdateCartQuantity}
                onRemove={onRemoveFromCart}
              />
            ))}
            {cartItems.length > 3 && (
              <Text style={styles.moreItemsText}>
                +{cartItems.length - 3} productos más...
              </Text>
            )}
          </View>
        )}
      </View>

      <View style={styles.buttonContainer}>
        <TouchableOpacity
          style={[styles.button, styles.paymentButton]}
          onPress={handlePaymentPress}
        >
          <MaterialIcons name="payment" size={20} color="#fff" />
          <Text style={styles.buttonText}>Recibir Pago</Text>
        </TouchableOpacity>

        {showReceiptButton && (
          <TouchableOpacity
            style={[styles.button, styles.receiptButton]}
            onPress={onReceiptPress}
          >
            <MaterialIcons name="receipt" size={20} color="#fff" />
            <Text style={styles.buttonText}>Ver Comprobante</Text>
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#fff',
    padding: 16,
    margin: 16,
    borderRadius: 12,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 16,
    textAlign: 'center',
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f8f9fa',
    borderRadius: 8,
    marginBottom: 12,
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  icon: {
    marginRight: 12,
  },
  input: {
    flex: 1,
    fontSize: 16,
    color: '#333',
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 16,
  },
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    flex: 1,
    marginHorizontal: 4,
  },
  paymentButton: {
    backgroundColor: '#28a745',
  },
  receiptButton: {
    backgroundColor: '#007bff',
  },
  buttonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: 'bold',
    marginLeft: 8,
  },
  cartContainer: {
    backgroundColor: '#f8f9fa',
    borderRadius: 8,
    padding: 12,
    marginBottom: 12,
  },
  emptyCartText: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
    fontStyle: 'italic',
  },
  cartTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 8,
  },
  cartItemsContainer: {
    maxHeight: 200,
  },
  moreItemsText: {
    textAlign: 'center',
    fontSize: 12,
    color: '#666',
    fontStyle: 'italic',
    marginTop: 8,
  },
});

export default CustomerForm;