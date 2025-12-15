import {useState} from "react";
import toast from "react-hot-toast";
import {registerUser} from "../../Service/UserService.js";
import {useNavigate} from "react-router-dom";

const Register = () => {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [data, setData] = useState({
        name: "",
        email: "",
        password: "",
        role: "ROLE_USER"
    });

    const onChangeHandler = (e) => {
        const name = e.target.name;
        const value = e.target.value;
        setData((data) => ({...data, [name]: value}));
    }

    const onSubmitHandler = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            const response = await registerUser(data);
            if (response.status === 201) {
                toast.success("Usuario registrado exitosamente");
                navigate("/login");
            }
        } catch (error) {
            // Extract specific error message from backend
            let errorMessage = "Error al registrar usuario";

            if (error?.response?.data?.message) {
                errorMessage = error.response.data.message;
            } else if (typeof error?.response?.data === 'string') {
                errorMessage = error.response.data;
            } else if (error?.message) {
                errorMessage = error.message;
            }

            // Show the backend error message directly
            toast.error(errorMessage);
        } finally {
            setLoading(false);
        }
    }

    return (
        <div className="bg-light d-flex align-items-center justify-content-center vh-100 login-background">
            <div className="card shadow-lg w-100" style={{maxWidth: '480px'}}>
                <div className="card-body">
                    <div className="text-center">
                        <h1 className="card-title">Crear Cuenta</h1>
                        <p className="card-text text-muted">
                            Regístrate para acceder a Lunaria
                        </p>
                    </div>
                    <div className="mt-4">
                        <form onSubmit={onSubmitHandler}>
                            <div className="mb-3">
                                <label htmlFor="name" className="form-label text-muted">
                                    Nombre Completo
                                </label>
                                <input type="text" name="name" id="name" placeholder="Tu nombre completo" className="form-control" onChange={onChangeHandler} value={data.name} required />
                            </div>
                            <div className="mb-3">
                                <label htmlFor="email" className="form-label text-muted">
                                    Correo Electrónico
                                </label>
                                <input type="email" name="email" id="email" placeholder="nombre-ejemplo123@lunaria.com" className="form-control" onChange={onChangeHandler} value={data.email} required />
                            </div>
                            <div className="mb-3">
                                <label htmlFor="password" className="form-label text-muted">
                                    Contraseña
                                </label>
                                <input type="password" name="password" id="password" placeholder="**********" className="form-control" onChange={onChangeHandler} value={data.password} required />
                            </div>
                            <div className="d-grid">
                                <button type="submit" className="btn btn-success btn-lg" disabled={loading}>
                                    {loading ? "Creando cuenta..." : "Crear Cuenta"}
                                </button>
                            </div>
                        </form>
                    </div>
                    <div className="text-center mt-3">
                        <p className="mb-0">
                            ¿Ya tienes cuenta?{" "}
                            <a href="#" onClick={() => navigate("/login")} className="text-decoration-none">
                                Inicia sesión
                            </a>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Register;