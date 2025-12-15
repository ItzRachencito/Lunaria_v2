import { useContext } from "react";
import { AppContext } from "../../context/AppContext.jsx";
import './Favorites.css';

const Favorites = () => {
    const { favorites, removeFromFavorites } = useContext(AppContext);

    const handleRemoveFavorite = async (itemId) => {
        await removeFromFavorites(itemId);
    };

    return (
        <div className="favorites-container">
            <div className="container mt-4">
                <h2 className="mb-4 text-warning">
                    <i className="bi bi-heart-fill me-2"></i>
                    Mis Favoritos
                </h2>

                {favorites.length === 0 ? (
                    <div className="favorites-empty text-center py-5">
                        <i className="bi bi-heart display-1 text-muted mb-3"></i>
                        <h4 className="text-muted">No tienes productos favoritos</h4>
                        <p className="text-muted">Agrega productos a tus favoritos desde el catálogo</p>
                    </div>
                ) : (
                    <div className="favorites-grid row g-3">
                        {favorites.map((favorite) => (
                            <div key={favorite.id} className="col-md-4 col-sm-6">
                                <div className="card h-100 shadow-sm">
                                <div className="card-img-container">
                                    <img
                                        src={favorite.itemImgUrl}
                                        alt={favorite.itemName}
                                        className="card-img-top"
                                        style={{ height: '200px', objectFit: 'cover' }}
                                    />
                                    <button
                                        className="btn btn-danger btn-sm favorite-remove-btn"
                                        onClick={() => handleRemoveFavorite(favorite.itemId)}
                                        title="Remover de favoritos"
                                    >
                                        <i className="bi bi-heart-fill"></i>
                                    </button>
                                </div>
                                <div className="card-body d-flex flex-column">
                                    <h5 className="card-title text-warning">{favorite.itemName}</h5>
                                    {favorite.itemDescription && (
                                        <p className="card-text text-muted small">{favorite.itemDescription}</p>
                                    )}
                                    <div className="mt-auto">
                                        <small className="text-muted">
                                            Agregado: {new Date(favorite.addedAt).toLocaleDateString()}
                                        </small>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
            </div>
        </div>
    );
};

export default Favorites;