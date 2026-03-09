# Requerimientos Funcionales - Proyecto Lunaria v2

## Formato: ID / Descripción / Prioridad

---

## Módulo: Autenticación y Gestión de Usuarios

| ID | Descripción | Prioridad |
|----|-------------|-----------|
| RF-01 | Iniciar sesión con email y contraseña, retornar token JWT | Alta |
| RF-02 | Registrar nuevos usuarios con rol por defecto (ROLE_USER) | Alta |
| RF-03 | Validar que el email no esté registrado previamente | Alta |
| RF-04 | Proteger rutas según rol del usuario autenticado | Alta |
| RF-05 | Listar todos los usuarios registrados (solo ADMIN) | Media |
| RF-06 | Eliminar usuarios del sistema (solo ADMIN) | Media |
| RF-07 | Modificar roles de usuarios (solo ADMIN) | Media |

---

## Módulo: Gestión de Productos

| ID | Descripción | Prioridad |
|----|-------------|-----------|
| RF-08 | Listar todos los productos disponibles con imagen, nombre, precio y stock | Alta |
| RF-09 | Buscar productos por nombre | Media |
| RF-10 | Crear nuevos productos con nombre, descripción, precio, stock, categoría y marca (opcional) | Alta |
| RF-11 | Subir imagen al crear un producto | Alta |
| RF-12 | Generar UUID único para cada producto | Alta |
| RF-13 | Editar datos de un producto existente (solo ADMIN) | Alta |
| RF-14 | Eliminar productos del catálogo (solo ADMIN) | Alta |
| RF-15 | Restringir eliminación si el producto está asociado a categoría activa | Baja |

---

## Módulo: Gestión de Categorías

| ID | Descripción | Prioridad |
|----|-------------|-----------|
| RF-16 | Listar todas las categorías disponibles | Alta |
| RF-17 | Crear categorías con nombre, descripción, imagen (opcional) y color de fondo | Alta |
| RF-18 | Editar datos de una categoría (solo ADMIN) | Alta |
| RF-19 | Eliminar categorías (solo ADMIN) | Alta |
| RF-20 | Restringir eliminación si la categoría tiene productos asociados | Baja |

---

## Módulo: Gestión de Marcas

| ID | Descripción | Prioridad |
|----|-------------|-----------|
| RF-21 | Listar todas las marcas disponibles | Alta |
| RF-22 | Crear marcas con nombre y descripción (solo ADMIN) | Alta |
| RF-23 | Editar datos de una marca (solo ADMIN) | Alta |
| RF-24 | Eliminar marcas (solo ADMIN) - productos quedan sin marca | Media |

---

## Módulo: Gestión de Inventario

| ID | Descripción | Prioridad |
|----|-------------|-----------|
| RF-25 | Consultar stock actual de cada producto | Alta |
| RF-26 | Mostrar estado del stock: IN_STOCK, LOW_STOCK, OUT_OF_STOCK | Alta |
| RF-27 | Agregar stock a un producto (solo ADMIN) | Alta |
| RF-28 | Registrar movimiento de stock con cantidad anterior, nueva, razón y usuario | Alta |
| RF-29 | Quitar/disminuir stock de un producto (solo ADMIN) | Alta |
| RF-30 | Ver historial de movimientos de inventario (solo ADMIN) | Media |

---

## Módulo: Punto de Venta (Ventas)

| ID | Descripción | Prioridad |
|----|-------------|-----------|
| RF-31 | Agregar productos al carrito de compras | Alta |
| RF-32 | Modificar cantidades de productos en el carrito | Alta |
| RF-33 | Eliminar productos del carrito | Alta |
| RF-34 | Calcular subtotal y total automáticamente en el carrito | Alta |
| RF-35 | Registrar venta con cliente (nombre y teléfono), productos y método de pago | Alta |
| RF-36 | Generar ID de venta único | Alta |
| RF-37 | Reducir stock automáticamente al realizar una venta | Alta |
| RF-38 | Listar historial de ventas | Alta |
| RF-39 | Eliminar venta y revertir stock (solo ADMIN) | Media |

---

## Módulo: Dashboard y Estadísticas

| ID | Descripción | Prioridad |
|----|-------------|-----------|
| RF-40 | Mostrar ventas del día actual | Alta |
| RF-41 | Mostrar cantidad de ventas del día | Alta |
| RF-42 | Mostrar lista de ventas más recientes | Alta |
| RF-43 | Cargar dashboard automáticamente al iniciar sesión | Alta |

---

## Módulo: Gestión de Favoritos

| ID | Descripción | Prioridad |
|----|-------------|-----------|
| RF-44 | Agregar productos a favoritos (usuarios autenticados) | Media |
| RF-45 | Evitar duplicados en favoritos | Baja |
| RF-46 | Ver lista de productos favoritos | Media |
| RF-47 | Eliminar productos de favoritos | Media |

---

## Módulo: Exploración de Productos

| ID | Descripción | Prioridad |
|----|-------------|-----------|
| RF-48 | Filtrar productos por categoría | Alta |
| RF-49 | Ver detalles de un producto (imagen, nombre, descripción, precio, stock) | Alta |

---

## Módulo: Gestión de Archivos

| ID | Descripción | Prioridad |
|----|-------------|-----------|
| RF-50 | Subir imágenes de productos en formatos JPG, PNG, WEBP | Alta |
| RF-51 | Almacenar imágenes localmente o en AWS S3 | Media |
| RF-52 | Generar URL pública para cada imagen | Alta |
| RF-53 | Subir imágenes para categorías | Media |

---

## Módulo: Seguridad

| ID | Descripción | Prioridad |
|----|-------------|-----------|
| RF-54 | Autenticación mediante tokens JWT | Alta |
| RF-55 | Expiración de tokens después de 10 horas | Alta |
| RF-56 | Encriptar contraseñas con BCrypt | Alta |
| RF-57 | Control de acceso según rol (ROLE_ADMIN, ROLE_USER) | Alta |
| RF-58 | Configuración CORS para permitir orígenes específicos | Alta |

---

## Módulo: API REST

| ID | Descripción | Prioridad |
|----|-------------|-----------|
| RF-59 | Documentación interactiva de API con Swagger | Media |
| RF-60 | Formato JSON en todas las respuestas | Alta |
| RF-61 | Fechas en formato ISO 8601 | Baja |

---

## Resumen por Prioridad

| Prioridad | Cantidad | Porcentaje |
|-----------|----------|-------------|
| **Alta** | 40 | 66% |
| **Media** | 16 | 26% |
| **Baja** | 5 | 8% |
| **Total** | 61 | 100% |

---

## Actores del Sistema

| Actor | Descripción |
|-------|-------------|
| **Invitado** | Usuario sin iniciar sesión - Puede ver productos, categorías y marcas |
| **Usuario (ROLE_USER)** | Cliente autenticado - Acceso a dashboard, exploración, favoritos y carrito |
| **Administrador (ROLE_ADMIN)** | Gestor del sistema - Acceso completo a todas las funciones |

---

*Documento de Requerimientos Funcionales - Proyecto Lunaria v2*
*Formato: ID / Descripción / Prioridad*
