# Guía de Despliegue: Railway + Vercel (100% Gratis)

## Arquitectura

| Componente | Servicio | Costo |
|------------|----------|-------|
| Backend | Railway | Gratis |
| Base de datos | Railway (MySQL) | Gratis |
| Imágenes | Cloudinary | Gratis |
| Frontend | Vercel | Gratis |

---

## Paso 1: Crear cuenta en Railway

1. Ir a **https://railway.app**
2. Click **"Sign Up"** → **"Login with GitHub"**
3. Autorizar la aplicación
4. Verificar email

---

## Paso 2: Crear proyecto en Railway

### 2.1 Crear Base de Datos MySQL
1. En Railway dashboard, click **"New Project"**
2. Seleccionar **"Provision MySQL"**
3. Esperar a que se cree (~1 minuto)
4. Click en **"MySQL"** → copiar **"Connection String"**
   - Formato: `mysql://root:password@hostname:port/database`

### 2.2 Crear Backend (Docker)
1. Click **"New"** → **"GitHub Repo"**
2. Seleccionar tu repositorio de Lunaria
3. En **"Root Directory"** escribir: `03_backend/lunaria-backend-springboot`
4. Click **"Deploy"**

### 2.3 Configurar Variables de Entorno
1. Ir a **"Variables"** en el servicio del backend
2. Agregar:
   ```
   SPRING_DATASOURCE_URL=jdbc:mysql://host:port/lunaria_database
   SPRING_DATASOURCE_USERNAME=root
   SPRING_DATASOURCE_PASSWORD=tu_password
   JWT_SECRET_KEY=una_clave_segura_muy_larga_minimo_256_bits
   ```
3. Click **"Deploy"**

---

## Paso 3: Desplegar Frontend en Vercel

1. Ir a **https://vercel.com**
2. **"Add New..."** → **"Project"**
3. Importar repositorio de GitHub
4. Configurar:
   - Framework: **Vite**
   - Build: `npm run build`
   - Output: `dist`
5. En **"Environment Variables"** agregar:
   ```
   VITE_API_URL=https://tu-backend.railway.app/api/v1.0
   ```
6. Click **"Deploy"**

---

## Paso 4: Actualizar URLs

1. Cuando Railway termine, darte una URL: `https://tu-proyecto.up.railway.app`
2. Copiar esa URL y agregarla en:
   - Vercel: actualizar `VITE_API_URL`

---

## Notas Importantes

### Railway Modo Gratis
- El servidor "duerme" después de 25 min de inactividad
- Se activa automáticamente cuando alguien accede
- Primer acceso puede tomar ~30 segundos

### Cloudinary (Imágenes)
Si AWS S3 no funciona, configurar Cloudinary:
1. Ir a **https://cloudinary.com**
2. Crear cuenta gratis
3. Obtener **Cloud Name**, **API Key**, **API Secret**
4. Agregar al backend:
   ```
   CLOUDINARY_CLOUD_NAME=xxx
   CLOUDINARY_API_KEY=xxx
   CLOUDINARY_API_SECRET=xxx
   ```

---

## Solución de Problemas

### Error de conexión a base de datos
- Verificar que las credenciales en Railway sean correctas
- Asegurarse de que la base de datos esté en la misma región

### Error CORS
- Agregar el dominio de Vercel en la configuración de CORS del backend

### Imágenes no cargan
- Verificar credenciales de Cloudinary o AWS S3

---

##Costos Finale
**$0 USD/mes** - Todo incluido en tier gratuito
