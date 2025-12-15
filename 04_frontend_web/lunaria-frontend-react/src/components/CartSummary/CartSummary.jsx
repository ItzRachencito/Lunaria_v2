import './CartSummary.css';
import {useContext, useState} from "react";
import {AppContext} from "../../context/AppContext.jsx";
import ReceiptPopup from "../ReceiptPopup/ReceiptPopup.jsx";
import {createSale, deleteSale} from "../../Service/SaleService.js";
import toast from "react-hot-toast";

const CartSummary = ({customerName, mobileNumber, setMobileNumber, setCustomerName}) => {
    const {cartItems, clearCart, refreshItems} = useContext(AppContext);

    const [isProcessing, setIsProcessing] = useState(false);
    const [orderDetails, setOrderDetails] = useState(null);
    const [showPopup, setShowPopup] = useState(false);

    const subtotal = cartItems.reduce((total, item) => total + item.price * item.quantity, 0);
    const total = subtotal; // No tax, product price is final price

    const clearAll = () => {
        setCustomerName("");
        setMobileNumber("");
        clearCart();
    }

    const placeOrder = () => {
        setShowPopup(true);
        clearAll();
    }

    const handlePrintReceipt = () => {
        window.print();
    }


    const completePayment = async () => {
        if (!customerName || !mobileNumber) {
            toast.error("Por favor ingrese los datos del cliente");
            return;
        }

        if (cartItems.length === 0) {
            toast.error("El carrito está vacío");
            return;
        }

        const saleData = {
            customerName,
            phoneNumber: mobileNumber,
            cartItems,
            subtotal,
            grandTotal: total,
            paymentMethod: "CASH"
        };

        setIsProcessing(true);
        try {
            const response = await createSale(saleData);
            const savedData = response.data;

            if (response.status === 201) {
                toast.success("Venta registrada exitosamente");
                setOrderDetails(savedData);
                await refreshItems(); // Refresh items to show updated stock
            }
        } catch (error) {
            console.error(error);
            toast.error("Error al procesar la venta");
        } finally {
            setIsProcessing(false);
        }
    }


    return (
        <div className="mt-2">
            <div className="cart-summary-details">
                <div className="d-flex justify-content-between mb-2">
                    <span className="text-light">Subtotal: </span>
                    <span className="text-light">${subtotal.toFixed(2)}</span>
                </div>
                <div className="d-flex justify-content-between mb-4">
                    <span className="text-light">Total:</span>
                    <span className="text-light">${total.toFixed(2)}</span>
                </div>
            </div>

            <div className="d-flex gap-3">
                <button className="btn btn-success flex-grow-1"
                    onClick={completePayment}
                    disabled={isProcessing}
                >
                    {isProcessing ? "Procesando...": "Completar Venta"}
                </button>
            </div>
            <div className="d-flex gap-3 mt-3">
                <button className="btn btn-warning flex-grow-1"
                    onClick={placeOrder}
                    disabled={isProcessing || !orderDetails}
                >
                    Ver Detalle de Comprobante
                </button>
            </div>
            {
                showPopup && (
                    <ReceiptPopup
                        orderDetails={orderDetails}
                        onClose={() => setShowPopup(false)}
                        onPrint={handlePrintReceipt}
                    />
                )
            }
        </div>
    )
}

export default CartSummary;