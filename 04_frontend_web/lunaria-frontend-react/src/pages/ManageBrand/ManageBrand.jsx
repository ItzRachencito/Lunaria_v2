import './ManageBrand.css';
import BrandForm from "../../components/BrandForm/BrandForm.jsx";
import BrandList from "../../components/BrandList/BrandList.jsx";

const ManageBrand = () => {
    return (
        <div className="brand-container text-light">
            <div className="left-column">
                <BrandForm />
            </div>
            <div className="right-column">
                <BrandList />
            </div>
        </div>
    )
}

export default ManageBrand;