import axios from "axios";
import { API_URLS } from "../api/config";

export const addItem = async (item) => {
    return await axios.post(API_URLS.adminItems, item, {headers: {'Authorization': `Bearer ${localStorage.getItem('token')}`}});
}

export const updateItem = async (itemId, item) => {
    return await axios.put(`${API_URLS.adminItems}/${itemId}`, item, {headers: {'Authorization': `Bearer ${localStorage.getItem('token')}`}});
}

export const deleteItem = async (itemId) => {
    return await axios.delete(`${API_URLS.adminItems}/${itemId}`, {headers: {'Authorization': `Bearer ${localStorage.getItem('token')}`}});
}

export const fetchItems = async () => {
    return await axios.get(API_URLS.items, {headers: {'Authorization': `Bearer ${localStorage.getItem('token')}`}});
}