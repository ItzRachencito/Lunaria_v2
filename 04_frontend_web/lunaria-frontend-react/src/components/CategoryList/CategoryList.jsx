import './CategoryList.css';
import {useContext, useState} from "react";
import {AppContext} from "../../context/AppContext.jsx";
import {deleteCategory, updateCategory} from "../../Service/CategoryService.js";
import toast from "react-hot-toast";

const CategoryList = () => {
    const {categories, setCategories} = useContext(AppContext);
    const [searchTerm, setSearchTerm] = useState('');
    const [showEditModal, setShowEditModal] = useState(false);
    const [selectedCategory, setSelectedCategory] = useState(null);
    const [editData, setEditData] = useState({
        name: "",
        description: "",
        bgColor: "#2c2c2c"
    });

    const filteredCategories = categories.filter(category =>
        category.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const deleteByCategoryId = async (categoryId) => {
        try {
            const response = await deleteCategory(categoryId);
            if (response.status === 204) {
                const updatedCategories = categories.filter(category => category.categoryId !== categoryId);
                setCategories(updatedCategories);
                toast.success("Category deleted");
            } else {
                toast.error("Unable to delete category");
            }
        } catch (error) {
            console.error(error);
            toast.error("Unable to delete category");
        }
    }

    const openEditModal = (category) => {
        setSelectedCategory(category);
        setEditData({
            name: category.name,
            description: category.description,
            bgColor: category.bgColor
        });
        setShowEditModal(true);
    }

    const closeEditModal = () => {
        setShowEditModal(false);
        setSelectedCategory(null);
    }

    const handleEdit = async () => {
        if (!selectedCategory) {
            toast.error("No category selected");
            return;
        }

        try {
            const response = await updateCategory(selectedCategory.categoryId, editData);
            if (response.status === 200) {
                const updatedCategories = categories.map(category =>
                    category.categoryId === selectedCategory.categoryId ? response.data : category
                );
                setCategories(updatedCategories);
                toast.success("Category updated successfully");
                closeEditModal();
            } else {
                toast.error("Failed to update category");
            }
        } catch (error) {
            console.error(error);
            toast.error("Error updating category");
        }
    }

    const handleEditChange = (e) => {
        const { name, value } = e.target;
        setEditData(prev => ({ ...prev, [name]: value }));
    }

    return (
        <div className="category-list-container" style={{height:'100vh', overflowY: 'auto', overflowX: 'hidden'}}>
            <div className="row pe-2">
                <div className="input-group mb-3">
                    <input type="text"
                           name="keyword"
                           id="keyword"
                           placeholder="Busca Categorías"
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
                {filteredCategories.map((category, index) => (
                    <div key={index} className="col-12">
                        <div className="card p-3 category-card" style={{backgroundColor: category.bgColor}}>
                            <div className="d-flex align-items-center">
                                <div style={{marginRight: '15px'}}>
                                    <img src={category.imgUrl} alt={category.name} className="category-image" />
                                </div>
                                <div className="flex-grow-1">
                                    <h5 className="mb-1 text-white">{category.name}</h5>
                                    <p className="mb-2 text-white-50 small">{category.description}</p>
                                    <p className="mb-0 text-white">{category.items} Items</p>
                                </div>
                                <div className="d-flex gap-1">
                                    <button className="btn btn-primary btn-sm" onClick={() => openEditModal(category)} title="Edit Category">
                                        <i className="bi bi-pencil"></i>
                                    </button>
                                    <button className="btn btn-danger btn-sm" onClick={() => deleteByCategoryId(category.categoryId)} title="Delete Category">
                                        <i className="bi bi-trash"></i>
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {/* Edit Category Modal */}
            {showEditModal && selectedCategory && (
                <div className="modal show d-block" style={{backgroundColor: 'rgba(0,0,0,0.5)'}}>
                    <div className="modal-dialog">
                        <div className="modal-content bg-dark text-light">
                            <div className="modal-header">
                                <h5 className="modal-title">Edit Category - {selectedCategory.name}</h5>
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
                                <div className="mb-3">
                                    <label htmlFor="editBgColor" className="form-label">Background Color</label>
                                    <br/>
                                    <input
                                        type="color"
                                        id="editBgColor"
                                        name="bgColor"
                                        value={editData.bgColor}
                                        onChange={handleEditChange}
                                    />
                                </div>
                            </div>
                            <div className="modal-footer">
                                <button type="button" className="btn btn-secondary" onClick={closeEditModal}>Cancel</button>
                                <button type="button" className="btn btn-primary" onClick={handleEdit}>Update Category</button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}

export default CategoryList;