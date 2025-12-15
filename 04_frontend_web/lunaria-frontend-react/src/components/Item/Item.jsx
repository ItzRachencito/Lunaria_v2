import './Item.css';
import {useContext} from "react";
import {AppContext} from "../../context/AppContext.jsx";

const Item = ({itemName, itemPrice, itemImage, itemId, onItemClick}) => {
    const {addToCart, auth, addToFavorites, checkFavoriteStatus} = useContext(AppContext);
    const isAdmin = auth.role === 'ROLE_ADMIN';
    const handleAddToCart = (e) => {
        e.stopPropagation(); // Prevent triggering the card click
        addToCart({
            name: itemName,
            price: itemPrice,
            quantity: 1,
            itemId: itemId
        });
    }

    const handleAddToFavorites = async (e) => {
        e.stopPropagation(); // Prevent triggering the card click
        console.log('handleAddToFavorites called for itemId:', itemId);
        try {
            await addToFavorites(itemId);
        } catch (error) {
            console.error("Error adding to favorites:", error);
        }
    }

    const handleCardClick = () => {
        if (onItemClick) {
            onItemClick();
        }
    }

    return (
        <div className="p-3 bg-dark rounded shadow-sm h-100 d-flex align-items-center item-card" onClick={handleCardClick} style={{cursor: 'pointer'}}>
            <div style={{position: "relative", marginRight: "15px"}}>
                <img src={itemImage} alt={itemName} className="item-image" />
            </div>

            <div className="flex-grow-1 ms-2">
                <h6 className="mb-1.text-light">{itemName}</h6>
                <p className="mb-0 fw-bold text-light">${itemPrice}</p>
            </div>

            <div className="d-flex flex-column justify-content-between align-items-center ms-3"
                style={{height: "100%"}}>
                {isAdmin ? (
                    <>
                        <i className="bi bi-cart-plus fs-4 text-warning"></i>
                        <button className="btn btn-success btn-sm" onClick={handleAddToCart}>
                            <i className="bi bi-plus"></i>
                        </button>
                    </>
                ) : (
                    <>
                        <i
                            className="bi bi-heart fs-4 text-danger"
                            style={{cursor: 'pointer'}}
                            onClick={(e) => {
                                e.stopPropagation();
                                console.log('Heart icon clicked for item:', itemId);
                                handleAddToFavorites(e);
                            }}
                        ></i>
                        <button
                            className="btn btn-warning btn-sm"
                            onClick={(e) => {
                                console.log('Button clicked for item:', itemId);
                                handleAddToFavorites(e);
                            }}
                        >
                            <i className="bi bi-heart"></i>
                        </button>
                    </>
                )}
            </div>
        </div>
    )
}

export default Item;