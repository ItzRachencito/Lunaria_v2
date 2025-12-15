import './SaleHistory.css';
import {useEffect, useState} from "react";
import {latestSales} from "../../Service/SaleService.js";

const SaleHistory = () => {
    const [sales, setSales] = useState([]);
    const [loading, setLoading] = useState(true);

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

    if (loading) {
        return <div className="text-center py-4">Buscando ventas...</div>
    }

    if (sales.length === 0) {
        return <div className="text-center py-4">No se encontraron ventas</div>
    }

    return (
        <div className="sales-history-container">
            <h2 className="mb-2 text-light">Ventas encontradas: </h2>

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
                    </tr>
                    </thead>
                    <tbody>
                    {sales.map(sale =>
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
                                        </>
                                    )}
                                </tr>
                            ))
                    )}
                    </tbody>
                </table>
            </div>
        </div>
    )
}

export default SaleHistory;