# MANUAL DE USUARIO
# Sistema Lunaria - Gestión de Inventario y Ventas

---

## ÍNDICE

1. Introducción
2. Primeros Pasos
3. Navegación
4. Gestión de Productos
5. Gestión de Ventas
6. Inventario
7. Dashboard
8. Favoritos
9. Recuperar Contraseña
10. Preguntas Frecuentes

---

## 1. INTRODUCCIÓN

### 1.1 ¿Qué es Lunaria?

Lunaria es un sistema de gestión de inventario y ventas diseñado para talleres mecánicos y tiendas de repuestos.

### 1.2 Requisitos

- Navegador web moderno (Chrome, Firefox, Edge)
- Conexión a Internet
- Cuenta de usuario registrada

### 1.3 Roles de Usuario

| Rol | Descripción |
|-----|-------------|
| Administrador | Acceso completo al sistema |
| Vendedor | Registro de ventas y consulta de inventario |

---

## 2. PRIMEROS PASOS

### 2.1 Acceder al Sistema

**Paso 1:** Abre tu navegador y escribe la URL:
```
https://lunaria-v2.vercel.app
```

**Paso 2:** Verás la pantalla de inicio de sesión

**Paso 3:** Ingresa tus credenciales:
- **Email:** admin@lunaria.com
- **Contraseña:** admin123

**Paso 4:** Haz clic en "Iniciar Sesión"

### 2.2 Cambiar Contraseña (Primer Uso)

⚠️ IMPORTANTE: Por seguridad, cambia tu contraseña después del primer login.

1. Haz clic en tu nombre en la esquina superior derecha
2. Selecciona "Perfil"
3. Ingresa tu contraseña actual
4. Ingresa tu nueva contraseña
5. Confirma la nueva contraseña
6. Haz clic en "Guardar"

---

## 3. NAVEGACIÓN

### 3.1 Estructura del Menú

```
┌────────────────────────────────────────────────────────┐
│  🔧 LUNARIA               [Usuario] [Cerrar Sesión]    │
├────────────────────────────────────────────────────────┤
│  🏠 Inicio                                             │
│  📦 Productos                                          │
│  🛒 Ventas     (Solo Admin)                            │
│  📊 Inventario (Solo Admin)                            │
│  ❤️ Favoritos  (Solo Usuario)                          │
│  👤 Usuarios (Solo Admin)                              │
└────────────────────────────────────────────────────────┘
```

### 3.2 Iconos y su Significado

| Icono | Significado |
|-------|-------------|
| 🔒 | Bloqueado/Privado |
| 🔓 | Desbloqueado/Público |
| ✅ | Completado/Éxito |
| ❌ | Error/Eliminado |
| ⚠️ | Advertencia |
| ⭐ | Favorito |

---

## 4. GESTIÓN DE PRODUCTOS

### 4.1 Ver Productos

**Paso 1:** Haz clic en "Productos" en el menú

**Paso 2:** Verás una lista con todos los productos

**Paso 3:** Puedes filtrar por:
- Nombre (buscador)
- Categoría
- Marca

**Paso 4:** Haz clic en un producto para ver sus detalles

### 4.2 Crear Nuevo Producto (Administrador)

**Paso 1:** Ve a "Productos"

**Paso 2:** Haz clic en "+ Nuevo Producto"

**Paso 3:** Completa el formulario:

| Campo | Descripción | Ejemplo |
|-------|-------------|---------|
| Nombre | Nombre del producto | Llanta Michelin 185/65R15 |
| Descripción | Detalles del producto | Neumático para sedan |
| Precio Venta | Precio al público | 250000 |
| Precio Instalación | Precio con instalación | 300000 |
| Precio Compra | Costo del producto | 180000 |
| Stock | Cantidad disponible | 20 |
| Categoría | Categoría del producto | Llantas |
| Marca | Marca del producto | Michelin |
| Imagen | Foto del producto | [Subir archivo] |

**Paso 4:** Haz clic en "Guardar"

