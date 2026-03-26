# MANUAL DE USUARIO - ADMINISTRADOR
## Sistema de Gestión de Inventarios LUNARIA

---

## 1. INTRODUCCIÓN

### 1.1 Propósito del Manual
Este manual tiene como objetivo proporcionar una guía completa y detallada para los administradores del sistema LUNARIA. Aquí encontrarás todas las instrucciones necesarias para gestionar productos, categorías, marcas, ventas, inventario y usuarios de la plataforma.

### 1.2 Alcance del Sistema
Como administrador, tendrás acceso completo a todas las funcionalidades del sistema, incluyendo:
- Gestión de productos (CRUD completo)
- Gestión de categorías y marcas
- Control de inventario y stock
- Registro y gestión de ventas
- Dashboard con estadísticas
- Gestión de usuarios
- Configuración del sistema

### 1.3 Roles y Permisos
| Rol | Descripción |
|-----|-------------|
| **ADMIN** | Acceso completo a todas las funcionalidades del sistema |
| USER | Acceso limitado a funcionalidades de consulta y compra |

---

## 2. ACCESO AL SISTEMA

### 2.1 Requisitos Previos
- Cuenta de usuario con rol ADMIN
- Navegador web actualizado (Chrome, Firefox, Edge)
- Conexión a Internet

### 2.2 Iniciar Sesión (Web)

**Paso 1:** Abre tu navegador y accede a la URL de la aplicación:
```
https://lunaria-web.vercel.app
```

**Paso 2:** En la página de inicio, ingresa tus credenciales:
- **Usuario:** Tu correo electrónico registrado
- **Contraseña:** Tu contraseña personal

**Paso 3:** Haz clic en el botón **"Iniciar Sesión"**

**[INSERTAR IMAGEN: Pantalla de login web]**

### 2.3 Iniciar Sesión (Móvil)

**Paso 1:** Abre la aplicación LUNARIA en tu dispositivo Android

**Paso 2:** Ingresa tu correo electrónico y contraseña

**Paso 3:** Toca el botón **"Iniciar Sesión"**

**[INSERTAR IMAGEN: Pantalla de login móvil]**

### 2.4 Recuperar Contraseña

Si olvidaste tu contraseña:

1. En la pantalla de login, haz clic en **"¿Olvidaste tu contraseña?"**
2. Ingresa tu correo electrónico registrado
3. Haz clic en **"Enviar código de recuperación"**
4. Revisa tu correo electrónico (incluye spam)
5. Ingresa el código OTP de 6 dígitos recibido
6. Crea una nueva contraseña
7. Confirma la nueva contraseña
8. Haz clic en **"Restablecer Contraseña"**

**[INSERTAR IMAGEN: Pantalla de recuperación de contraseña]**

---

## 3. INTERFAZ DE ADMINISTRADOR

### 3.1 Dashboard Principal

Al iniciar sesión como administrador, verás el Dashboard con estadísticas generales.

**[INSERTAR IMAGEN: Dashboard de administrador]**

#### 3.1.1 Estadísticas del Dashboard

| Widget | Descripción |
|--------|-------------|
| **Total Productos** | Cantidad de productos registrados |
| **Ventas del Día** | Número de ventas realizadas hoy |
| **Ingresos del Día** | Total de dinero generado hoy |
| **Usuarios Activos** | Usuarios registrados en el sistema |

**Paso a paso para ver detalles:**
1. Haz clic sobre cualquier tarjeta de estadísticas
2. Se abrirá una vista detallada con gráficos
3. Puedes filtrar por rango de fechas

**[INSERTAR IMAGEN: Detalle de estadísticas]**

---

## 4. GESTIÓN DE PRODUCTOS

### 4.1 Listar Productos

**Paso 1:** En el menú lateral, haz clic en **"Productos"**

**[INSERTAR IMAGEN: Menú Productos]**

**Paso 2:** Se mostrará la lista de todos los productos registrados

| Campo | Descripción |
|-------|-------------|
| Imagen | Foto del producto |
| Nombre | Denominación del producto |
| Marca | Fabricante del producto |
| Categoría | Clasificación del producto |
| Precio | Valor de venta al público |
| Stock | Cantidad disponible |

**[INSERTAR IMAGEN: Lista de productos]**

### 4.2 Buscar Productos

