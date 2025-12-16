import './SaleHistory.css';
import {useEffect, useState} from "react";
import {latestSales} from "../../Service/SaleService.js";
import ReceiptPopup from "../../components/ReceiptPopup/ReceiptPopup.jsx";
import SearchBox from "../../components/SearchBox/SearchBox.jsx";

const SaleHistory = () => {
    const [sales, setSales] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showPopup, setShowPopup] = useState(false);
    const [selectedSale, setSelectedSale] = useState(null);
    const [searchText, setSearchText] = useState("");

    useEffect(() => {
        const fetchSales = async () => {
            try {
                const response = await latestSales();
                setSales(response.data);
            } catch (error) {
                console.log(error);
            } finally {
                setLoading(false);
            }
        }
        fetchSales();
    }, []);

    const formatDate = (dateString) => {
        const options = {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
        }
        return new Date(dateString).toLocaleDateString('en-US', options);
    }

    const handleViewReceipt = (sale) => {
        setSelectedSale(sale);
        setShowPopup(true);
    }

    const handleClosePopup = () => {
        setShowPopup(false);
        setSelectedSale(null);
    }

    const handlePrintReceipt = () => {
        window.print();
    }

    // Filter sales based on search text (customer name, phone number, or sale ID)
    const filteredSales = sales.filter(sale =>
        sale.customerName.toLowerCase().includes(searchText.toLowerCase()) ||
        sale.phoneNumber.toLowerCase().includes(searchText.toLowerCase()) ||
        sale.saleId.toLowerCase().includes(searchText.toLowerCase())
    );

    if (loading) {
        return <div className="text-center py-4">Buscando ventas...</div>
    }

    if (sales.length === 0) {
        return <div className="text-center py-4">No se encontraron ventas</div>
    }

    return (
        <div className="sales-history-container">
            <div className="d-flex justify-content-between align-items-center mb-4">
                <h2 className="mb-0 text-light">Ventas encontradas: {filteredSales.length}</h2>
                <div style={{width: '300px'}}>
                    <SearchBox onSearch={setSearchText} placeholder="Buscar por cliente, teléfono o ID..." />
                </div>
            </div>

            <div className="table-responsive">
                <table className="table table-striped table-hover">
                    <thead className="table-dark">
                    <tr>
                        <th>Número de venta</th>
                        <th>Cliente</th>
                        <th>Cantidad</th>
                        <th>Ítem</th>
                        <th>Subtotal</th>
                        <th>Total</th>
                        <th>Método de Pago</th>
                        <th>Estado</th>
                        <th>Hora</th>
                        <th>Acciones</th>
                    </tr>
                    </thead>
                    <tbody>
                     {filteredSales.map(sale =>
                            sale.items.map((item, index) => (
                                <tr key={`${sale.saleId}-${index}`}>
                                    {index === 0 && (
                                        <>
                                            <td rowSpan={sale.items.length}>{sale.saleId}</td>
                                            <td rowSpan={sale.items.length}>
                                                {sale.customerName}<br/>
                                                <small className="text-muted">{sale.phoneNumber}</small>
                                            </td>
                                        </>
                                    )}
                                    <td>{item.quantity}</td>
                                    <td>{item.name}</td>
                                    {index === 0 && (
                                        <>
                                            <td rowSpan={sale.items.length}>${sale.subtotal}</td>
                                            <td rowSpan={sale.items.length}>${sale.grandTotal}</td>
                                            <td rowSpan={sale.items.length}>{sale.paymentMethod}</td>
                                            <td rowSpan={sale.items.length}>
                                              <span className="badge bg-success">
                                                COMPLETADO
                                              </span>
                                            </td>
                                            <td rowSpan={sale.items.length}>{formatDate(sale.createdAt)}</td>
                                            <td rowSpan={sale.items.length}>
                                                <button
                                                    className="btn btn-primary btn-sm"
                                                    onClick={() => handleViewReceipt(sale)}
                                                >
                                                    <i className="bi bi-eye me-1"></i>
                                                    Ver Comprobante
                                                </button>
                                            </td>
                                        </>
                                    )}
                                </tr>
                            ))
                    )}
                    </tbody>
                </table>
            </div>

            {showPopup && selectedSale && (
                <ReceiptPopup
                    orderDetails={selectedSale}
                    onClose={handleClosePopup}
                    onPrint={handlePrintReceipt}
                />
            )}
        </div>
    )
}

export default SaleHistory;