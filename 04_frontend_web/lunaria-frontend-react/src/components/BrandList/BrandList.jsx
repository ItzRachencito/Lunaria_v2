import './BrandList.css';
import {useContext, useState} from "react";
import {AppContext} from "../../context/AppContext.jsx";
import {deleteBrand} from "../../Service/BrandService.js";
import toast from "react-hot-toast";

const BrandList = () => {
    const {brands, setBrands} = useContext(AppContext);
    const [searchTerm, setSearchTerm] = useState('');

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
                                <div>
                                    <button className="btn btn-danger btn-sm"
                                    onClick={() => deleteByBrandId(brand.brandId)}>
                                        <i className="bi bi-trash"></i>
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    )
}

export default BrandList;