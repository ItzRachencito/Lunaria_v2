import axios from "axios";

const API_BASE_URL = "http://localhost:9090/api/v1.0";

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
        const response = await axios.post(`${API_BASE_URL}/favorites/${itemId}`, {}, getAuthHeaders());
        return response.data;
    } catch (error) {
        throw error.response?.data || error.message;
    }
};

export const removeFromFavorites = async (itemId) => {
    try {
        await axios.delete(`${API_BASE_URL}/favorites/${itemId}`, getAuthHeaders());
    } catch (error) {
        throw error.response?.data || error.message;
    }
};

export const getUserFavorites = async () => {
    try {
        const response = await axios.get(`${API_BASE_URL}/favorites`, getAuthHeaders());
        return response.data;
    } catch (error) {
        throw error.response?.data || error.message;
    }
};

export const checkFavoriteStatus = async (itemId) => {
    try {
        const response = await axios.get(`${API_BASE_URL}/favorites/${itemId}/status`, getAuthHeaders());
        return response.data.isFavorite;
    } catch (error) {
        throw error.response?.data || error.message;
    }
};