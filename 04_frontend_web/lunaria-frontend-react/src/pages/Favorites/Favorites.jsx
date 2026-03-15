import { useContext, useState } from "react";
import { AppContext } from "../../context/AppContext.jsx";
import './Favorites.css';

const Favorites = () => {
    const { favorites, removeFromFavorites, itemsData, addToCart, auth, addToFavorites } = useContext(AppContext);
    const [showItemModal, setShowItemModal] = useState(false);
    const [selectedItem, setSelectedItem] = useState(null);
    
    // Check if user is admin
    const isAdmin = auth.role === 'ROLE_ADMIN';

    const handleRemoveFavorite = async (itemId) => {
        await removeFromFavorites(itemId);
    };

    const handleItemClick = (favorite) => {
        // Find the full item details from itemsData
        const fullItem = itemsData.find(item => item.itemId === favorite.itemId);
        if (fullItem) {
            setSelectedItem(fullItem);
            setShowItemModal(true);
        }
    };

    const closeItemModal = () => {
        setShowItemModal(false);
        setSelectedItem(null);
    };

    const handleAddToCartFromModal = () => {
        if (selectedItem) {
            addToCart({
                name: selectedItem.name,
                price: selectedItem.price,
                quantity: 1,
                itemId: selectedItem.itemId
            });
            closeItemModal();
        }
    };

    const handleAddToFavoritesFromModal = async () => {
        if (selectedItem) {
            try {
                await addToFavorites(selectedItem.itemId);
                closeItemModal();
            } catch (error) {
                console.error("Error adding to favorites from modal:", error);
            }
        }
    };

    return (
        <div className="favorites-container">
            <div className="container mt-4">
                <h2 className="mb-4 text-warning">
                    <i className="bi bi-heart-fill me-2"></i>
                    Mis Favoritos
                </h2>

                {favorites.length === 0 ? (
                    <div className="favorites-empty text-center py-5">
                        <i className="bi bi-heart display-1 text-muted mb-3"></i>
                        <h4 className="text-muted">No tienes productos favoritos</h4>
                        <p className="text-muted">Agrega productos a tus favoritos desde el catálogo</p>
                    </div>
                ) : (
                    <div className="favorites-grid row g-3">
                        {favorites.map((favorite) => (
                            <div key={favorite.id} className="col-md-4 col-sm-6">
                                <div 
                                    className="card h-100 shadow-sm favorite-card"
                                    onClick={() => handleItemClick(favorite)}
                                    style={{ cursor: 'pointer' }}
                                >
                                    <div className="card-img-container">
                                        <img
                                            src={favorite.itemImgUrl}
                                            alt={favorite.itemName}
                                            className="card-img-top"
                                            style={{ height: '200px', objectFit: 'cover' }}
                                        />
                                        <button
                                            className="btn btn-danger btn-sm favorite-remove-btn"
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                handleRemoveFavorite(favorite.itemId);
                                            }}
                                            title="Remover de favoritos"
                                        >
                                            <i className="bi bi-heart-fill"></i>
                                        </button>
                                    </div>
                                    <div className="card-body d-flex flex-column">
                                        <h5 className="card-title text-warning">{favorite.itemName}</h5>
                                        {favorite.itemDescription && (
                                            <p className="card-text text-muted small">{favorite.itemDescription}</p>
                                        )}
                                        <div className="mt-auto">
                                            <small className="text-muted">
                                                Agregado: {new Date(favorite.addedAt).toLocaleDateString()}
                                            </small>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {/* Product Detail Modal */}
            {showItemModal && selectedItem && (
                <div className="modal show d-block" style={{ backgroundColor: 'rgba(0,0,0,0.7)' }}>
                    <div className="modal-dialog modal-lg">
                        <div className="modal-content bg-dark text-light">
                            <div className="modal-header">
                                <h5 className="modal-title">Detalles del Producto</h5>
                                <button type="button" className="btn-close btn-close-white" onClick={closeItemModal}></button>
                            </div>
                            <div className="modal-body">
                                <div className="row">
                                    <div className="col-md-6">
                                        <img
                                            src={selectedItem.imgUrl}
                                            alt={selectedItem.name}
                                            className="img-fluid rounded"
                                            style={{ maxHeight: '300px', width: '100%', objectFit: 'cover' }}
                                        />
                                    </div>
                                    <div className="col-md-6">
                                        <h3 className="text-warning mb-3">{selectedItem.name}</h3>

                                        {/* Sección de Precios */}
                                        <div className="p-3 bg-dark rounded border border-warning mb-3">
                                            <div className="d-flex justify-content-between align-items-center mb-3">
                                                <h5 className="text-light mb-0">Precios:</h5>
                                                <small className="text-muted">ID: {selectedItem.itemId}</small>
                                            </div>
                                            
                                            {/* Precio de venta - siempre visible */}
                                            <div className="d-flex justify-content-between align-items-center mb-2">
                                                <span className="text-light">Precio de venta:</span>
                                                <span className="text-success fw-bold fs-5">${selectedItem.price}</span>
                                            </div>
                                            
                                            {/* Precio con instalación */}
                                            {selectedItem.installationPrice && (
                                                <div className="d-flex justify-content-between align-items-center mb-2">
                                                    <span className="text-light">Precio con instalación:</span>
                                                    <span className="text-info fw-bold">${selectedItem.installationPrice}</span>
                                                </div>
                                            )}
                                            
                                            {/* Precio de compra - solo visible para admin */}
                                            {isAdmin && selectedItem.purchasePrice && (
                                                <div className="d-flex justify-content-between align-items-center mt-3 pt-2 border-top border-secondary">
                                                    <span className="text-warning">Precio de compra:</span>
                                                    <span className="text-warning fw-bold">${selectedItem.purchasePrice}</span>
                                                </div>
                                            )}
                                        </div>

                                        <div className="mb-3">
                                            <strong>Categoría:</strong>
                                            <p className="text-light">{selectedItem.categoryName}</p>
                                        </div>

                                        {selectedItem.brandName && (
                                            <div className="mb-3">
                                                <strong>Marca:</strong>
                                                <p className="text-light">{selectedItem.brandName}</p>
                                            </div>
                                        )}

                                        <div className="mb-3">
                                            <strong>Stock Disponible:</strong>
                                            <p className={`mb-0 ${selectedItem.stockQuantity > 10 ? 'text-success' : selectedItem.stockQuantity > 0 ? 'text-warning' : 'text-danger'}`}>
                                                {selectedItem.stockQuantity} unidades
                                            </p>
                                            <small className="text-muted">
                                                Estado: {selectedItem.stockStatus === 'IN_STOCK' ? 'En Stock' :
                                                        selectedItem.stockStatus === 'LOW_STOCK' ? 'Stock Bajo' : 'Sin Stock'}
                                            </small>
                                        </div>

                                        {selectedItem.description && (
                                            <div className="mb-3">
                                                <strong>Descripción:</strong>
                                                <p className="text-light">{selectedItem.description}</p>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>
                            <div className="modal-footer">
                                {auth.role === 'ROLE_ADMIN' ? (
                                    <button type="button" className="btn btn-success" onClick={handleAddToCartFromModal}>
                                        <i className="bi bi-cart-plus me-2"></i>
                                        Agregar al carrito
                                    </button>
                                ) : (
                                    <button type="button" className="btn btn-warning" onClick={handleAddToFavoritesFromModal}>
                                        <i className="bi bi-heart me-2"></i>
                                        Agregar a favoritos
                                    </button>
                                )}
                                <button type="button" className="btn btn-secondary" onClick={closeItemModal}>
                                    Cerrar
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Favorites;
