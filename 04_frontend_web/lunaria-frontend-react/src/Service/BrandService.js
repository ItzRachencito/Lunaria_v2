import axios from "axios";

export const addBrand = async (brand) => {
    return await axios.post('http://localhost:9090/api/v1.0/admin/brands', brand, {headers: {'Authorization': `Bearer ${localStorage.getItem('token')}`}});
}

export const updateBrand = async (brandId, brand) => {
    return await axios.put(`http://localhost:9090/api/v1.0/admin/brands/${brandId}`, brand, {headers: {'Authorization': `Bearer ${localStorage.getItem('token')}`}});
}

export const deleteBrand = async (brandId) => {
    return await axios.delete(`http://localhost:9090/api/v1.0/admin/brands/${brandId}`, {headers: {'Authorization': `Bearer ${localStorage.getItem('token')}`}});
}

export const fetchBrands = async () => {
    return await axios.get('http://localhost:9090/api/v1.0/brands', {headers: {'Authorization': `Bearer ${localStorage.getItem('token')}`}});
}