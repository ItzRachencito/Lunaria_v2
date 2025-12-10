import {useContext, useState} from "react";
import {AppContext} from "../../context/AppContext.jsx";
import {deleteItem, updateItem} from "../../Service/ItemService.js";
import {adjustStock} from "../../Service/StockService.js";
import toast from "react-hot-toast";
import './ItemList.css';

const ItemList = () => {
    const {itemsData, setItemsData, refreshItems, categories, brands} = useContext(AppContext);
    const [searchTerm, setSearchTerm] = useState("");
    const [showStockModal, setShowStockModal] = useState(false);
    const [showEditModal, setShowEditModal] = useState(false);
    const [selectedItem, setSelectedItem] = useState(null);
    const [newStock, setNewStock] = useState(0);
    const [adjustmentReason, setAdjustmentReason] = useState("");
    const [editData, setEditData] = useState({
        name: "",
        categoryId: "",
        brandId: "",
        price: "",
        description: ""
    });

    const filteredItems = itemsData.filter((item) => {
        return item.name.toLowerCase().includes(searchTerm.toLowerCase());
    })

    const removeItem = async (itemId) => {
        try {
            const response = await deleteItem(itemId);
            if (response.status === 204) {
                await refreshItems(); // Refresh items to show updated data
                toast.success("Item deleted");
            } else {
                toast.error("Unable to delete item");
            }
        }catch(err) {
            console.error(err);
            toast.error("Unable to delete item");
        }
    }

    const openStockModal = (item) => {
        setSelectedItem(item);
        setNewStock(item.stockQuantity);
        setAdjustmentReason("");
        setShowStockModal(true);
    }

    const closeStockModal = () => {
        setShowStockModal(false);
        setSelectedItem(null);
    }

    const openEditModal = (item) => {
        setSelectedItem(item);
        setEditData({
            name: item.name,
            categoryId: item.categoryId,
            brandId: item.brandId || "",
            price: item.price,
            description: item.description
        });
        setShowEditModal(true);
    }

    const closeEditModal = () => {
        setShowEditModal(false);
        setSelectedItem(null);
    }

    const handleStockAdjustment = async () => {
        if (!selectedItem || !adjustmentReason.trim()) {
            toast.error("Please provide a reason for the adjustment");
            return;
        }

        try {
            const response = await adjustStock(selectedItem.id, newStock, adjustmentReason, "Admin");
            if (response.status === 200) {
                await refreshItems();
                toast.success("Stock adjusted successfully");
                closeStockModal();
            } else {
                toast.error("Failed to adjust stock");
            }
        } catch (error) {
            console.error(error);
            toast.error("Error adjusting stock");
        }
    }

    const handleEdit = async () => {
        if (!selectedItem) {
            toast.error("No item selected");
            return;
        }

        try {
            const response = await updateItem(selectedItem.itemId, editData);
            if (response.status === 200) {
                await refreshItems();
                toast.success("Item updated successfully");
                closeEditModal();
            } else {
                toast.error("Failed to update item");
            }
        } catch (error) {
            console.error(error);
            toast.error("Error updating item");
        }
    }

    const handleEditChange = (e) => {
        const { name, value } = e.target;
        setEditData(prev => ({ ...prev, [name]: value }));
    }

    return (
        <div className="category-list-container" style={{height:'100vh', overflowY: 'auto', overflowX: 'hidden'}}>
            <div className="row">
                <div className="input-group mb-3">
                    <input type="text"
                           name="keyword"
                           id="keyword"
                           placeholder="Busca ítems"
                           className="form-control"
                           onChange={(e) => setSearchTerm(e.target.value)}
                           value={searchTerm}
                    />
                    <span className="input-group-text bg-warning">
                        <i className="bi bi-search"></i>
                    </span>
                </div>
            </div>
            <div className="row g-3">
                {filteredItems.map((item, index) => (
                    <div className="col-lg-12" key={index}>
                        <div className="card p-3 bg-dark item-card">
                            <div className="d-flex align-items-center">
                                <div style={{marginRight: '15px'}}>
                                    <img src={item.imgUrl} alt={item.name} className="item-image" />
                                </div>
                                <div className="flex-grow-1">
                                    <h6 className="mb-1 text-white">{item.name}</h6>
                                    <p className="mb-0 text-white">
                                        Categoría: {item.categoryName} {item.brandName ? `| Marca: ${item.brandName}` : ''}
                                    </p>
                                    <span className="mb-0 text-block badge rounded-pill text-bg-warning">
                                        $ {item.price}
                                    </span>
                                    <p className="mb-0 text-white">
                                        Stock: {item.stockQuantity} - {item.stockStatus === 'IN_STOCK' ? 'En Stock' : item.stockStatus === 'LOW_STOCK' ? 'Stock Bajo' : 'Sin Stock'}
                                    </p>
                                </div>
                                <div className="d-flex gap-1">
                                    <button className="btn btn-primary btn-sm" onClick={() => openEditModal(item)} title="Edit Item">
                                        <i className="bi bi-pencil"></i>
                                    </button>
                                    <button className="btn btn-warning btn-sm" onClick={() => openStockModal(item)} title="Adjust Stock">
                                        <i className="bi bi-plus-circle"></i>
                                    </button>
                                    <button className="btn btn-danger btn-sm" onClick={() => removeItem(item.itemId)} title="Delete Item">
                                        <i className="bi bi-trash"></i>
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {/* Stock Adjustment Modal */}
            {showStockModal && selectedItem && (
                <div className="modal show d-block" style={{backgroundColor: 'rgba(0,0,0,0.5)'}}>
                    <div className="modal-dialog">
                        <div className="modal-content bg-dark text-light">
                            <div className="modal-header">
                                <h5 className="modal-title">Adjust Stock - {selectedItem.name}</h5>
                                <button type="button" className="btn-close btn-close-white" onClick={closeStockModal}></button>
                            </div>
                            <div className="modal-body">
                                <div className="mb-3">
                                    <label className="form-label">Current Stock: {selectedItem.stockQuantity}</label>
                                </div>
                                <div className="mb-3">
                                    <label htmlFor="newStock" className="form-label">New Stock Quantity</label>
                                    <input
                                        type="number"
                                        className="form-control"
                                        id="newStock"
                                        value={newStock}
                                        onChange={(e) => setNewStock(parseInt(e.target.value) || 0)}
                                        min="0"
                                    />
                                </div>
                                <div className="mb-3">
                                    <label htmlFor="reason" className="form-label">Reason for Adjustment</label>
                                    <textarea
                                        className="form-control"
                                        id="reason"
                                        rows="3"
                                        value={adjustmentReason}
                                        onChange={(e) => setAdjustmentReason(e.target.value)}
                                        placeholder="Enter reason for stock adjustment"
                                        required
                                    ></textarea>
                                </div>
                            </div>
                            <div className="modal-footer">
                                <button type="button" className="btn btn-secondary" onClick={closeStockModal}>Cancel</button>
                                <button type="button" className="btn btn-primary" onClick={handleStockAdjustment}>Adjust Stock</button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Edit Item Modal */}
            {showEditModal && selectedItem && (
                <div className="modal show d-block" style={{backgroundColor: 'rgba(0,0,0,0.5)'}}>
                    <div className="modal-dialog modal-lg">
                        <div className="modal-content bg-dark text-light">
                            <div className="modal-header">
                                <h5 className="modal-title">Edit Item - {selectedItem.name}</h5>
                                <button type="button" className="btn-close btn-close-white" onClick={closeEditModal}></button>
                            </div>
                            <div className="modal-body">
                                <div className="row">
                                    <div className="col-md-6 mb-3">
                                        <label htmlFor="editName" className="form-label">Name</label>
                                        <input
                                            type="text"
                                            className="form-control"
                                            id="editName"
                                            name="name"
                                            value={editData.name}
                                            onChange={handleEditChange}
                                            required
                                        />
                                    </div>
                                    <div className="col-md-6 mb-3">
                                        <label htmlFor="editPrice" className="form-label">Price</label>
                                        <input
                                            type="number"
                                            className="form-control"
                                            id="editPrice"
                                            name="price"
                                            value={editData.price}
                                            onChange={handleEditChange}
                                            step="0.01"
                                            min="0"
                                            required
                                        />
                                    </div>
                                </div>
                                <div className="row">
                                    <div className="col-md-6 mb-3">
                                        <label htmlFor="editCategory" className="form-label">Category</label>
                                        <select
                                            className="form-control"
                                            id="editCategory"
                                            name="categoryId"
                                            value={editData.categoryId}
                                            onChange={handleEditChange}
                                            required
                                        >
                                            <option value="">--Select Category--</option>
                                            {categories.map((category, index) => (
                                                <option key={index} value={category.categoryId}>{category.name}</option>
                                            ))}
                                        </select>
                                    </div>
                                    <div className="col-md-6 mb-3">
                                        <label htmlFor="editBrand" className="form-label">Brand</label>
                                        <select
                                            className="form-control"
                                            id="editBrand"
                                            name="brandId"
                                            value={editData.brandId}
                                            onChange={handleEditChange}
                                        >
                                            <option value="">--No Brand--</option>
                                            {brands.map((brand, index) => (
                                                <option key={index} value={brand.brandId}>{brand.name}</option>
                                            ))}
                                        </select>
                                    </div>
                                </div>
                                <div className="mb-3">
                                    <label htmlFor="editDescription" className="form-label">Description</label>
                                    <textarea
                                        className="form-control"
                                        id="editDescription"
                                        name="description"
                                        rows="3"
                                        value={editData.description}
                                        onChange={handleEditChange}
                                    ></textarea>
                                </div>
                            </div>
                            <div className="modal-footer">
                                <button type="button" className="btn btn-secondary" onClick={closeEditModal}>Cancel</button>
                                <button type="button" className="btn btn-primary" onClick={handleEdit}>Update Item</button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}

export default ItemList;