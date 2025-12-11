import { useEffect, useState } from "react";
import './ManageStock.css';
import { getStockDashboard } from "../../Service/StockService.js";
import toast from "react-hot-toast";

const ManageStock = () => {
    const [stockData, setStockData] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchStockData = async () => {
            try {
                const response = await getStockDashboard();
                setStockData(response.data);
            } catch (error) {
                console.error("Error fetching stock dashboard:", error);
                toast.error("Error al cargar datos de stock");
            } finally {
                setLoading(false);
            }
        };
        fetchStockData();
    }, []);

    if (loading) {
        return <div className="manage-stock-container d-flex justify-content-center align-items-center" style={{height: '100vh'}}>
            <div className="spinner-border text-primary" role="status">
                <span className="visually-hidden">Cargando...</span>
            </div>
        </div>;
    }

    if (!stockData) {
        return <div className="manage-stock-container text-center mt-5">
            <p>No se pudieron cargar los datos de stock.</p>
        </div>;
    }

    return (
        <div className="manage-stock-container p-4">
            <h2 className="mb-4 text-light">Gestión de Inventario</h2>

            {/* Estadísticas */}
            <div className="row mb-4">
                <div className="col-md-3">
                    <div className="card bg-dark text-light border-secondary">
                        <div className="card-body text-center">
                            <h5 className="card-title">Total Productos</h5>
                            <h3 className="text-primary">{stockData.totalProducts}</h3>
                        </div>
                    </div>
                </div>
                <div className="col-md-3">
                    <div className="card bg-dark text-light border-secondary">
                        <div className="card-body text-center">
                            <h5 className="card-title">En Stock</h5>
                            <h3 className="text-success">{stockData.inStock}</h3>
                        </div>
                    </div>
                </div>
                <div className="col-md-3">
                    <div className="card bg-dark text-light border-secondary">
                        <div className="card-body text-center">
                            <h5 className="card-title">Stock Bajo</h5>
                            <h3 className="text-warning">{stockData.lowStock}</h3>
                        </div>
                    </div>
                </div>
                <div className="col-md-3">
                    <div className="card bg-dark text-light border-secondary">
                        <div className="card-body text-center">
                            <h5 className="card-title">Sin Stock</h5>
                            <h3 className="text-danger">{stockData.outOfStock}</h3>
                        </div>
                    </div>
                </div>
            </div>

            {/* Productos con Stock Bajo */}
            <div className="mb-4">
                <h4 className="text-light mb-3">Productos con Stock Bajo</h4>
                {stockData.lowStockProducts && stockData.lowStockProducts.length > 0 ? (
                    <div className="table-responsive">
                        <table className="table table-dark table-striped">
                            <thead>
                                <tr>
                                    <th>Nombre</th>
                                    <th>Stock Actual</th>
                                    <th>Precio</th>
                                    <th>Categoría</th>
                                </tr>
                            </thead>
                            <tbody>
                                {stockData.lowStockProducts.map((product, index) => (
                                    <tr key={index}>
                                        <td>{product.name}</td>
                                        <td className="text-warning">{product.stockQuantity}</td>
                                        <td>${product.price}</td>
                                        <td>{product.category?.name || 'N/A'}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                ) : (
                    <p className="text-light">No hay productos con stock bajo.</p>
                )}
            </div>

            {/* Productos Sin Stock */}
            <div className="mb-4">
                <h4 className="text-light mb-3">Productos Sin Stock</h4>
                {stockData.outOfStockProducts && stockData.outOfStockProducts.length > 0 ? (
                    <div className="table-responsive">
                        <table className="table table-dark table-striped">
                            <thead>
                                <tr>
                                    <th>Nombre</th>
                                    <th>Precio</th>
                                    <th>Categoría</th>
                                </tr>
                            </thead>
                            <tbody>
                                {stockData.outOfStockProducts.map((product, index) => (
                                    <tr key={index}>
                                        <td>{product.name}</td>
                                        <td>${product.price}</td>
                                        <td>{product.category?.name || 'N/A'}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                ) : (
                    <p className="text-light">No hay productos sin stock.</p>
                )}
            </div>

            {/* Movimientos Recientes */}
            <div>
                <h4 className="text-light mb-3">Movimientos Recientes</h4>
                {stockData.recentMovements && stockData.recentMovements.length > 0 ? (
                    <div className="table-responsive">
                        <table className="table table-dark table-striped">
                            <thead>
                                <tr>
                                    <th>Producto</th>
                                    <th>Tipo</th>
                                    <th>Cantidad</th>
                                    <th>Stock Anterior</th>
                                    <th>Stock Nuevo</th>
                                    <th>Razón</th>
                                    <th>Usuario</th>
                                    <th>Fecha</th>
                                </tr>
                            </thead>
                            <tbody>
                                {stockData.recentMovements.map((movement, index) => (
                                    <tr key={index}>
                                        <td>{movement.itemName || 'N/A'}</td>
                                        <td>{movement.movementType}</td>
                                        <td>{movement.quantity}</td>
                                        <td>{movement.previousStock}</td>
                                        <td>{movement.newStock}</td>
                                        <td>{movement.reason}</td>
                                        <td>{movement.createdBy}</td>
                                        <td>{new Date(movement.createdAt).toLocaleString()}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                ) : (
                    <p className="text-light">No hay movimientos recientes.</p>
                )}
            </div>
        </div>
    );
};

export default ManageStock;