**Paso 1:** En la barra de búsqueda, ingresa el nombre, marca o categoría

**Paso 2:** Los resultados se filtrarán automáticamente en tiempo real

**[INSERTAR IMAGEN: Búsqueda de productos]**

### 4.3 Filtrar por Categoría

**Paso 1:** Haz clic en el dropdown de categorías

**Paso 2:** Selecciona la categoría deseada

**Paso 3:** La lista se actualizará mostrando solo productos de esa categoría

**[INSERTAR IMAGEN: Filtro de categorías]**

### 4.4 Crear Nuevo Producto

**Paso 1:** En la página de productos, haz clic en el botón **"+ Nuevo Producto"**

**[INSERTAR IMAGEN: Botón nuevo producto]**

**Paso 2:** Completa el formulario con la información del producto:

| Campo | Descripción | Obligatorio |
|-------|-------------|-------------|
| **Nombre** | Nombre del producto | Sí |
| **Descripción** | Detalles del producto | Sí |
| **Categoría** | Clasificación del producto | Sí |
| **Marca** | Fabricante (opcional) | No |
| **Precio de Compra** | Costo de adquisición | Sí |
| **Precio de Venta** | Valor al público | Sí |
| **Precio de Instalación** | Costo extra instalación (opcional) | No |
| **Stock Inicial** | Cantidad inicial | Sí |
| **Imagen** | Foto del producto | No |

**Paso 3:** Para agregar una imagen:
- Haz clic en el área de "Subir imagen"
- Selecciona el archivo desde tu computadora
- Formatos aceptados: JPG, PNG, WebP

**Paso 4:** Haz clic en **"Guardar Producto"**

**[INSERTAR IMAGEN: Formulario crear producto]**

### 4.5 Editar Producto

**Paso 1:** En la lista de productos, busca el producto a modificar

**Paso 2:** Haz clic en el icono de **editar** (lápaz) junto al producto

**[INSERTAR IMAGEN: Icono editar]**

**Paso 3:** Se abrirá el formulario con los datos actuales

**Paso 4:** Modifica los campos necesarios

**Paso 5:** Haz clic en **"Guardar Cambios"**

**[INSERTAR IMAGEN: Formulario editar producto]**

### 4.6 Eliminar Producto

**Paso 1:** En la lista de productos, busca el producto a eliminar

**Paso 2:** Haz clic en el icono de **eliminar** (basura)

**[INSERTAR IMAGEN: Icono eliminar]**

**Paso 3:** Aparecerá una alerta de confirmación:
> "¿Estás seguro de eliminar este producto? Esta acción no se puede deshacer."

**Paso 4:** Haz clic en **"Confirmar"** para eliminar o **"Cancelar"** para abortar

**[INSERTAR IMAGEN: Alerta confirmación]**

---

## 5. GESTIÓN DE CATEGORÍAS

### 5.1 Listar Categorías

**Paso 1:** En el menú lateral, haz clic en **"Categorías"**

**[INSERTAR IMAGEN: Menú Categorías]**

**Paso 2:** Se mostrarán todas las categorías existentes con su imagen, nombre y cantidad de productos

**[INSERTAR IMAGEN: Lista de categorías]**

### 5.2 Crear Nueva Categoría

**Paso 1:** En la página de categorías, haz clic en **"+ Nueva Categoría"**

**Paso 2:** Completa el formulario:

| Campo | Descripción | Obligatorio |
|-------|-------------|-------------|
| **Nombre** | Nombre de la categoría | Sí |
| **Descripción** | Detalles de la categoría | No |
| **Color** | Color hexadecimal para identificar la categoría | Sí |
| **Imagen** | Imagen representativa | No |

**Paso 3:** Haz clic en **"Guardar Categoría"**

**[INSERTAR IMAGEN: Formulario crear categoría]**

### 5.3 Editar Categoría

**Paso 1:** En la lista de categorías, haz clic en el icono de editar

**Paso 2:** Modifica los campos deseados

**Paso 3:** Haz clic en **"Guardar Cambios"**

**[INSERTAR IMAGEN: Editar categoría]**

### 5.4 Eliminar Categoría

**Paso 1:** Haz clic en el icono de eliminar

**Paso 2:** Confirma la eliminación en la alerta

