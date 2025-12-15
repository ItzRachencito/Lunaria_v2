import './Dashboard.css';
import {useEffect, useState, useContext} from "react";
import {fetchDashboardData} from "../../Service/Dashboard.js";
import {AppContext} from "../../context/AppContext.jsx";
import toast from "react-hot-toast";

const Dashboard = () => {
    const {auth, favorites} = useContext(AppContext);
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);

    const isAdmin = auth.role === 'ROLE_ADMIN';
    useEffect(() => {
        const loadData = async () => {
            if (isAdmin) {
                try {
                    const response = await fetchDashboardData();
                    setData(response.data);
                } catch (error) {
                    console.error(error);
                    toast.error("Unable to view the data");
                } finally {
                    setLoading(false);
                }
            } else {
                setLoading(false);
            }
        }
        loadData();
    }, [isAdmin]);

    if (loading) {
        return <div className="loading">Loading dashboard...</div>
    }

    if (isAdmin) {
        if (!data) {
            return <div className="error">Failed to load the dashboard data...</div>;
        }

        return (
            <div className="dashboard-wrapper">
                <div className="dashboard-container">
                    <div className="stats-grid">
                        <div className="stat-card">
                            <div className="stat-icon">
                                <i className="bi bi-currency-dollar"></i>
                            </div>
                            <div className="stat-content">
                                <h3>Recaudado Hoy</h3>
                                <p>${data.todaySales.toFixed(2)}</p>
                            </div>
                        </div>

                        <div className="stat-card">
                            <div className="stat-icon">
                                <i className="bi bi-cart-check"></i>
                            </div>
                            <div className="stat-content">
                                <h3>Órdenes de hoy</h3>
                                <p>{data.todayOrderCount}</p>
                            </div>
                        </div>
                    </div>
                    <div className="recent-orders-card">
                        <h3 className="recent-orders-title">
                            <i className="bi bi-clock-history"></i>
                            Órdenes recientes
                        </h3>
                        <div className="orders-table-container">
                            <table className="orders-table">
                                <thead>
                                <tr>
                                    <th>Número de orden</th>
                                    <th>Cliente</th>
                                    <th>Total</th>
                                    <th>Método de Pago</th>
                                    <th>Estado</th>
                                    <th>Hora</th>
                                </tr>
                                </thead>
                                <tbody>
                                {data.recentOrders.map((order) => (
                                    <tr key={order.orderId}>
                                        <td>{order.orderId.substring(0,8)}...</td>
                                        <td>{order.customerName}</td>
                                        <td>${order.grandTotal.toFixed(2)}</td>
                                        <td>
                                            <span className={`payment-method ${order.paymentMethod.toLowerCase()}`}>
                                                {order.paymentMethod}
                                            </span>
                                        </td>
                                        <td>
                                            <span className={`status-badge ${order.paymentDetails.status.toLowerCase()}`}>
                                                {order.paymentDetails.status}
                                            </span>
                                        </td>
                                        <td>
                                            {new Date(order.createdAt).toLocaleDateString([], {
                                                hour: '2-digit',
                                                minute: '2-digit',
                                            })}
                                        </td>
                                    </tr>
                                ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </div>
        )
    } else {
        // User dashboard
        return (
            <div className="dashboard-wrapper">
                <div className="dashboard-container">
                    <div className="welcome-section">
                        <h2 className="welcome-title">
                            <i className="bi bi-house-heart me-3"></i>
                            ¡Bienvenido a Lunaria!
                        </h2>
                        <p className="welcome-text">
                            Explora nuestro catálogo de productos y guarda tus favoritos para futuras compras.
                        </p>
                    </div>

                    <div className="user-stats-grid">
                        <div className="stat-card">
                            <div className="stat-icon">
                                <i className="bi bi-heart"></i>
                            </div>
                            <div className="stat-content">
                                <h3>Productos Favoritos</h3>
                                <p>{favorites.length}</p>
                            </div>
                        </div>

                        <div className="stat-card">
                            <div className="stat-icon">
                                <i className="bi bi-shop"></i>
                            </div>
                            <div className="stat-content">
                                <h3>Explorar Catálogo</h3>
                                <p>Disponible</p>
                            </div>
                        </div>
                    </div>

                    <div className="user-actions">
                        <div className="action-card">
                            <h4>
                                <i className="bi bi-search me-2"></i>
                                Descubre Productos
                            </h4>
                            <p>Explora nuestro catálogo completo y encuentra lo que necesitas.</p>
                            <a href="/explore" className="btn btn-primary">
                                <i className="bi bi-arrow-right me-2"></i>
                                Ir al Catálogo
                            </a>
                        </div>

                        <div className="action-card">
                            <h4>
                                <i className="bi bi-heart me-2"></i>
                                Mis Favoritos
                            </h4>
                            <p>Revisa los productos que has guardado como favoritos.</p>
                            <a href="/favorites" className="btn btn-warning">
                                <i className="bi bi-arrow-right me-2"></i>
                                Ver Favoritos
                            </a>
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}

export default Dashboard;