**Resultado:** ✅ El producto aparece en la lista

### 4.3 Editar Producto (Administrador)

**Paso 1:** Ve a "Productos"

**Paso 2:** Busca el producto a editar

**Paso 3:** Haz clic en el botón de editar (lápiz)

**Paso 4:** Modifica los campos necesarios

**Paso 5:** Haz clic en "Guardar Cambios"

### 4.4 Eliminar Producto (Administrador)

**Paso 1:** Ve a "Productos"

**Paso 2:** Busca el producto a eliminar

**Paso 3:** Haz clic en el botón de eliminar (basura)

**Paso 4:** Confirma la eliminación

**Resultado:** ✅ El producto se elimina (soft delete)

### 4.5 Gestión de Categorías (Administrador)

**Paso 1:** Ve a "Productos"

**Paso 2:** Haz clic en "Categorías"

**Paso 3:** Puedes:
- Ver lista de categorías
- Crear nueva categoría
- Editar categoría
- Eliminar categoría (solo si no tiene productos)

### 4.6 Gestión de Marcas (Administrador)

**Paso 1:** Ve a "Productos"

**Paso 2:** Haz clic en "Marcas"

**Paso 3:** Puedes:
- Ver lista de marcas
- Crear nueva marca
- Editar marca
- Eliminar marca

---

## 5. GESTIÓN DE VENTAS

### 5.1 Registrar Nueva Venta

**Paso 1:** Haz clic en "Ventas" en el menú

**Paso 2:** Haz clic en "+ Nueva Venta"

**Paso 3:** Selecciona los productos:

| Campo | Acción |
|-------|--------|
| Producto | Busca y selecciona |
| Cantidad | Ingresa la cantidad |
| + | Agrega más productos |

**Paso 4:** Completa los datos del cliente:

| Campo | Descripción |
|-------|-------------|
| Nombre del Cliente | Nombre completo |
| Teléfono | Número de contacto |
| Método de Pago | Efectivo, Tarjeta, Transferencia |

**Paso 5:** Revisa el total

**Paso 6:** Haz clic en "Finalizar Venta"

**Resultado:** 
- ✅ Venta registrada
- ✅ Stock actualizado automáticamente
- ✅ Ticket generado

### 5.2 Ver Historial de Ventas

**Paso 1:** Ve a "Ventas"

**Paso 2:** Verás la lista de ventas

**Paso 3:** Puedes filtrar por:
- Fecha
- Cliente

**Paso 4:** Haz clic en una venta para ver los detalles

### 5.3 Ver Detalle de Venta

**Paso 1:** En la lista de ventas, haz clic en una venta

**Paso 2:** Verás:
- Número de venta
- Fecha y hora
- Cliente
- Productos vendidos
- Total
- Método de pago

---

## 6. INVENTARIO

### 6.1 Ver Stock

**Paso 1:** Haz clic en "Inventario" en el menú

**Paso 2:** Verás una tabla con:

| Campo | Descripción |
|-------|-------------|
| Producto | Nombre del producto |
| Stock Actual | Cantidad disponible |
| Estado | En Stock / Stock Bajo / Sin Stock |
| Último Movimiento | Fecha del último cambio |

### 6.2 Estados de Stock

| Estado | Significado | Color |
|--------|-------------|-------|
| En Stock | Más de 5 unidades | Verde |
| Stock Bajo | 1 a 5 unidades | Amarillo |
| Sin Stock | 0 unidades | Rojo |

### 6.3 Agregar Stock (Administrador)

**Paso 1:** Ve a "Inventario"

**Paso 2:** Busca el producto

**Paso 3:** Haz clic en "Agregar Stock"

**Paso 4:** Ingresa:
- Cantidad a agregar
- Nota (opcional)

**Paso 5:** Haz clic en "Confirmar"

**Resultado:** ✅ Stock incrementado

### 6.4 Historial de Movimientos

**Paso 1:** Ve a "Inventario"

**Paso 2:** Haz clic en "Historial"

