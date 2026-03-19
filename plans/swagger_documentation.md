# Documentación de API - Swagger

## URLs de Acceso

### Producción (Railway)
- **Swagger UI:** `https://lunariav2-production.up.railway.app/api/v1.0/swagger-ui/index.html`
- **Especificación JSON:** `https://lunariav2-production.up.railway.app/api/v1.0/v3/api-docs`

### Local (Desarrollo)
- **Swagger UI:** `http://localhost:9090/api/v1.0/swagger-ui/index.html`
- **Swagger UI (versión antigua):** `http://localhost:9090/api/v1.0/swagger-ui.html`
- **Especificación JSON:** `http://localhost:9090/api/v1.0/v3/api-docs`

## Información de la API

- **Título:** Lunaria API
- **Versión:** 1.0
- **Descripción:** API for Lunaria e-commerce platform - Complete REST API documentation for managing items, users, sales, favorites, and more.

## Autenticación

La API utiliza **JWT Bearer Token** para autenticación.

### Cómo usar:
1. En Swagger UI, haz clic en el botón **"Authorize"** (botón con candado)
2. Ingresa el token JWT en el formato: `Bearer <tu_token>`
3. Haz clic en "Authorize" y luego en "Close"
4. Ahora puedes probar los endpoints protegidos

## Alternativas

Si Swagger UI no carga correctamente, puedes usar:

1. **Swagger Editor online:**
   - Copia el contenido de `/v3/api-docs`
   - Ve a https://editor.swagger.io
   - Pega el JSON en el editor

2. **Visual Studio Code:**
   - Instala la extensión "OpenAPI"
   - Abre el archivo JSON de la especificación

## Endpoints disponibles

- `/api/v1.0/auth/**` - Autenticación (login, register)
- `/api/v1.0/categories` - Gestión de categorías
- `/api/v1.0/items` - Gestión de productos
- `/api/v1.0/sales` - Gestión de ventas
- `/api/v1.0/favorites` - Sistema de favoritos
- `/api/v1.0/dashboard` - Estadísticas del dashboard
- `/api/v1.0/users` - Gestión de usuarios
- `/api/v1.0/brands` - Gestión de marcas
- `/api/v1.0/stock` - Gestión de inventario
