# Documentación del Frontend Web - Lunaria

## 1. Visión General

El frontend web de Lunaria está desarrollado con **React 19** utilizando **Vite** como herramienta de build. Proporciona una interfaz de usuario moderna para gestionar el inventario y realizar ventas.

### 1.1 Configuración del Proyecto

| Parámetro | Valor |
|-----------|-------|
| Framework | React |
| Versión | 19.0.0 |
| Build Tool | Vite 6.2.0 |
| Routing | React Router DOM 7.4.1 |
| HTTP Client | Axios 1.8.4 |
| CSS Framework | Bootstrap 5.3.3 |
| Icons | Bootstrap Icons 1.11.3 |

---

## 2. Estructura del Proyecto

### 2.1 Árbol de Directorios

```
src/
├── App.jsx                      # Componente principal
├── App.css                      # Estilos globales
├── main.jsx                     # Punto de entrada
├── index.css                    # Estilos globales
├── api/
│   └── config.js               # Configuración de API
├── assets/                     # Recursos estáticos
│   ├── assets.js
│   ├── logo.png
│   ├── login-bg.jpg
│   └── ...
├── components/                 # Componentes reutilizables
│   ├── BrandForm/
│   ├── BrandList/
│   ├── CartItems/
│   ├── CartSummary/
│   ├── Category/
│   ├── CategoryForm/
│   ├── CategoryList/
│   ├── CustomerForm/
│   ├── DisplayCategory/
│   ├── DisplayItems/
│   ├── Item/
│   ├── ItemForm/
│   ├── ItemList/
│   ├── Menubar/
│   ├── ReceiptPopup/
│   ├── SearchBox/
│   ├── UserForm/
│   └── UsersList/
├── context/
│   └── AppContext.jsx          # Estado global
├── pages/                      # Páginas principales
│   ├── Dashboard/
│   ├── Explore/
│   ├── Favorites/
│   ├── Login/
│   ├── ManageBrand/
│   ├── ManageCategory/
│   ├── ManageItems/
│   ├── ManageStock/
│   ├── ManageUsers/
│   ├── NotFound/
│   ├── Register/
│   ├── SaleHistory/
│   └── ...
└── Service/                    # Servicios API
    ├── AuthService.js
    ├── BrandService.js
    ├── CategoryService.js
    ├── Dashboard.js
    ├── FavoriteService.js
    ├── ItemService.js
    ├── SaleService.js
    ├── StockService.js
    └── UserService.js
```

---

## 3. Componentes Principales

### 3.1 App.jsx (Router Principal)

Maneja el enrutamiento y la protección de rutas.

```jsx
const App = () => {
    const {auth} = useContext(AppContext);

    // Ruta de login - redirige si ya está autenticado
    const LoginRoute = ({element}) => {
        if(auth.token) {
            return <Navigate to="/dashboard" replace />;
        }
        return element;
    }

    // Ruta protegida - verifica autenticación y rol
    const ProtectedRoute = ({element, allowedRoles}) => {
        if (!auth.token) {
            return <Navigate to="/login" replace />;
        }
        if (allowedRoles && !allowedRoles.includes(auth.role)) {
            return <Navigate to="/dashboard" replace />;
        }
        return element;
    }

    return (
        <Routes>
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/explore" element={<Explore />} />
            <Route path="/favorites" element={<ProtectedRoute element={<Favorites />} allowedRoles={['ROLE_USER']} />} />
            
            {/* Rutas solo Admin */}
            <Route path="/category" element={<ProtectedRoute element={<ManageCategory />} allowedRoles={['ROLE_ADMIN']} />} />
            <Route path="/brand" element={<ProtectedRoute element={<ManageBrand />} allowedRoles={['ROLE_ADMIN']} />} />
            <Route path="/users" element={<ProtectedRoute element={<ManageUsers />} allowedRoles={["ROLE_ADMIN"]} />} />
            <Route path="/items" element={<ProtectedRoute element={<ManageItems />} allowedRoles={["ROLE_ADMIN"]} />} />
            <Route path="/stock" element={<ProtectedRoute element={<ManageStock />} allowedRoles={["ROLE_ADMIN"]} />} />
            
            {/* Rutas públicas */}
            <Route path="/login" element={<LoginRoute element={<Login />} />} />
            <Route path="/register" element={<LoginRoute element={<Register />} />} />
            <Route path="*" element={<NotFound />} />
        </Routes>
    );
}
```

