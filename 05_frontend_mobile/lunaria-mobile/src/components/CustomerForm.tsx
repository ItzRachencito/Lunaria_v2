import React, { useState, useMemo } from 'react';
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
  // Ensure cartItems is an array
  const safeCartItems = cartItems || [];
  
  // Calculate total
  const total = safeCartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  
  // Collapsible state
  const [isExpanded, setIsExpanded] = useState(true);
  
  // Count total items in cart
  const totalItems = useMemo(() => 
    safeCartItems.reduce((sum, item) => sum + item.quantity, 0), 
    [safeCartItems]
  );
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
      {/* Collapsible Header */}
      <TouchableOpacity 
        style={styles.header} 
        onPress={() => setIsExpanded(!isExpanded)}
        activeOpacity={0.7}
      >
        <View style={styles.headerContent}>
          <MaterialIcons 
            name={isExpanded ? 'keyboard-arrow-up' : 'keyboard-arrow-down'} 
            size={24} 
            color="#333" 
          />
          <Text style={styles.headerTitle}>Datos del Cliente</Text>
          {totalItems > 0 && (
            <View style={styles.cartBadge}>
              <Text style={styles.cartBadgeText}>{totalItems}</Text>
            </View>
          )}
          <Text style={styles.headerTotal}>${total.toFixed(2)}</Text>
        </View>
      </TouchableOpacity>
      
      {/* Expanded Content */}
      {isExpanded && (
        <>

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
        {safeCartItems.length === 0 ? (
          <Text style={styles.emptyCartText}>El carrito está vacío</Text>
        ) : (
          <View style={styles.cartItemsContainer}>
            {safeCartItems.slice(0, 3).map((item, index) => (
              <CartItem
                key={`${item.itemId}-${index}`}
                item={item}
                onUpdateQuantity={onUpdateCartQuantity}
                onRemove={onRemoveFromCart}
              />
            ))}
            {safeCartItems.length > 3 && (
              <Text style={styles.moreItemsText}>
                +{safeCartItems.length - 3} productos más...
              </Text>
            )}
            {/* Total */}
            <View style={styles.totalContainer}>
              <Text style={styles.totalLabel}>Total:</Text>
              <Text style={styles.totalValue}>${total.toFixed(2)}</Text>
            </View>
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
        </>
      )}
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
  header: {
    marginBottom: 12,
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  headerContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    flex: 1,
    marginLeft: 8,
  },
  headerTotal: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#27ae60',
  },
  cartBadge: {
    backgroundColor: '#e74c3c',
    borderRadius: 10,
    minWidth: 20,
    height: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 8,
    paddingHorizontal: 6,
  },
  cartBadgeText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: 'bold',
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
  totalContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 12,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: '#ddd',
  },
  totalLabel: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
  totalValue: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#28a745',
  },
});

export default CustomerForm;