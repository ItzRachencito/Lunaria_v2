import axios from "axios";
import { API_URLS } from "../api/config";

export const addBrand = async (brand) => {
    return await axios.post(`${API_URLS.base}/admin/brands`, brand, {headers: {'Authorization': `Bearer ${localStorage.getItem('token')}`}});
}

export const updateBrand = async (brandId, brand) => {
    return await axios.put(`${API_URLS.base}/admin/brands/${brandId}`, brand, {headers: {'Authorization': `Bearer ${localStorage.getItem('token')}`}});
}

export const deleteBrand = async (brandId) => {
    return await axios.delete(`${API_URLS.base}/admin/brands/${brandId}`, {headers: {'Authorization': `Bearer ${localStorage.getItem('token')}`}});
}

export const fetchBrands = async () => {
    return await axios.get(API_URLS.brands, {headers: {'Authorization': `Bearer ${localStorage.getItem('token')}`}});
}