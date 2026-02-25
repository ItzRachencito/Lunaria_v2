import axios from "axios";
import { API_URLS } from "../api/config";

const getAuthHeaders = () => {
    const token = localStorage.getItem("token");
    return {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    };
};

export const addToFavorites = async (itemId) => {
    try {
        const response = await axios.post(`${API_URLS.favorites}/${itemId}`, {}, getAuthHeaders());
        return response.data;
    } catch (error) {
        console.log('FavoriteService addToFavorites error:', error);
        console.log('Error response:', error.response);
        console.log('Error response data:', error.response?.data);
        throw error.response?.data || error.message;
    }
};

export const removeFromFavorites = async (itemId) => {
    try {
        await axios.delete(`${API_URLS.favorites}/${itemId}`, getAuthHeaders());
    } catch (error) {
        throw error.response?.data || error.message;
    }
};

export const getUserFavorites = async () => {
    try {
        const response = await axios.get(API_URLS.favorites, getAuthHeaders());
        return response.data;
    } catch (error) {
        throw error.response?.data || error.message;
    }
};

export const checkFavoriteStatus = async (itemId) => {
    try {
        const response = await axios.get(`${API_URLS.favorites}/${itemId}/status`, getAuthHeaders());
        return response.data.isFavorite;
    } catch (error) {
        throw error.response?.data || error.message;
    }
};