import axios from "axios";
import { API_URLS } from "../api/config";

export const increaseStock = async (itemId, quantity, reason, userName) => {
    return await axios.post(API_URLS.stock.increase(itemId),
        null,
        {
            params: { quantity, reason, userName },
            headers: {'Authorization': `Bearer ${localStorage.getItem('token')}`}
        });
};

export const adjustStock = async (itemId, newStock, reason, userName) => {
    return await axios.post(API_URLS.stock.adjust(itemId),
        null,
        {
            params: { newStock, reason, userName },
            headers: {'Authorization': `Bearer ${localStorage.getItem('token')}`}
        });
};

export const getStockMovements = async (itemId) => {
    return await axios.get(API_URLS.stock.movements(itemId),
        {headers: {'Authorization': `Bearer ${localStorage.getItem('token')}`}});
};

export const getStockDashboard = async () => {
    return await axios.get(API_URLS.stock.dashboard,
        {headers: {'Authorization': `Bearer ${localStorage.getItem('token')}`}});
};