> **Nota:** No puedes eliminar categorías que tengan productos asociados

**[INSERTAR IMAGEN: Alerta categoría con productos]**

---

## 6. GESTIÓN DE MARCAS

### 6.1 Listar Marcas

**Paso 1:** En el menú lateral, haz clic en **"Marcas"**

**[INSERTAR IMAGEN: Menú Marcas]**

### 6.2 Crear Nueva Marca

**Paso 1:** Haz clic en **"+ Nueva Marca"**

**Paso 2:** Ingresa el nombre de la marca

**Paso 3:** Haz clic en **"Guardar"**

**[INSERTAR IMAGEN: Formulario crear marca]**

### 6.3 Eliminar Marca

**Paso 1:** Haz clic en el icono de eliminar

**Paso 2:** Confirma la acción

---

## 7. GESTIÓN DE VENTAS

### 7.1 Registro de Ventas (Catálogo)

**Paso 1:** En el menú, haz clic en **"Catálogo"**

**[INSERTAR IMAGEN: Menú Catálogo]**

**Paso 2:** Se abrirá la pantalla de ventas con tres secciones:
- **Datos del cliente** (formulario)
- **Búsqueda y filtros** de productos
- **Lista de productos** disponibles

**[INSERTAR IMAGEN: Pantalla catálogo]**

### 7.2 Registrar Datos del Cliente

**Paso 1:** Completa los campos del formulario:

| Campo | Descripción |
|-------|-------------|
| **Nombre del cliente** | Nombre completo del comprador |
| **Teléfono** | Número de contacto (10 dígitos) |

**Paso 2:** El total se calculará automáticamente según los productos agregados

**[INSERTAR IMAGEN: Formulario datos cliente]**

### 7.3 Agregar Productos al Carrito

**Paso 1:** Busca el producto deseado usando:
- La barra de búsqueda (por nombre, marca o categoría)
- El filtro de categorías

**Paso 2:** Toca o haz clic en el producto deseado

**Paso 3:** El producto se agregará al carrito automáticamente

**Paso 4:** Verás una notificación de confirmación

**[INSERTAR IMAGEN: Producto agregado]**

### 7.4 Ver Carrito

**Paso 1:** En la sección "Productos en el carrito", puedes ver:
- Los productos agregados
- La cantidad de cada uno
- El precio unitario
- El total de la compra

**Paso 2:** Puedes modificar las cantidades directamente o eliminar productos

**[INSERTAR IMAGEN: Carrito de compras]**

### 7.5 Completar Venta

**Paso 1:** Asegúrate de que:
- Los datos del cliente estén completos
- El carrito tenga al menos un producto

**Paso 2:** Haz clic en el botón **"Recibir Pago"**

**[INSERTAR IMAGEN: Botón recibir pago]**

**Paso 3:** Se procesará la venta y verás el comprobante

**Paso 4:** Puedes hacer clic en **"Ver Comprobante"** para detalles

**[INSERTAR IMAGEN: Comprobante de venta]**

### 7.6 Historial de Ventas

**Paso 1:** En el menú, haz clic en **"Historial de Ventas"**

**[INSERTAR IMAGEN: Menú Historial]**

**Paso 2:** Verás la lista de todas las ventas realizadas

| Campo | Descripción |
|-------|-------------|
| ID | Número único de venta |
| Cliente | Nombre del comprador |
| Fecha | Fecha y hora de la venta |
| Total | Valor total de la venta |
| Estado | Estado de la transacción |

**[INSERTAR IMAGEN: Lista historial ventas]**

**Paso 3:** Haz clic en una venta para ver los detalles

**[INSERTAR IMAGEN: Detalle de venta]**

---

## 8. CONTROL DE INVENTARIO

### 8.1 Movimientos de Stock

**Paso 1:** En el menú, haz clic en **"Inventario"**

**[INSERTAR IMAGEN: Menú Inventario]**

**Paso 2:** Verás el historial de todos los movimientos de stock

| Tipo de Movimiento | Descripción |
|-------------------|-------------|
| **ENTRADA** | Productos ingresados al inventario |
| **SALIDA** | Productos vendidos |
| **AJUSTE** | Correcciones de inventario |

**[INSERTAR IMAGEN: Historial movimientos]**

### 8.2 Registrar Entrada de Productos

