# Plan de Instalación - Proyecto Lunaria

---

## 1. Introducción

Este documento describe el proceso de instalación del sistema Lunaria en un entorno de producción.

---

## 2. Requisitos del Sistema

### 2.1 Requisitos de Hardware

| Componente | Mínimo | Recomendado |
|------------|--------|-------------|
| Servidor Backend | 2 GB RAM, 1 CPU | 4 GB RAM, 2 CPU |
| Servidor Frontend | 1 GB RAM | 2 GB RAM |
| Base de Datos MySQL | 5 GB almacenamiento | 20 GB almacenamiento |
| Conexión a Internet | 10 Mbps | 50 Mbps |

### 2.2 Requisitos de Software

| Componente | Versión Mínima |
|------------|----------------|
| Java (Backend) | JDK 17 |
| Node.js (Frontend) | 18.x |
| MySQL | 8.0 |

---

## 3. Instalación del Backend

### 3.1 Opción A: Railway (Producción)

1. **Crear proyecto en Railway**
   - Ir a railway.app
   - Crear nuevo proyecto
   - Conectar repositorio de GitHub

2. **Configurar variables de entorno**
   ```
   SPRING_DATASOURCE_URL=jdbc:mysql://...
   SPRING_DATASOURCE_USERNAME=root
   SPRING_DATASOURCE_PASSWORD=...
   JWT_SECRET_KEY=...
   CLOUDINARY_CLOUD_NAME=...
   CLOUDINARY_API_KEY=...
   CLOUDINARY_API_SECRET=...
   BREVO_API_KEY=...
   ```

3. **Desplegar**
   - Railway detecta automáticamente Spring Boot
   - Hacer deploy desde la rama main

### 3.2 Opción B: Local

```bash
cd 03_backend/lunaria-backend-springboot
./mvnw clean package
java -jar target/lunaria-backend-springboot-0.0.1-SNAPSHOT.jar
```

---

## 4. Instalación del Frontend

### 4.1 Vercel (Producción)

1. **Crear proyecto en Vercel**
   - Ir a vercel.com
   - Importar repositorio de GitHub

2. **Configurar variables de entorno**
   ```
   VITE_API_BASE_URL=https://tu-backend.railway.app/api/v1.0
   ```

3. **Desplegar**
   - Vercel detecta automáticamente React + Vite
   - Deploy automático desde main

### 4.2 Local

```bash
cd 04_frontend_web/lunaria-frontend-react
npm install
npm run dev
```

---

## 5. Instalación de Base de Datos

### 5.1 MySQL en Railway

1. Crear plugin MySQL en Railway
2. Obtener URL de conexión
3. Ejecutar scripts en `02_database/`

### 5.2 Scripts de Base de Datos

```bash
# Crear estructura
mysql -u usuario -p lunaria_database < 02_database/lunaria_database.sql

# Crear usuario admin
mysql -u usuario -p lunaria_database < 02_database/create_admin_user.sql
```

---

## 6. Verificación de Instalación

1. **Backend**: Acceder a `https://tu-backend.railway.app/api/v1.0/swagger-ui/`
2. **Frontend**: Acceder a `https://tu-frontend.vercel.app`
3. **Probar login**: admin@lunaria.com / admin123

---

## 7. Configuración de Servicios Externos

| Servicio | Configuración |
|----------|---------------|
| Cloudinary | Crear cuenta, obtener API Key |
| Brevo | Crear cuenta, verificar sender |
| Railway | Configurar dominio personalizado (opcional) |

---

*Documento creado para el proyecto Lunaria*
