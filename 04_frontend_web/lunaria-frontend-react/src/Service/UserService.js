import axios from "axios";
import { API_URLS } from "../api/config";

export const addUser = async (user) => {
   return await axios.post(API_URLS.auth.adminRegister, user, {headers: {'Authorization': `Bearer ${localStorage.getItem('token')}`}});
}

export const registerUser = async (user) => {
   return await axios.post(API_URLS.auth.register, user);
}

export const deleteUser = async (id) => {
    return await axios.delete(`${API_URLS.users}/${id}`, {headers: {'Authorization': `Bearer ${localStorage.getItem('token')}`}});
}

export const fetchUsers = async () => {
    return await axios.get(API_URLS.users, {headers: {'Authorization': `Bearer ${localStorage.getItem('token')}`}});
}