**Paso 1:** Haz clic en **"+ Nueva Entrada"**

**Paso 2:** Selecciona los productos y cantidad a ingresar

**Paso 3:** Agrega una nota de referencia (opcional)

**Paso 4:** Confirma la entrada

**[INSERTAR IMAGEN: Registrar entrada]**

### 8.3 Ajustes de Inventario

**Paso 1:** Busca el producto a ajustar

**Paso 2:** Indica la cantidad real en sistema

**Paso 3:** El sistema mostrará la diferencia

**Paso 4:** Confirma el ajuste

---

## 9. GESTIÓN DE USUARIOS

### 9.1 Listar Usuarios

**Paso 1:** En el menú, haz clic en **"Usuarios"**

**[INSERTAR IMAGEN: Menú Usuarios]**

**Paso 2:** Verás la lista de todos los usuarios registrados

| Campo | Descripción |
|-------|-------------|
| Nombre | Nombre completo |
| Email | Correo electrónico |
| Rol | ADMIN o USER |
| Estado | Activo/Inactivo |
| Fecha Registro | Cuándo se registró |

**[INSERTAR IMAGEN: Lista usuarios]**

### 9.2 Cambiar Rol de Usuario

**Paso 1:** Busca el usuario en la lista

**Paso 2:** Haz clic en el dropdown de roles

**Paso 3:** Selecciona el nuevo rol (USER o ADMIN)

**Paso 4:** Confirma el cambio

**[INSERTAR IMAGEN: Cambiar rol usuario]**

### 9.3 Desactivar Usuario

**Paso 1:** Haz clic en el icono de opciones junto al usuario

**Paso 2:** Selecciona **"Desactivar"**

**Paso 3:** El usuario no podrá iniciar sesión

**[INSERTAR IMAGEN: Desactivar usuario]**

---

## 10. PERFIL DE ADMINISTRADOR

### 10.1 Ver Perfil

**Paso 1:** Haz clic en tu nombre o icono de perfil en la esquina superior derecha

**[INSERTAR IMAGEN: Menú perfil]**

### 10.2 Cerrar Sesión

**Paso 1:** En el menú de perfil, haz clic en **"Cerrar Sesión"**

**[INSERTAR IMAGEN: Opción cerrar sesión]**

---

## 11. APLICACIÓN MÓVIL (ADMINISTRADOR)

### 11.1 Navegación Móvil

En la aplicación móvil, el administrador tiene acceso a las siguientes secciones desde el menú inferior:

| Icono | Sección | Descripción |
|-------|---------|-------------|
| 🏠 | Inicio | Dashboard con estadísticas |
| 📦 | Productos | Gestión de productos |
| 🛒 | Catálogo | Punto de venta |
| 👤 | Perfil | Mi cuenta y cerrar sesión |

**[INSERTAR IMAGEN: Navegación móvil admin]**

### 11.2 Realizar Venta desde Móvil

1. Ve a la pestaña **"Catálogo"**
2. Busca productos con la barra de búsqueda
3. Toca un producto para agregarlo al carrito
4. Completa los datos del cliente
5. Toca **"Recibir Pago"**
6. ¡Venta completada!

**[INSERTAR IMAGEN: Catálogo móvil]**

---

## 12. SOLUCIÓN DE PROBLEMAS

### 12.1 No puedo iniciar sesión
- Verifica que tu correo esté registrado
- Confirma que la contraseña sea correcta
- Prueba con "Olvidaste tu contraseña"

### 12.2 No aparece la imagen del producto
- Verifica que el formato sea JPG, PNG o WebP
- El tamaño máximo es 5MB

### 12.3 No puedo eliminar una categoría
- Primero elimina o reasigna los productos asociados

### 12.4 El stock no se actualiza después de una venta
- Verifica la conexión a Internet
- Actualiza la página e intenta nuevamente

### 12.5 Error al subir imagen
- Verifica el formato del archivo
- Reduce el tamaño de la imagen

---

## 13. CONTACTO Y SOPORTE

Para consultas o soporte técnico:

- **Correo:** soporte@lunaria.com
- **Teléfono:** [Número de contacto]

---

*Manual de Usuario - Administrador v1.0*
*Sistema de Gestión de Inventarios LUNARIA*
*Fecha de elaboración: Marzo 2026*
