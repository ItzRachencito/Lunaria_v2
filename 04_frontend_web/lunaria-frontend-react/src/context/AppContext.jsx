import {createContext, useEffect, useState} from "react";
import {fetchCategories} from "../Service/CategoryService.js";
import {fetchBrands} from "../Service/BrandService.js";
import {fetchItems} from "../Service/ItemService.js";
import {addToFavorites as addToFavoritesAPI, removeFromFavorites as removeFromFavoritesAPI, getUserFavorites, checkFavoriteStatus as checkFavoriteStatusAPI} from "../Service/FavoriteService.js";
import toast from "react-hot-toast";

export const AppContext = createContext(null);

export const AppContextProvider = (props) => {

    const [categories, setCategories] = useState([]);
    const [brands, setBrands] = useState([]);
    const [itemsData, setItemsData] = useState([]);
    const [auth, setAuth] = useState({token: null, role: null});
    const [cartItems, setCartItems] = useState([]);
    const [favorites, setFavorites] = useState([]);
    const [favoriteStatuses, setFavoriteStatuses] = useState(new Map());

    const addToCart = (item) => {
        const existingItem = cartItems.find(cartItem => cartItem.name === item.name);
        if (existingItem) {
            setCartItems(cartItems.map(cartItem => cartItem.name === item.name ? {...cartItem, quantity: cartItem.quantity + 1} : cartItem));
        } else {
            setCartItems([...cartItems, {...item, quantity: 1}]);
        }
    }

    const removeFromCart = (itemId) => {
        setCartItems(cartItems.filter(item => item.itemId !== itemId));
    }

    const updateQuantity = (itemId, newQuantity) => {
        setCartItems(cartItems.map(item => item.itemId === itemId ? {...item, quantity: newQuantity} : item));
    }

    useEffect(() => {
        async function loadData() {
            if (localStorage.getItem("token") && localStorage.getItem("role")) {
                setAuthData(
                    localStorage.getItem("token"),
                    localStorage.getItem("role")
                );
            }
        }
        loadData();
    }, []);

    useEffect(() => {
        async function loadAuthenticatedData() {
            if (auth.token) {
                try {
                    const response = await fetchCategories();
                    const brandResponse = await fetchBrands();
                    const itemResponse = await fetchItems();
                    console.log('item response', itemResponse);
                    setCategories(response.data);
                    setBrands(brandResponse.data);
                    setItemsData(itemResponse.data);

                    // Load user favorites
                    await loadUserFavorites();
                } catch (error) {
                    console.error("Error loading authenticated data:", error);
                }
            } else {
                // Clear data when not authenticated
                setCategories([]);
                setBrands([]);
                setItemsData([]);
                setFavorites([]);
                setFavoriteStatuses(new Map());
            }
        }
        loadAuthenticatedData();
    }, [auth.token]);

    const setAuthData = (token, role) => {
        setAuth({token, role});
    }

    const clearCart = () => {
        setCartItems([]);
    }

    const addToFavorites = async (itemId) => {
        console.log('addToFavorites called with itemId:', itemId);
        try {
            const result = await addToFavoritesAPI(itemId);
            setFavoriteStatuses(prev => new Map(prev.set(itemId, true)));
            // Add the new favorite to the local favorites list
            setFavorites(prev => [...prev, result]);
            toast.success("Agregado a favoritos");
        } catch (error) {
            console.error("Error adding to favorites:", error);
            // Check if the error is because the product is already in favorites
            const errorMessage = error?.message || error?.response?.data?.message || String(error);
            if (errorMessage && errorMessage.includes("ya está en favoritos")) {
                toast("El producto ya está en tus favoritos", {
                    icon: 'ℹ️',
                    style: {
                        background: '#fef3c7',
                        color: '#92400e',
                        border: '1px solid #f59e0b'
                    }
                });
            } else {
                toast.error("Error al agregar a favoritos");
            }
            // Don't rethrow the error to prevent app crash
        }
    }

    const removeFromFavorites = async (itemId) => {
        try {
            await removeFromFavoritesAPI(itemId);
            setFavoriteStatuses(prev => new Map(prev.set(itemId, false)));
            // Remove the item from the local favorites list
            setFavorites(prev => prev.filter(fav => fav.itemId !== itemId));
            toast.success("Removido de favoritos");
        } catch (error) {
            toast.error("Error al remover de favoritos");
            console.error("Error removing from favorites:", error);
        }
    }

    const loadUserFavorites = async () => {
        try {
            const userFavorites = await getUserFavorites();
            setFavorites(userFavorites);

            // Update favorite statuses
            const statuses = new Map();
            userFavorites.forEach(fav => {
                statuses.set(fav.itemId, true);
            });
            setFavoriteStatuses(statuses);
        } catch (error) {
            console.error("Error loading favorites:", error);
        }
    }

    const checkFavoriteStatus = async (itemId) => {
        if (favoriteStatuses.has(itemId)) {
            return favoriteStatuses.get(itemId);
        }
        try {
            const isFavorite = await checkFavoriteStatusAPI(itemId);
            setFavoriteStatuses(prev => new Map(prev.set(itemId, isFavorite)));
            return isFavorite;
        } catch (error) {
            console.error("Error checking favorite status:", error);
            return false;
        }
    }

    const refreshItems = async () => {
        try {
            const itemResponse = await fetchItems();
            setItemsData(itemResponse.data);
        } catch (error) {
            console.error("Error refreshing items:", error);
            toast.error("Error updating item stock");
        }
    }

    const refreshBrands = async () => {
        try {
            const brandResponse = await fetchBrands();
            setBrands(brandResponse.data);
        } catch (error) {
            console.error("Error refreshing brands:", error);
            toast.error("Error updating brands");
        }
    }

    const contextValue = {
        categories,
        setCategories,
        brands,
        setBrands,
        auth,
        setAuthData,
        itemsData,
        setItemsData,
        addToCart,
        cartItems,
        removeFromCart,
        updateQuantity,
        clearCart,
        refreshItems,
        refreshBrands,
        favorites,
        addToFavorites,
        removeFromFavorites,
        loadUserFavorites,
        checkFavoriteStatus
    }

    return <AppContext.Provider value={contextValue}>
        {props.children}
    </AppContext.Provider>
}