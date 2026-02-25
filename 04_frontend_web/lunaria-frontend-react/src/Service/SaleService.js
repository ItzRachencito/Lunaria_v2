import axios from "axios";
import { API_URLS } from "../api/config";

export const latestSales = async () => {
    return await axios.get(`${API_URLS.sales}/latest`, {headers: {'Authorization': `Bearer ${localStorage.getItem('token')}`}});
}

export const createSale = async (sale) => {
    return await axios.post(API_URLS.sales, sale, {headers: {'Authorization': `Bearer ${localStorage.getItem('token')}`}});
}

export const deleteSale = async (id) => {
    return await axios.delete(`${API_URLS.sales}/${id}`, {headers: {'Authorization': `Bearer ${localStorage.getItem('token')}`}});
}