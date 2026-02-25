import axios from "axios";
import { API_URLS } from "../api/config";

export const login = async (data) => {
    return await axios.post(API_URLS.auth.login, data);
}