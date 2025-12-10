import {useContext, useState} from "react";
import toast from "react-hot-toast";
import {addBrand} from "../../Service/BrandService.js";
import {AppContext} from "../../context/AppContext.jsx";

const BrandForm = () => {
    const {setBrands, brands} = useContext(AppContext);
    const [loading, setLoading] = useState(false);

    const [data, setData] = useState({
        name: "",
        description: "",
    });

    const onChangeHandler = (e) => {
        const value = e.target.value;
        const name = e.target.name;
        setData((data) => ({...data, [name]: value}));
    }

    const onSubmitHandler = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            const response = await addBrand(data);
            if (response.status === 201) {
                setBrands([...brands, response.data]);
                toast.success("Brand added");
                setData({
                    name: "",
                    description: "",
                });
            }
        }catch(err) {
            console.error(err);
            toast.error("Error adding brand");
        }finally {
            setLoading(false);
        }
    }

    return (
        <div className="mx-2 mt-2">
            <div className="row">
                <div className="card col-md-12 form-container">
                    <div className="card-body">
                        <form onSubmit={onSubmitHandler}>
                            <div className="mb-3">
                                <label htmlFor="name" className="form-label">Nombre</label>
                                <input type="text"
                                    name="name"
                                    id="name"
                                    className="form-control"
                                    placeholder="Ingresa nombre de marca"
                                    onChange={onChangeHandler}
                                    value={data.name}
                                    required
                                />
                            </div>
                            <div className="mb-3">
                                <label htmlFor="description" className="form-label">Descripción</label>
                                <textarea
                                        rows="5"
                                        name="description"
                                        id="description"
                                        className="form-control"
                                        placeholder="Ingresa una descripción"
                                         onChange={onChangeHandler}
                                         value={data.description}
                                ></textarea>
                            </div>
                            <button type="submit"
                                    disabled={loading}
                                    className="btn btn-warning w-100">{loading ? "Cargando..." : "Hecho"}</button>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default BrandForm;