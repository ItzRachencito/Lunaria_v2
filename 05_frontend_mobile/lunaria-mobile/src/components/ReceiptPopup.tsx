import React from 'react';
import {
  View,
  Text,
  Modal,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  Alert,
} from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';

interface SaleItem {
  itemId: string;
  name: string;
  price: number;
  quantity: number;
}

interface OrderDetails {
  saleId: string;
  customerName: string;
  phoneNumber: string;
  items: SaleItem[];
  subtotal: number;
  grandTotal: number;
  paymentMethod: string;
  createdAt: string;
}

interface ReceiptPopupProps {
  visible: boolean;
  orderDetails: OrderDetails;
  onClose: () => void;
  onPrint: () => void;
}

const ReceiptPopup: React.FC<ReceiptPopupProps> = ({
  visible,
  orderDetails,
  onClose,
  onPrint,
}) => {
  const handlePrint = () => {
    Alert.alert(
      'Imprimir Comprobante',
      '¿Desea imprimir el comprobante?',
      [
        { text: 'Cancelar', style: 'cancel' },
        { text: 'Imprimir', onPress: onPrint },
      ]
    );
  };

  return (
    <Modal
      visible={visible}
      transparent={true}
      animationType="fade"
      onRequestClose={onClose}
    >
      <View style={styles.overlay}>
        <View style={styles.container}>
          {/* Header */}
          <View style={styles.header}>
            <MaterialIcons name="check-circle" size={48} color="#28a745" />
            <Text style={styles.title}>Comprobante de Venta</Text>
          </View>

          {/* Sale Details */}
          <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
            <View style={styles.detailRow}>
              <Text style={styles.label}>ID de Venta:</Text>
              <Text style={styles.value}>{orderDetails.saleId}</Text>
            </View>

            <View style={styles.detailRow}>
              <Text style={styles.label}>Cliente:</Text>
              <Text style={styles.value}>{orderDetails.customerName}</Text>
            </View>

            <View style={styles.detailRow}>
              <Text style={styles.label}>Teléfono:</Text>
              <Text style={styles.value}>{orderDetails.phoneNumber}</Text>
            </View>

            <View style={styles.divider} />

            <Text style={styles.sectionTitle}>Productos</Text>

            {orderDetails.items.map((item, index) => (
              <View key={index} style={styles.itemRow}>
                <Text style={styles.itemName}>{item.name}</Text>
                <Text style={styles.itemQuantity}>x{item.quantity}</Text>
                <Text style={styles.itemPrice}>${(item.price * item.quantity).toFixed(2)}</Text>
              </View>
            ))}

            <View style={styles.divider} />

            <View style={styles.totalRow}>
              <Text style={styles.totalLabel}>Subtotal:</Text>
              <Text style={styles.totalValue}>${orderDetails.subtotal.toFixed(2)}</Text>
            </View>

            <View style={styles.totalRow}>
              <Text style={styles.grandTotalLabel}>Total:</Text>
              <Text style={styles.grandTotalValue}>${orderDetails.grandTotal.toFixed(2)}</Text>
            </View>

            <View style={styles.detailRow}>
              <Text style={styles.label}>Método de Pago:</Text>
              <Text style={styles.value}>
                {orderDetails.paymentMethod === 'CASH' ? 'Efectivo' : orderDetails.paymentMethod}
              </Text>
            </View>
          </ScrollView>

          {/* Buttons */}
          <View style={styles.buttonContainer}>
            <TouchableOpacity
              style={[styles.button, styles.printButton]}
              onPress={handlePrint}
            >
              <MaterialIcons name="print" size={20} color="#fff" />
              <Text style={styles.buttonText}>Imprimir</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.button, styles.closeButton]}
              onPress={onClose}
            >
              <MaterialIcons name="close" size={20} color="#fff" />
              <Text style={styles.buttonText}>Cerrar</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  container: {
    backgroundColor: '#fff',
    borderRadius: 20,
    width: '100%',
    maxHeight: '80%',
    elevation: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.3,
    shadowRadius: 10,
  },
  header: {
    alignItems: 'center',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    marginTop: 10,
  },
  content: {
    padding: 20,
    maxHeight: 300,
  },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  label: {
    fontSize: 14,
    color: '#666',
    fontWeight: '500',
  },
  value: {
    fontSize: 14,
    color: '#333',
    fontWeight: 'bold',
  },
  divider: {
    height: 1,
    backgroundColor: '#eee',
    marginVertical: 15,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 10,
  },
  itemRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 5,
  },
  itemName: {
    flex: 1,
    fontSize: 14,
    color: '#333',
  },
  itemQuantity: {
    fontSize: 12,
    color: '#666',
    marginHorizontal: 8,
  },
  itemPrice: {
    fontSize: 14,
    color: '#333',
    fontWeight: '500',
  },
  totalRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 5,
  },
  totalLabel: {
    fontSize: 14,
    color: '#666',
  },
  totalValue: {
    fontSize: 14,
    color: '#333',
    fontWeight: '500',
  },
  grandTotalLabel: {
    fontSize: 16,
    color: '#333',
    fontWeight: 'bold',
  },
  grandTotalValue: {
    fontSize: 16,
    color: '#28a745',
    fontWeight: 'bold',
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 20,
    borderTopWidth: 1,
    borderTopColor: '#eee',
  },
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 8,
    flex: 1,
    marginHorizontal: 5,
  },
  printButton: {
    backgroundColor: '#ffc107',
  },
  closeButton: {
    backgroundColor: '#dc3545',
  },
  buttonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: 'bold',
    marginLeft: 8,
  },
});

export default ReceiptPopup;