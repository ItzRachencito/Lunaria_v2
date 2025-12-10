import './BrandList.css';
import {useContext, useState} from "react";
import {AppContext} from "../../context/AppContext.jsx";
import {deleteBrand, updateBrand} from "../../Service/BrandService.js";
import toast from "react-hot-toast";

const BrandList = () => {
    const {brands, setBrands} = useContext(AppContext);
    const [searchTerm, setSearchTerm] = useState('');
    const [showEditModal, setShowEditModal] = useState(false);
    const [selectedBrand, setSelectedBrand] = useState(null);
    const [editData, setEditData] = useState({
        name: "",
        description: ""
    });

    const filteredBrands = brands.filter(brand =>
        brand.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const deleteByBrandId = async (brandId) => {
        try {
            const response = await deleteBrand(brandId);
            if (response.status === 204) {
                const updatedBrands = brands.filter(brand => brand.brandId !== brandId);
                setBrands(updatedBrands);
                toast.success("Brand deleted");
            } else {
                toast.error("Unable to delete brand");
            }
        } catch (error) {
            console.error(error);
            toast.error("Unable to delete brand");
        }
    }

    const openEditModal = (brand) => {
        setSelectedBrand(brand);
        setEditData({
            name: brand.name,
            description: brand.description
        });
        setShowEditModal(true);
    }

    const closeEditModal = () => {
        setShowEditModal(false);
        setSelectedBrand(null);
    }

    const handleEdit = async () => {
        if (!selectedBrand) {
            toast.error("No brand selected");
            return;
        }

        try {
            const response = await updateBrand(selectedBrand.brandId, editData);
            if (response.status === 200) {
                const updatedBrands = brands.map(brand =>
                    brand.brandId === selectedBrand.brandId ? response.data : brand
                );
                setBrands(updatedBrands);
                toast.success("Brand updated successfully");
                closeEditModal();
            } else {
                toast.error("Failed to update brand");
            }
        } catch (error) {
            console.error(error);
            toast.error("Error updating brand");
        }
    }

    const handleEditChange = (e) => {
        const { name, value } = e.target;
        setEditData(prev => ({ ...prev, [name]: value }));
    }

    return (
        <div className="brand-list-container" style={{height:'100vh', overflowY: 'auto', overflowX: 'hidden'}}>
            <div className="row pe-2">
                <div className="input-group mb-3">
                    <input type="text"
                           name="keyword"
                           id="keyword"
                           placeholder="Busca Marcas"
                           className="form-control"
                            onChange={(e) => setSearchTerm(e.target.value)}
                           value={searchTerm}
                    />
                    <span className="input-group-text bg-warning">
                        <i className="bi bi-search"></i>
                    </span>
                </div>
            </div>
            <div className="row g-3 pe-2">
                {filteredBrands.map((brand, index) => (
                    <div key={index} className="col-12">
                        <div className="card p-3 bg-dark brand-card">
                            <div className="d-flex align-items-center">
                                <div className="flex-grow-1">
                                    <h5 className="mb-1 text-white">{brand.name}</h5>
                                    <p className="mb-2 text-white-50 small">{brand.description}</p>
                                    <p className="mb-0 text-white">{brand.items} Items</p>
                                </div>
                                <div className="d-flex gap-1">
                                    <button className="btn btn-primary btn-sm" onClick={() => openEditModal(brand)} title="Edit Brand">
                                        <i className="bi bi-pencil"></i>
                                    </button>
                                    <button className="btn btn-danger btn-sm" onClick={() => deleteByBrandId(brand.brandId)} title="Delete Brand">
                                        <i className="bi bi-trash"></i>
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {/* Edit Brand Modal */}
            {showEditModal && selectedBrand && (
                <div className="modal show d-block" style={{backgroundColor: 'rgba(0,0,0,0.5)'}}>
                    <div className="modal-dialog">
                        <div className="modal-content bg-dark text-light">
                            <div className="modal-header">
                                <h5 className="modal-title">Edit Brand - {selectedBrand.name}</h5>
                                <button type="button" className="btn-close btn-close-white" onClick={closeEditModal}></button>
                            </div>
                            <div className="modal-body">
                                <div className="mb-3">
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
                                <button type="button" className="btn btn-primary" onClick={handleEdit}>Update Brand</button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}

export default BrandList;