---

### 3.2 AppContext.jsx (Estado Global)

Proveedor de contexto para el estado global de la aplicación.

```jsx
export const AppContextProvider = (props) => {
    // Estado global
    const [categories, setCategories] = useState([]);
    const [brands, setBrands] = useState([]);
    const [itemsData, setItemsData] = useState([]);
    const [auth, setAuth] = useState({token: null, role: null});
    const [cartItems, setCartItems] = useState([]);
    const [favorites, setFavorites] = useState([]);

    // Funciones del carrito
    const addToCart = (item) => {...}
    const removeFromCart = (itemId) => {...}
    const updateQuantity = (itemId, newQuantity) => {...}
    const clearCart = () => {...}

    // Funciones de favoritos
    const addToFavorites = async (itemId) => {...}
    const removeFromFavorites = async (itemId) => {...}

    // Carga de datos al iniciar
    useEffect(() => {
        if (localStorage.getItem("token") && localStorage.getItem("role")) {
            setAuthData(localStorage.getItem("token"), localStorage.getItem("role"));
        }
    }, []);

    return <AppContext.Provider value={contextValue}>
        {props.children}
    </AppContext.Provider>
}
```

---

## 4. Páginas del Sistema

### 4.1 Dashboard

Página principal que muestra estadísticas.

**Ruta**: `/dashboard`  
**Acceso**: USER, ADMIN

```jsx
// Componentes:
// - Dashboard.css (estilos)
// - Dashboard.jsx
```

**Funcionalidades:**
- Ventas del día
- Cantidad de ventas del día
- Lista de ventas recientes

---

### 4.2 Explore

Página de exploración de productos para clientes.

**Ruta**: `/explore`  
**Acceso**: USER, ADMIN

**Funcionalidades:**
- Visualización de productos por categoría
- Carrito de compras
- Agregar a favoritos

---

### 4.3 ManageCategory

Gestión de categorías (solo ADMIN).

**Ruta**: `/category`  
**Acceso**: ADMIN

**Funcionalidades:**
- Crear categoría
- Editar categoría
- Eliminar categoría

---

### 4.4 ManageBrand

Gestión de marcas (solo ADMIN).

**Ruta**: `/brand`  
**Acceso**: ADMIN

---

### 4.5 ManageItems

Gestión de productos (solo ADMIN).

**Ruta**: `/items`  
**Acceso**: ADMIN

**Funcionalidades:**
- Crear producto con imagen
- Editar producto
- Eliminar producto

---

### 4.6 ManageStock

Gestión de inventario (solo ADMIN).

**Ruta**: `/stock`  
**Acceso**: ADMIN

---

### 4.7 ManageUsers

Gestión de usuarios (solo ADMIN).

**Ruta**: `/users`  
**Acceso**: ADMIN

---

### 4.8 SaleHistory

Historial de ventas (solo ADMIN).

**Ruta**: `/ventas`  
**Acceso**: ADMIN

---

### 4.9 Favorites

Productos favoritos del usuario.

**Ruta**: `/favorites`  
**Acceso**: USER, ADMIN

---

### 4.10 Login / Register

Páginas de autenticación.

**Rutas**: `/login`, `/register`  
**Acceso**: Público

---

## 5. Servicios API

### 5.1 Configuración de API

