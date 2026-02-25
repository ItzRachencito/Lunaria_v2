import axios from "axios";
import { API_URLS } from "../api/config";

export const addCategory = async (category) => {
    return await axios.post(`${API_URLS.base}/admin/categories`, category, {headers: {'Authorization': `Bearer ${localStorage.getItem('token')}`}});
}

export const updateCategory = async (categoryId, category) => {
    return await axios.put(`${API_URLS.base}/admin/categories/${categoryId}`, category, {headers: {'Authorization': `Bearer ${localStorage.getItem('token')}`}});
}

export const deleteCategory = async (categoryId) => {
    return await axios.delete(`${API_URLS.base}/admin/categories/${categoryId}`, {headers: {'Authorization': `Bearer ${localStorage.getItem('token')}`}});
}

export const fetchCategories = async () => {
    return await axios.get(API_URLS.categories, {headers: {'Authorization': `Bearer ${localStorage.getItem('token')}`}});
}