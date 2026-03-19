# MANUAL DE INSTALACIÓN
# Sistema Lunaria - Gestión de Inventario y Ventas

---

## ÍNDICE

1. Introducción
2. Requisitos del Sistema
3. Instalación del Backend
4. Instalación del Frontend
5. Configuración de Base de Datos
6. Configuración de Servicios Externos
7. Verificación de la Instalación
8. Solución de Problemas

---

## 1. INTRODUCCIÓN

Este manual describe paso a paso cómo instalar el sistema Lunaria en un servidor de producción.

**Tiempo estimado de instalación:** 30-45 minutos

**Sistema operativo compatible:** Windows Server, Linux (Ubuntu, CentOS)

---

## 2. REQUISITOS DEL SISTEMA

### 2.1 Requisitos de Hardware

| Recurso | Mínimo | Recomendado |
|---------|--------|-------------|
| RAM | 2 GB | 4 GB |
| CPU | 1 núcleo | 2 núcleos |
| Almacenamiento | 10 GB | 20 GB |
| Conexión a Internet | 10 Mbps | 50 Mbps |

### 2.2 Requisitos de Software

| Componente | Versión | Enlace de Descarga |
|------------|---------|-------------------|
| Java JDK | 17+ | https://adoptium.net |
| Node.js | 18+ | https://nodejs.org |
| MySQL | 8.0+ | https://mysql.com |
| Git | 2.30+ | https://git-scm.com |

### 2.3 Cuentas Requeridas

