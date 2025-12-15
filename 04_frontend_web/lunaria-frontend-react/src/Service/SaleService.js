import axios from "axios";

export const latestSales = async () => {
    return await axios.get("http://localhost:9090/api/v1.0/sales/latest", {headers: {'Authorization': `Bearer ${localStorage.getItem('token')}`}});
}

export const createSale = async (sale) => {
    return await axios.post("http://localhost:9090/api/v1.0/sales", sale, {headers: {'Authorization': `Bearer ${localStorage.getItem('token')}`}});
}

export const deleteSale = async (id) => {
    return await axios.delete(`http://localhost:9090/api/v1.0/sales/${id}`, {headers: {'Authorization': `Bearer ${localStorage.getItem('token')}`}});
}