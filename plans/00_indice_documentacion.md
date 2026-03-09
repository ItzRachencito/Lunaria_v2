# Índice de Documentación - Proyecto Lunaria v2

## 📚 Documentación Completa del Proyecto

Este documento sirve como índice centralizado para toda la documentación técnica del proyecto Lunaria.

---

## 1. Arquitectura del Sistema

**Archivo**: [`01_arquitectura_sistema.md`](01_arquitectura_sistema.md)

**Contenido**:
- Visión general del proyecto
- Tecnologías utilizadas
- Arquitectura del backend (Spring Boot)
- Arquitectura del frontend (React)
- Flujo de autenticación
- Diagrama de arquitectura general

---

## 2. Base de Datos

**Archivo**: [`02_base_de_datos.md`](02_base_de_datos.md)

**Contenido**:
- Modelo Entidad-Relación
- Tablas de la base de datos
  - `tbl_users` - Usuarios
  - `tbl_category` - Categorías
  - `tbl_brand` - Marcas
  - `tbl_items` - Productos
  - `tbl_sales` - Ventas
  - `tbl_sale_items` - Items de venta
  - `tbl_stock_movements` - Movimientos de inventario
  - `tbl_user_favorites` - Favoritos
- Índices y restricciones
- Scripts de inicialización

---

## 3. Backend Spring Boot

**Archivo**: [`03_backend_springboot.md`](03_backend_springboot.md)

**Contenido**:
- Estructura del proyecto
- Entidades JPA
- Controladores REST
- Servicios e implementaciones
- Repositorios
- Dependencias Maven
- Configuración de aplicación

---

## 4. Seguridad y Autenticación JWT

**Archivo**: [`04_seguridad_jwt.md`](04_seguridad_jwt.md)

**Contenido**:
- Flujo de autenticación JWT
- Configuración de Spring Security
- Reglas de autorización
- Roles y permisos (ROLE_ADMIN, ROLE_USER)
- Encriptación de contraseñas (BCrypt)
- Configuración CORS

---

## 5. Frontend React

**Archivo**: [`05_frontend_react.md`](05_frontend_react.md)

**Contenido**:
- Estructura del proyecto
- Componentes principales
- Páginas del sistema
- Servicios API
- Configuración de routing
- Context API (estado global)
- Variables de entorno

---

## 6. Despliegue

**Archivo**: [`06_despliegue.md`](06_despliegue.md)

**Contenido**:
- Arquitectura de despliegue
- Configuración de Railway (Backend)
- Configuración de Vercel (Frontend)
- Variables de entorno de producción
- URLs de producción
- Pasos de despliegue
- Mantenimiento y troubleshooting

---

## 📊 Resumen del Proyecto

### Tecnologías

| Capa | Tecnología | Versión |
|------|------------|---------|
| Backend | Spring Boot | 3.4.4 |
| Lenguaje | Java | 17 |
| Frontend | React | 19.0.0 |
| Build Tool | Vite | 6.2.0 |
| Base de Datos | MySQL | 8.0+ |
| Autenticación | JWT | 0.9.1 |
| Backend Cloud | Railway | - |
| Frontend Cloud | Vercel | - |

### Roles de Usuario

| Rol | Descripción |
|-----|-------------|
| `ROLE_ADMIN` | Administrador - Acceso completo |
| `ROLE_USER` | Usuario - Acceso limitado |

### Endpoints Principales

| Endpoint | Método | Descripción |
|----------|--------|-------------|
| `/api/v1.0/login` | POST | Autenticación |
| `/api/v1.0/register` | POST | Registro |
| `/api/v1.0/items` | GET | Listar productos |
| `/api/v1.0/sales` | POST | Crear venta |
| `/api/v1.0/dashboard` | GET | Estadísticas |
| `/api/v1.0/admin/**` | * | Endpoints de admin |

### URLs de Producción

| Servicio | URL |
|----------|-----|
| Frontend | `https://lunaria-v2.vercel.app` |
| Backend API | `https://lunariav2-production.up.railway.app/api/v1.0` |
| Swagger UI | `https://lunariav2-production.up.railway.app/api/v1.0/swagger-ui/index.html` |

---

## 📁 Estructura de Archivos

```
plans/
├── 00_indice_documentacion.md    # Este archivo
├── 01_arquitectura_sistema.md    # Arquitectura general
├── 02_base_de_datos.md          # Base de datos MySQL
├── 03_backend_springboot.md     # Backend Java
├── 04_seguridad_jwt.md          # Seguridad
├── 05_frontend_react.md         # Frontend React
└── 06_despliegue.md             # Despliegue en cloud
```

---

## 🔧 Ejecución Local

### Requisitos Previos
- Java 17+
- Node.js 18+
- MySQL 8.0+

### Backend
```bash
cd 03_backend/lunaria-backend-springboot
mvn spring-boot:run
```

### Frontend
```bash
cd 04_frontend_web/lunaria-frontend-react
npm install
npm run dev
```

---

*Documentación generada para el proyecto Lunaria v2*
*Última actualización: 2026*