- [ ] Cuenta en Railway (https://railway.app)
- [ ] Cuenta en Vercel (https://vercel.com)
- [ ] Cuenta en Cloudinary (https://cloudinary.com)
- [ ] Cuenta en Brevo (https://brevo.com)

---

## 3. INSTALACIÓN DEL BACKEND

### Paso 1: Preparar el Entorno

**En tu computadora local:**

1. Instala Git si no lo tienes:
   ```bash
   # Windows
   Descargar de https://git-scm.com
   
   # Ubuntu/Linux
   sudo apt-get install git
   ```

2. Instala Java JDK 17:
   ```bash
   # Windows
   Descargar de https://adoptium.net
   
   # Ubuntu/Linux
   sudo apt-get install openjdk-17-jdk
   ```

3. Verifica la instalación:
   ```bash
   java -version
   # Debe mostrar: openjdk version "17.x.x"
   ```

### Paso 2: Clonar el Repositorio

1. Abre una terminal
2. Navega a la carpeta donde guardarás el proyecto:
   ```bash
   cd C:\Proyectos  # Windows
   cd ~/Proyectos   # Linux
   ```
3. Clona el repositorio:
   ```bash
   git clone https://github.com/tu-usuario/lunaria.git
   ```

### Paso 3: Configurar Railway

1. **Crear cuenta en Railway:**
   - Ve a https://railway.app
   - Crea una cuenta con GitHub
   - Crea un nuevo proyecto

2. **Agregar MySQL:**
   - En el proyecto, haz clic en "New"
   - Selecciona "MySQL"
   - Espera a que se aprovisione

3. **Obtener URL de MySQL:**
   - Click en el plugin MySQL
   - Ve a "Connection"
   - Copia la URL (mysql://...)

4. **Agregar Variables de Entorno:**
   - Ve a "Variables" en el proyecto
   - Agrega las siguientes variables:

   | Variable | Valor |
   |----------|-------|
   | SPRING_DATASOURCE_URL | jdbc:mysql://host:3306/railway?useSSL=false |
   | SPRING_DATASOURCE_USERNAME | root |
   | SPRING_DATASOURCE_PASSWORD | [tu_password] |
   | JWT_SECRET_KEY | [cadena_segura_minimo_32_caracteres] |
   | CLOUDINARY_CLOUD_NAME | [tu_cloud_name] |
   | CLOUDINARY_API_KEY | [tu_api_key] |
   | CLOUDINARY_API_SECRET | [tu_api_secret] |
   | BREVO_API_KEY | [tu_api_key_brevo] |
   | SERVER_SERVLET_CONTEXT_PATH | /api/v1.0 |

5. **Desplegar Backend:**
   - Conecta tu repositorio de GitHub
   - Railway detectará Spring Boot automáticamente
   - Haz clic en "Deploy"

**Tiempo estimado:** 3-5 minutos

### Paso 4: Verificar Backend

1. Obtén la URL del backend:
   - En Railway, ve a "Settings"
   - Copia el dominio (ejemplo: lunaria-backend.railway.app)

2. Prueba la API:
   ```
   https://lunaria-backend.railway.app/api/v1.0/swagger-ui/index.html
   ```

---

## 4. INSTALACIÓN DEL FRONTEND

### Paso 1: Configurar Vercel

1. **Crear cuenta en Vercel:**
   - Ve a https://vercel.com
   - Crea una cuenta con GitHub

2. **Importar proyecto:**
   - Click en "Add New..."
   - Selecciona "Project"
   - Importa tu repositorio de GitHub

3. **Configurar variables:**
   - En "Environment Variables", agrega:

   | Variable | Valor |
   |----------|-------|
   | VITE_API_BASE_URL | https://tu-backend.railway.app/api/v1.0 |

4. **Desplegar:**
   - Click en "Deploy"
   - Espera a que termine (1-2 minutos)

### Paso 2: Configurar Dominio Personalizado (Opcional)

1. En Vercel, ve a "Settings" > "Domains"
2. Agrega tu dominio
3. Configura los registros DNS en tu proveedor de dominio

---

## 5. CONFIGURACIÓN DE BASE DE DATOS

### Paso 1: Ejecutar Scripts SQL

1. En Railway, haz clic en tu plugin MySQL
2. Ve a "Connect" > "Interactive Console"
3. Ejecuta los scripts en orden:

```sql
-- 1. Crear base de datos
CREATE DATABASE IF NOT EXISTS lunaria_database;

USE lunaria_database;

-- 2. Ejecutar script principal
SOURCE /ruta/al/lunaria_database.sql;

-- 3. Crear tabla de recuperación de contraseña (OTP)
SOURCE /ruta/al/password_reset_otp.sql;

-- 4. Crear usuario admin
SOURCE /ruta/al/create_admin_user.sql;
```

### Paso 2: Credenciales por Defecto

| Campo | Valor |
|-------|-------|
| Email | admin@lunaria.com |
| Contraseña | admin123 |

**⚠️ IMPORTANTE:** Cambia la contraseña inmediatamente después del primer login.

---

## 6. CONFIGURACIÓN DE SERVICIOS EXTERNOS

### 6.1 Cloudinary (Imágenes)

1. Crea cuenta en https://cloudinary.com
2. Ve a "Dashboard"
3. Copia tus credenciales:
   - Cloud Name
   - API Key
   - API Secret
4. Agrega estas variables en Railway

### 6.2 Brevo (Correos)

1. Crea cuenta en https://brevo.com
2. Ve a "Configuración" > "Claves API"
3. Genera una nueva clave API
4. Ve a "Remitentes" y verifica un email(empresa@tuempresa.com)
5. Agrega BREVO_API_KEY y BREVO_FROM_EMAIL en Railway

---

## 7. VERIFICACIÓN DE LA INSTALACIÓN

### Checklist de Verificación

| # | Paso | Estado |
|---|------|--------|
| 1 | Backend desplegado en Railway | [ ] |
| 2 | Frontend desplegado en Vercel | [ ] |
| 3 | Base de datos creada y con datos | [ ] |
| 4 | Login con credenciales por defecto | [ ] |
| 5 | Crear un producto de prueba | [ ] |
| 6 | Registrar una venta de prueba | [ ] |
| 7 | Verificar imagen en producto | [ ] |
| 8 | Verificar dashboard con datos | [ ] |

### Pruebas de Funcionalidad

1. **Login:**
   - Ve a la URL del frontend
   - Ingresa admin@lunaria.com / admin123
   - Deberías ver el dashboard

2. **Crear Producto:**
   - Ve a "Productos" > "Nuevo"
   - Completa los campos
   - Sube una imagen
   - Guarda

3. **Registrar Venta:**
   - Ve a "Ventas" > "Nueva"
   - Selecciona productos
   - Completa datos del cliente
   - Finaliza venta

---

## 8. SOLUCIÓN DE PROBLEMAS

### Error: "Connection refused" en backend

**Causa:** El backend no está ejecutándose

**Solución:**
1. Ve a Railway > Deployments
2. Revisa los logs deerror
3. Verifica las variables de entorno

### Error: "CORS policy" en consola

**Causa:** Frontend no puede comunicarse con backend

**Solución:**
1. Verifica que VITE_API_BASE_URL sea correcta
2. Asegúrate de incluir /api/v1.0 al final
3. Reinicia el frontend

### Error: "Unable to connect to database"

**Causa:** Credenciales de MySQL incorrectas

**Solución:**
1. Verifica SPRING_DATASOURCE_URL
2. Verifica usuario y contraseña
3. Asegúrate de que MySQL esté activo

### Error: "Cloudinary upload failed"

**Causa:** Credenciales de Cloudinary incorrectas

**Solución:**
1. Verifica CLOUDINARY_CLOUD_NAME
2. Verifica API Key y Secret
3. Asegúrate de que el plan tenga suficientes créditos

---

## ANEXO: INSTALACIÓN LOCAL (DESARROLLO)

### Backend Local

```bash
cd 03_backend/lunaria-backend-springboot

# Compilar
./mvnw clean package

# Ejecutar
java -jar target/lunaria-backend-springboot-0.0.1-SNAPSHOT.jar
```

### Frontend Local

```bash
cd 04_frontend_web/lunaria-frontend-react

# Instalar dependencias
npm install

# Ejecutar
npm run dev
```

---

**Versión del documento:** 1.0
**Fecha de creación:** Marzo 2026
**Sistema:** Lunaria v2.0
