import {useState, useEffect} from "react";
import toast from "react-hot-toast";
import {useNavigate, useSearchParams} from "react-router-dom";
import {API_BASE_URL} from "../../api/config";
import "./ResetPassword.css";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:9090/api/v1.0";

const ResetPassword = () => {
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const email = searchParams.get("email") || "";
    
    const [loading, setLoading] = useState(false);
    const [passwordReset, setPasswordReset] = useState(false);
    const [otp, setOtp] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");

    useEffect(() => {
        if (!email) {
            toast.error("Correo electrónico no proporcionado");
            navigate("/forgot-password");
        }
    }, [email, navigate]);

    const onSubmitHandler = async (e) => {
        e.preventDefault();
        
        if (!otp.trim()) {
            toast.error("Por favor ingresa el código OTP");
            return;
        }

        if (otp.length !== 6) {
            toast.error("El código OTP debe tener 6 dígitos");
            return;
        }

        if (!newPassword) {
            toast.error("Por favor ingresa la nueva contraseña");
            return;
        }

        if (newPassword.length < 6) {
            toast.error("La contraseña debe tener al menos 6 caracteres");
            return;
        }

        if (newPassword !== confirmPassword) {
            toast.error("Las contraseñas no coinciden");
            return;
        }

        setLoading(true);
        try {
            const response = await fetch(`${API_BASE_URL}/password-reset/reset`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    email,
                    otp,
                    newPassword
                }),
            });

            const data = await response.json();

            if (data.success) {
                toast.success(data.message);
                setPasswordReset(true);
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

    const handleOtpChange = (e) => {
        const value = e.target.value.replace(/\D/g, "").slice(0, 6);
        setOtp(value);
    };

    if (passwordReset) {
        return (
            <div className="bg-light d-flex align-items-center justify-content-center vh-100 reset-password-background">
                <div className="card shadow-lg w-100" style={{maxWidth: '480px'}}>
                    <div className="card-body p-4">
                        <div className="text-center">
                            <div className="mb-3">
                                <span style={{fontSize: '64px'}}>🎉</span>
                            </div>
                            <h2 className="card-title">¡Contraseña Restablecida!</h2>
                            <p className="card-text text-muted">
                                Tu contraseña ha sido actualizada exitosamente.
                            </p>
                        </div>
                        
                        <div className="d-grid mt-4">
                            <button 
                                className="btn btn-dark btn-lg" 
                                onClick={() => navigate("/login")}
                            >
                                Iniciar sesión
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="bg-light d-flex align-items-center justify-content-center vh-100 reset-password-background">
            <div className="card shadow-lg w-100" style={{maxWidth: '480px'}}>
                <div className="card-body p-4">
                    <div className="text-center">
                        <h1 className="card-title">🔑 Nueva Contraseña</h1>
                        <p className="card-text text-muted">
                            Ingresa el código OTP que recibiste en tu correo y crea una nueva contraseña
                        </p>
                        {email && (
                            <p className="small text-muted">
                                Recuperando cuenta: <strong>{email}</strong>
                            </p>
                        )}
                    </div>
                    
                    <div className="mt-4">
                        <form onSubmit={onSubmitHandler}>
                            <div className="mb-3">
                                <label htmlFor="otp" className="form-label text-muted">
                                    Código OTP (6 dígitos)
                                </label>
                                <input 
                                    type="text" 
                                    name="otp" 
                                    id="otp" 
                                    placeholder="123456" 
                                    className="form-control text-center fs-4" 
                                    style={{letterSpacing: '8px'}}
                                    onChange={handleOtpChange}
                                    value={otp}
                                    maxLength={6}
                                    required
                                />
                                <div className="form-text text-center">
                                    Ingresa los 6 dígitos del código
                                </div>
                            </div>
                            
                            <div className="mb-3">
                                <label htmlFor="newPassword" className="form-label text-muted">
                                    Nueva Contraseña
                                </label>
                                <input 
                                    type="password" 
                                    name="newPassword" 
                                    id="newPassword" 
                                    placeholder="Mínimo 6 caracteres" 
                                    className="form-control" 
                                    onChange={(e) => setNewPassword(e.target.value)}
                                    value={newPassword}
                                    required
                                />
                            </div>
                            
                            <div className="mb-4">
                                <label htmlFor="confirmPassword" className="form-label text-muted">
                                    Confirmar Contraseña
                                </label>
                                <input 
                                    type="password" 
                                    name="confirmPassword" 
                                    id="confirmPassword" 
                                    placeholder="Repite la contraseña" 
                                    className="form-control" 
                                    onChange={(e) => setConfirmPassword(e.target.value)}
                                    value={confirmPassword}
                                    required
                                />
                            </div>
                            
                            <div className="d-grid">
                                <button 
                                    type="submit" 
                                    className="btn btn-dark btn-lg" 
                                    disabled={loading}
                                >
                                    {loading ? "Restableciendo..." : "Restablecer Contraseña"}
                                </button>
                            </div>
                        </form>
                    </div>
                    
                    <div className="text-center mt-3">
                        <button 
                            className="btn btn-link text-decoration-none" 
                            onClick={() => navigate("/forgot-password")}
                        >
                            ← Solicitar nuevo código
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ResetPassword;
