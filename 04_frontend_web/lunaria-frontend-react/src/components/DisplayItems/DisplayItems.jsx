import './DisplayItems.css';
import {useContext, useState} from "react";
import {AppContext} from "../../context/AppContext.jsx";
import Item from "../Item/Item.jsx";
import SearchBox from "../SearchBox/SearchBox.jsx";

const DisplayItems = ({selectedCategory}) => {
    const {itemsData, addToCart, auth, addToFavorites, checkFavoriteStatus} = useContext(AppContext);
    const [searchText, setSearchText] = useState("");
    const [showItemModal, setShowItemModal] = useState(false);
    const [selectedItem, setSelectedItem] = useState(null);

    // Check if user is admin
    const isAdmin = auth.role === 'ROLE_ADMIN';

    const filteredItems = itemsData.filter(item => {
        if(!selectedCategory) return true;
        return item.categoryId === selectedCategory;
    }).filter(item => item.name.toLowerCase().includes(searchText.toLowerCase()));

    const handleItemClick = (item) => {
        setSelectedItem(item);
        setShowItemModal(true);
    }

    const closeItemModal = () => {
        setShowItemModal(false);
        setSelectedItem(null);
    }

    const handleAddToCartFromModal = () => {
        if (selectedItem) {
            addToCart({
                name: selectedItem.name,
                price: selectedItem.price,
                quantity: 1,
                itemId: selectedItem.itemId
            });
            closeItemModal(); // Close modal after adding to cart
        }
    }

    const handleAddToFavoritesFromModal = async () => {
        if (selectedItem) {
            try {
                await addToFavorites(selectedItem.itemId);
                closeItemModal();
            } catch (error) {
                console.error("Error adding to favorites from modal:", error);
                // Don't close modal on error so user can try again
            }
        }
    }

    return (
        <div className="p-3">
            <div className="d-flex justify-content-between align-items-center align-items-center mb-4">
                <div></div>
                <div>
                    <SearchBox onSearch={setSearchText} />
                </div>
            </div>
            <div className="row g-3">
                {filteredItems.map((item, index) => (
                    <div key={index} className="col-md-4 col-sm-6">
                        <Item
                            itemName={item.name}
                            itemPrice={item.price}
                            itemImage={item.imgUrl}
                            itemId={item.itemId}
                            onItemClick={() => handleItemClick(item)}
                        />
                    </div>
                ))}
            </div>

            {/* Item Details Modal */}
            {showItemModal && selectedItem && (
                <div className="modal show d-block" style={{backgroundColor: 'rgba(0,0,0,0.8)'}}>
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
                                            style={{maxHeight: '300px', width: '100%', objectFit: 'cover'}}
                                        />
                                    </div>
                                    <div className="col-md-6">
                                        <h3 className="text-warning mb-3">{selectedItem.name}</h3>

                                        {/* Sección de Precios */}
                                        <div className="p-3 bg-dark rounded border border-warning mb-3">
                                            <h5 className="text-light mb-3">Precios:</h5>
                                            
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

                                        <div className="mb-3">
                                            <strong>ID del Producto:</strong>
                                            <p className="text-muted small">{selectedItem.itemId}</p>
                                        </div>
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
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}

export default DisplayItems;