import axios from "axios";
import { API_URLS } from "../api/config";

export const fetchDashboardData = async () => {
    return await axios.get(API_URLS.dashboard, {headers: {'Authorization': `Bearer ${localStorage.getItem("token")}`}});
}

