# Guía de Despliegue - Lunaria App

## Arquitectura Final

| Componente | Servicio | URL |
|------------|----------|-----|
| Frontend | Vercel | `https://lunaria.vercel.app` |
| Backend | AWS Elastic Beanstalk | `https://lunaria-backend.awsregion.elasticbeanstalk.com` |
| Base de datos | AWS RDS MySQL | `lunaria-db.xxx.us-east-1.rds.amazonaws.com` |
| Imágenes | AWS S3 | `s3://lunaria-images` |

---

## Paso 1: Configurar AWS RDS (MySQL)

1. Ir a **AWS Console** → **RDS** → **Create database**
2. Seleccionar **MySQL**
3. Configurar:
   - **DB instance identifier**: `lunaria-database`
   - **Master username**: `admin`
   - **Master password**: `TuPasswordSeguro123!`
   - **DB instance class**: `db.t3.micro` (Free tier)
   - **Allocated storage**: 20 GB
4. En **Additional configuration**:
   - Initial database name: `lunaria_database`
5. Click **Create database**
6. Esperar 5-10 minutos hasta que esté disponible
7. Copiar el **Endpoint** (algo como `lunaria-database.xxx.us-east-1.rds.amazonaws.com`)

---

## Paso 2: Desplegar Backend en Elastic Beanstalk

### Opción A: Manual desde Consola AWS

1. Ir a **AWS Console** → **Elastic Beanstalk** → **Create application**
2. Configurar:
   - **Application name**: `lunaria-backend`
   - **Platform**: Java
   - **Platform branch**: Corretto 17
   - **Application code**: Upload your code
3. Click **Create application**
4. Una vez creado, ir a **Configuration** → **Software**
5. En **Environment properties** agregar:
   ```
   SPRING_DATASOURCE_URL=jdbc:mysql://lunaria-database.xxx.us-east-1.rds.amazonaws.com:3306/lunaria_database
   SPRING_DATASOURCE_USERNAME=admin
   SPRING_DATASOURCE_PASSWORD=TuPasswordSeguro123!
   JWT_SECRET_KEY=tu_jwt_secret_muy_largo_y_seguro_minimo_256_bits
   AWS_ACCESS_KEY=tu_aws_access_key
   AWS_SECRET_KEY=tu_aws_secret_key
   AWS_REGION=us-east-1
   AWS_BUCKET_NAME=lunaria-images
   APP_SERVER_URL=https://tu-dominio-o-backend.elasticbeanstalk.com
   ```
6. Click **Apply**

### Opción B: Usando EB CLI

```bash
# Instalar EB CLI
pip install awsebcli

# Inicializar EB
cd 03_backend/lunaria-backend-springboot
eb init -p "Corretto 17" lunaria-backend --region us-east-1

# Crear entorno
eb create lunaria-backend-prod --instance-type t3.micro

# Configurar variables de entorno
eb setenv SPRING_DATASOURCE_URL=jdbc:mysql://... JWT_SECRET_KEY=...
```

---

## Paso 3: Compilar y Subir JAR (si no usa EB CLI)

```bash
cd 03_backend/lunaria-backend-springboot
./mvnw.cmd clean package -DskipTests
```

El JAR estará en: `target/lunaria-backend-springboot-0.0.1-SNAPSHOT.jar`

Subirlo desde: Elastic Beanstalk → Upload and Deploy

---

## Paso 4: Desplegar Frontend en Vercel

