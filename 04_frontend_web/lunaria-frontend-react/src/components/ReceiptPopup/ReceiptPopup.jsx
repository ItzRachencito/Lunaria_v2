import './ReceiptPopup.css';
import './Print.css';

const ReceiptPopup = ({orderDetails, onClose, onPrint}) => {
    return (
        <div className="receipt-popup-overlay text-dark">
            <div className="receipt-popup">
                <div className="text-center mb-4">
                    <i className="bi bi-check-circle-fill text-success fs-1"></i>
                </div>
                <h3 className="text-center mb-4">Comprobante de venta</h3>
                <p>
                    <strong>Id de venta:</strong> {orderDetails.saleId}
                </p>
                <p>
                    <strong>Nombre:</strong> {orderDetails.customerName}
                </p>
                <p>
                    <strong>Teléfono:</strong> {orderDetails.phoneNumber}
                </p>
                <hr className="my-3" />
                <h5 className="mb-3">Productos Ordenados</h5>
                <div className="cart-items-scrollable">
                    {orderDetails.items.map((item, index) => (
                        <div key={index} className="d-flex justify-content-between mb-2">
                            <span>{item.name} x{item.quantity}</span>
                            <span>${(item.price * item.quantity).toFixed(2)}</span>
                        </div>
                    ))}
                </div>
                <hr className="my-3" />
                <div className="d-flex justify-content-between mb-2">
                    <span>
                        <strong>Subtotal:</strong>
                    </span>
                    <span>${orderDetails.subtotal.toFixed(2)}</span>
                </div>
                <div className="d-flex justify-content-between mb-2">
                    <span>
                        <strong>Iva (19%):</strong>
                    </span>
                    <span>${orderDetails.tax.toFixed(2)}</span>
                </div>
                <div className="d-flex justify-content-between mb-4">
                    <span>
                        <strong>Total:</strong>
                    </span>
                    <span>${orderDetails.grandTotal.toFixed(2)}</span>
                </div>
                <p>
                    <strong>Método de pago: </strong> {orderDetails.paymentMethod}
                </p>
                {
                    orderDetails.paymentMethod === "UPI" && (
                        <>
                            <p>
                                <strong>Razorpay Order ID: </strong> {orderDetails.razorpayOrderId}
                            </p>
                            <p>
                                <strong>Razorpay Payment ID: </strong> {orderDetails.razorpayPaymentId}
                            </p>
                        </>
                    )
                }
                <div className="d-flex justify-content-end gap-3 mt-4">
                    <button className="btn btn-warning" onClick={onPrint}>Imprimir Comprobante</button>
                    <button className="btn btn-danger" onClick={onClose}>Cerrar</button>
                </div>
            </div>
        </div>
    )
}

export default ReceiptPopup;