// API Configuration - Uses environment variable in production
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:9090/api/v1.0';

export const API_URLS = {
    base: API_BASE_URL,
    auth: {
        login: `${API_BASE_URL}/login`,
        register: `${API_BASE_URL}/register`,
        adminRegister: `${API_BASE_URL}/admin/register`
    },
    users: `${API_BASE_URL}/admin/users`,
    categories: `${API_BASE_URL}/categories`,
    brands: `${API_BASE_URL}/brands`,
    items: `${API_BASE_URL}/items`,
    adminItems: `${API_BASE_URL}/admin/items`,
    sales: `${API_BASE_URL}/sales`,
    stock: {
        base: `${API_BASE_URL}/stock`,
        increase: (itemId) => `${API_BASE_URL}/stock/increase/${itemId}`,
        adjust: (itemId) => `${API_BASE_URL}/stock/adjust/${itemId}`,
        movements: (itemId) => `${API_BASE_URL}/stock/movements/${itemId}`,
        dashboard: `${API_BASE_URL}/stock/dashboard`
    },
    favorites: `${API_BASE_URL}/favorites`,
    dashboard: `${API_BASE_URL}/dashboard`,
    passwordReset: {
        request: `${API_BASE_URL}/password-reset/request`,
        reset: `${API_BASE_URL}/password-reset/reset`,
        resend: `${API_BASE_URL}/password-reset/resend`
    }
};

export default API_BASE_URL;
