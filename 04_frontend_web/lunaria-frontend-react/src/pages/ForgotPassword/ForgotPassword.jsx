import {useState} from "react";
import toast from "react-hot-toast";
import {useNavigate} from "react-router-dom";
import {API_BASE_URL} from "../../api/config";
import "./ForgotPassword.css";

const ForgotPassword = () => {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [email, setEmail] = useState("");
    const [emailSent, setEmailSent] = useState(false);

    const onSubmitHandler = async (e) => {
        e.preventDefault();
        
        if (!email.trim()) {
            toast.error("Por favor ingresa tu correo electrónico");
            return;
        }

        setLoading(true);
        try {
            const response = await fetch(`${API_BASE_URL}/password-reset/request`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({email}),
            });

            const data = await response.json();

            if (data.success) {
                toast.success(data.message);
                setEmailSent(true);
            } else {
                toast.error(data.message);
            }
        } catch (error) {
            console.error(error);
            toast.error("Error al conectar con el servidor");
        } finally {
            setLoading(false);
        }
    };

    const resendOtp = async () => {
        setLoading(true);
        try {
            const response = await fetch(`${API_BASE_URL}/password-reset/resend`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({email}),
            });

            const data = await response.json();

            if (data.success) {
                toast.success(data.message);
            } else {
                toast.error(data.message);
            }
        } catch (error) {
            console.error(error);
            toast.error("Error al conectar con el servidor");
        } finally {
            setLoading(false);
        }
    };

    if (emailSent) {
        return (
            <div className="bg-light d-flex align-items-center justify-content-center vh-100 forgot-password-background">
                <div className="card shadow-lg w-100" style={{maxWidth: '480px'}}>
                    <div className="card-body p-4">
                        <div className="text-center">
                            <div className="mb-3">
                                <span style={{fontSize: '48px'}}>📧</span>
                            </div>
                            <h2 className="card-title">Revisa tu correo</h2>
                            <p className="card-text text-muted">
                                Hemos enviado un código OTP a<br/>
                                <strong>{email}</strong>
                            </p>
                        </div>
                        
                        <div className="alert alert-info mt-4">
                            <p className="mb-2">
                                <strong>¿No recibiste el código?</strong>
                            </p>
                            <p className="mb-0 small text-muted">
                                Revisa tu carpeta de spam o espera unos segundos antes de solicitar otro código.
                            </p>
                        </div>

                        <div className="d-grid gap-2 mt-4">
                            <button 
                                className="btn btn-primary btn-lg" 
                                onClick={() => navigate(`/reset-password?email=${encodeURIComponent(email)}`)}
                            >
                                Ingresar código OTP
                            </button>
                            <button 
                                className="btn btn-outline-secondary" 
                                onClick={resendOtp}
                                disabled={loading}
                            >
                                {loading ? "Enviando..." : "Reenviar código"}
                            </button>
                            <button 
                                className="btn btn-link" 
                                onClick={() => navigate("/login")}
                            >
                                ← Volver al login
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="bg-light d-flex align-items-center justify-content-center vh-100 forgot-password-background">
            <div className="card shadow-lg w-100" style={{maxWidth: '480px'}}>
                <div className="card-body p-4">
                    <div className="text-center">
                        <h1 className="card-title">🔐 Recuperar Contraseña</h1>
                        <p className="card-text text-muted">
                            Ingresa tu correo electrónico y te enviaremos un código OTP para recuperar tu cuenta
                        </p>
                    </div>
                    
                    <div className="mt-4">
                        <form onSubmit={onSubmitHandler}>
                            <div className="mb-4">
                                <label htmlFor="email" className="form-label text-muted">
                                    Correo Electrónico
                                </label>
                                <input 
                                    type="email" 
                                    name="email" 
                                    id="email" 
                                    placeholder="tu-correo@lunaria.com" 
                                    className="form-control" 
                                    onChange={(e) => setEmail(e.target.value)} 
                                    value={email}
                                    required
                                />
                            </div>
                            
                            <div className="d-grid">
                                <button 
                                    type="submit" 
                                    className="btn btn-dark btn-lg" 
                                    disabled={loading}
                                >
                                    {loading ? "Enviando..." : "Enviar código OTP"}
                                </button>
                            </div>
                        </form>
                    </div>
                    
                    <div className="text-center mt-3">
                        <button 
                            className="btn btn-link text-decoration-none" 
                            onClick={() => navigate("/login")}
                        >
                            ← Volver al login
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ForgotPassword;