```javascript
// src/api/config.js
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:9090/api/v1.0';

export const API_URLS = {
    base: API_BASE_URL,
    auth: {
        login: `${API_BASE_URL}/login`,
        register: `${API_BASE_URL}/register`,
    },
    categories: `${API_BASE_URL}/categories`,
    brands: `${API_BASE_URL}/brands`,
    items: `${API_BASE_URL}/items`,
    adminItems: `${API_BASE_URL}/admin/items`,
    sales: `${API_BASE_URL}/sales`,
    favorites: `${API_BASE_URL}/favorites`,
    dashboard: `${API_BASE_URL}/dashboard`
};
```

### 5.2 Ejemplo de Servicio

```javascript
// src/Service/AuthService.js
import axios from "axios";
import { API_URLS } from "../api/config";

export const login = async (data) => {
    return await axios.post(API_URLS.auth.login, data);
}
```

---

## 6. Configuración de Variables

### 6.1 Variables de Entorno

| Variable | Descripción | Valor por defecto |
|----------|-------------|-------------------|
| `VITE_API_URL` | URL del backend | `http://localhost:9090/api/v1.0` |

### 6.2 Production (.env.production)

```
VITE_API_URL=https://lunariav2-production.up.railway.app/api/v1.0
```

---

## 7. Routing y Protección de Rutas

### 7.1 Rutas Públicas

| Ruta | Componente | Descripción |
|------|------------|-------------|
| `/login` | Login | Página de inicio de sesión |
| `/register` | Register | Página de registro |

### 7.2 Rutas Protegidas (USER/ADMIN)

| Ruta | Componente | Roles |
|------|------------|-------|
| `/dashboard` | Dashboard | USER, ADMIN |
| `/explore` | Explore | USER, ADMIN |
| `/favorites` | Favorites | USER, ADMIN |

### 7.3 Rutas Solo ADMIN

| Ruta | Componente |
|------|------------|
| `/category` | ManageCategory |
| `/brand` | ManageBrand |
| `/users` | ManageUsers |
| `/items` | ManageItems |
| `/stock` | ManageStock |
| `/ventas` | SaleHistory |

---

## 8. Integración con Backend

### 8.1 Headers de Autenticación

```javascript
// Configuración de axios con interceptor
axios.interceptors.request.use((config) => {
    const token = localStorage.getItem("token");
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});
```

---

## 9. Tecnologías y Dependencias

### 9.1 Dependencies

```json
{
    "dependencies": {
        "axios": "^1.8.4",
        "bootstrap": "^5.3.3",
        "bootstrap-icons": "^1.11.3",
        "react": "^19.0.0",
        "react-dom": "^19.0.0",
        "react-hot-toast": "^2.5.2",
        "react-router-dom": "^7.4.1"
    }
}
```

### 9.2 DevDependencies

```json
{
    "devDependencies": {
        "@eslint/js": "^9.21.0",
        "@types/react": "^19.0.10",
        "@types/react-dom": "^19.0.4",
        "@vitejs/plugin-react": "^4.3.4",
        "eslint": "^9.21.0",
        "eslint-plugin-react-hooks": "^5.1.0",
        "eslint-plugin-react-refresh": "^0.4.19",
        "globals": "^15.15.0",
        "vite": "^6.2.0"
    }
}
```

---

## 10. Scripts Disponibles

```json
{
    "scripts": {
        "dev": "vite",           // Iniciar servidor de desarrollo
        "build": "vite build",   // Compilar para producción
        "lint": "eslint .",     // Verificar código
        "preview": "vite preview" // Vista previa de build
    }
}
```

---

## 11. Configuración Vite

```javascript
// vite.config.js
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
})
```

---

## 12. Configuración Vercel

```json
// vercel.json
{
    "rewrites": [
        { "source": "/(.*)", "destination": "/index.html" }
    ]
}
```

---

*Documento generado para el proyecto Lunaria v2*
*Frontend: React 19 + Vite + Bootstrap*