1. Ir a [Vercel.com](https://vercel.com) e iniciar sesión
2. Click **Add New** → **Project**
3. Importar desde GitHub (repositorio de Lunaria)
4. Configurar:
   - **Framework Preset**: Vite
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`
5. En **Environment Variables** agregar:
   ```
   VITE_API_URL=https://tu-backend.elasticbeanstalk.com/api/v1.0
   ```
6. Click **Deploy**

---

## Paso 5: Actualizar Frontend con URL del Backend

1. Copiar la URL de Elastic Beanstalk (ej: `lunaria-backend-prod.xxx.us-east-1.elasticbeanstalk.com`)
2. En Vercel, ir a **Settings** → **Environment Variables**
3. Actualizar:
   ```
   VITE_API_URL=https://tu-backend.elasticbeanstalk.com/api/v1.0
   ```
4. Ir a **Deployments** → **Redeploy** (último deployment)

---

## Paso 6: Configurar CORS en Backend

El backend necesita permitir solicitudes desde el dominio de Vercel. En el archivo `SecurityConfig.java` agregar:

```java
@Bean
public CorsConfigurationSource corsConfigurationSource() {
    CorsConfiguration configuration = new CorsConfiguration();
    configuration.setAllowedOrigins(Arrays.asList(
        "https://tu-proyecto.vercel.app",
        "http://localhost:5173"
    ));
    configuration.setAllowedMethods(Arrays.asList("GET", "POST", "PUT", "DELETE", "OPTIONS"));
    configuration.setAllowedHeaders(Arrays.asList("*"));
    configuration.setAllowCredentials(true);
    
    UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
    source.registerCorsConfiguration("/**", configuration);
    return source;
}
```

---

## Paso 7: Probar la Aplicación

1. Ir a `https://tu-proyecto.vercel.app`
2. Intentar iniciar sesión o registrar un nuevo usuario
3. Verificar que el Dashboard carga correctamente
4. Probar crear una categoría, marca y producto
5. Probar el sistema de ventas

---

## Configuración de Variables de Entorno

### Backend (Elastic Beanstalk)

| Variable | Descripción | Ejemplo |
|----------|-------------|---------|
| `SPRING_DATASOURCE_URL` | JDBC URL de MySQL | `jdbc:mysql://db-endpoint:3306/lunaria_database` |
| `SPRING_DATASOURCE_USERNAME` | Usuario MySQL | `admin` |
| `SPRING_DATASOURCE_PASSWORD` | Password MySQL | `Password123!` |
| `JWT_SECRET_KEY` | Clave JWT (mínimo 256 bits) | `cadena_mu_larga_y_segura` |
| `AWS_ACCESS_KEY` | Access Key AWS | `AKIA...` |
| `AWS_SECRET_KEY` | Secret Key AWS | `wJalr...` |
| `AWS_REGION` | Región AWS | `us-east-1` |
| `AWS_BUCKET_NAME` | Bucket S3 para imágenes | `lunaria-images` |
| `APP_SERVER_URL` | URL pública del backend | `https://backend.elasticbeanstalk.com` |

### Frontend (Vercel)

| Variable | Descripción | Ejemplo |
|----------|-------------|---------|
| `VITE_API_URL` | URL del API backend | `https://backend.elasticbeanstalk.com/api/v1.0` |

---

## Solución de Problemas

### Error: "Connection refused" en base de datos
- Verificar que RDS esté en la misma VPC que Elastic Beanstalk
- Verificar que el security group permita conexiones en puerto 3306

### Error: CORS
- Agregar el dominio de Vercel en la configuración de CORS del backend

### Error: JWT no funciona
- Verificar que `JWT_SECRET_KEY` tenga al menos 256 bits
- Regenerar el token después de cambiar la clave

### Imágenes no cargan
- Verificar credenciales de AWS S3
- Verificar que el bucket tenga permisos públicos de lectura (o usar CloudFront)

---

## Costos Estimados (AWS)

| Servicio | Costo Estimado |
|----------|----------------|
| RDS MySQL (t3.micro) | $0/mes (Free tier) |
| Elastic Beanstalk (t3.micro) | $0/mes (Free tier) |
| S3 (storage + requests) | $1-5/mes |
| Data Transfer | $0-5/mes |
| **Total** | **$1-10/mes** |

**¡Nota**: La capa gratuita de AWS cubre este setup durante el primer año.