**Paso 3:** Ver todas las entradas y salidas de inventario

---

## 7. DASHBOARD

### 7.1 Acceder al Dashboard

**Paso 1:** Haz clic en "Inicio" en el menú

**Paso 2:** Verás las estadísticas del día

### 7.2 Información del Dashboard

| Métrica | Descripción |
|---------|-------------|
| Ventas del Día | Número de ventas hoy |
| Total Recaudado | Dinero Collected hoy |
| Productos Vendidos | Cantidad de items vendidos |
| Productos en Stock | Total de productos disponibles |

### 7.3 Ventas Recientes

En el Dashboard también puedes ver:
- Las últimas 10 ventas del día
- Acceso rápido a detalles

---

## 8. FAVORITOS

### 8.1 Agregar Producto a Favoritos

**Paso 1:** Ve a "Productos" o "Explorar"

**Paso 2:** Busca el producto

**Paso 3:** Haz clic en el ícono de corazón (❤️)

**Resultado:** ✅ Producto agregado a favoritos

### 8.2 Ver Mis Favoritos

**Paso 1:** Haz clic en "Favoritos" en el menú

**Paso 2:** Verás todos tus productos guardados

### 8.3 Quitar de Favoritos

**Paso 1:** Ve a "Favoritos"

**Paso 2:** Haz clic en el corazón del producto

**Resultado:** ✅ Producto eliminado de favoritos

---

## 9. RECUPERAR CONTRASEÑA

### 9.1 ¿Olvidaste tu Contraseña?

**Paso 1:** En la página de login, haz clic en "¿Olvidaste tu contraseña?"

**Paso 2:** Ingresa tu email registrado

**Paso 3:** Haz clic en "Enviar Código"

**Paso 4:** Revisa tu email (bandeja o spam)

**Paso 5:** Copia el código OTP recibido

**Paso 6:** En el sistema, ingresa:
- El código OTP
- Tu nueva contraseña

**Paso 7:** Haz clic en "Restablecer"

**Resultado:** ✅ Contraseña actualizada

---

## 10. PREGUNTAS FRECUENTES

### 10.1 General

**¿Qué necesito para usar Lunaria?**
Solo un navegador web y conexión a Internet.

**¿Quién puede usar el sistema?**
Usuarios registrados por un administrador.

**¿Puedo acceder desde mi celular?**
Sí, el sistema es responsive y funciona en cualquier dispositivo.

### 10.2 Productos

**¿Cómo agrego una imagen al producto?**
En el formulario de producto, haz clic en "Subir imagen" y selecciona un archivo.

**¿Puedo tener varios precios?**
Sí, puedes configurar:
- Precio de venta
- Precio con instalación
- Precio de compra

**¿Qué pasa si elimino una categoría?**
Solo se puede eliminar si no tiene productos asociados.

### 10.3 Ventas

**¿Qué pasa con el stock al hacer una venta?**
El stock se descuenta automáticamente.

**¿Puedo hacer una venta sin stock suficiente?**
No, el sistema te mostrará un error.

**¿Se puede anular una venta?**
Por el momento,contacta al administrador.

### 10.4 Errores Comunes

**"Error de conexión"**
- Verifica tu conexión a Internet
- Intenta recargar la página

**"Sesión expirada"**
- Vuelve a iniciar sesión

**"Producto no encontrado"**
- Verifica que el producto esté activo
- Busca por otro criterio

---

## 11. SOPORTE

### 11.1 ¿Necesitas Ayuda?

Si tienes problemas:
1. Consulta este manual
2. Contacta al administrador
3. Revisa las preguntas frecuentes

### 11.2 Información del Sistema

| Campo | Valor |
|-------|-------|
| Versión | 2.0 |
| Fecha de publicación | Marzo 2026 |
| Soporte técnico | admin@lunaria.com |

---

**Versión del documento:** 1.0
**Fecha de creación:** Marzo 2026
**Sistema:** Lunaria v2.0
