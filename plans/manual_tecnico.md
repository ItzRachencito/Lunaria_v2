# MANUAL TÉCNICO
# Sistema Lunaria - Gestión de Inventario y Ventas

---

## ÍNDICE

1. Arquitectura del Sistema
2. Estructura del Proyecto
3. Tecnologías Utilizadas
4. Configuración de Componentes
5. Diagrama de Arquitectura
6. Base de Datos
7. Seguridad
8. APIs y Endpoints
9. Despliegue
10. Mantenimiento

---

## 1. ARQUITECTURA DEL SISTEMA

### 1.1 Modelo de Arquitectura

El sistema Lunaria sigue una arquitectura de tres capas (3-Tier):

```
┌─────────────────────────────────────────────────────────────┐
│                    PRESENTACIÓN (Frontend)                  │
│                   React 19 + Bootstrap 5                    │
│                   Puerto: 5173 (desarrollo)                 │
└─────────────────────────────────────────────────────────────┘
                              │
                              │ HTTP/REST JSON
                              ▼
┌─────────────────────────────────────────────────────────────┐
│                    LÓGICA DE NEGOCIOS (Backend)             │
│                 Spring Boot 3.4 + Java 17                   │
│                   Puerto: 9090 (desarrollo)                 │
└─────────────────────────────────────────────────────────────┘
                              │
                              │ JDBC
                              ▼
┌─────────────────────────────────────────────────────────────┐
│                        DATOS (Storage)                      │
│              MySQL 8.0 + Cloudinary (imágenes)              │
└─────────────────────────────────────────────────────────────┘
```

### 1.2 Tipo de Arquitectura

- **Cliente-Servidor**: Aplicación web responsive
- **REST API**: Comunicación mediante servicios web RESTful
- **Microservicios monolíticos**: Backend modular

---

## 2. ESTRUCTURA DEL PROYECTO

### 2.1 Estructura General

```
Lunaria/
├── 02_database/              # Scripts de base de datos
│   ├── lunaria_database.sql  # Esquema de BD
│   └── create_admin_user.sql # Usuario inicial
│
├── 03_backend/               # Backend Spring Boot
│   └── lunaria-backend-springboot/
│       ├── src/main/java/
│       │   └── com/santiago_rachen/lunaria_backend_springboot/
│       │       ├── config/          # Configuraciones
│       │       ├── controller/      # Controladores REST
│       │       ├── entity/          # Entidades JPA
│       │       ├── repository/      # Repositorios
│       │       ├── service/        # Lógica de negocio
│       │       └── io/              # DTOs
│       └── pom.xml
│
├── 04_frontend/              # Frontend React
│   └── lunaria-frontend-react/
│       ├── src/
│       │   ├── components/    # Componentes reutilizables
│       │   ├── pages/         # Páginas
│       │   ├── context/       # Estado global
│       │   ├── services/      # Llamadas API
│       │   └── api/           # Configuración API
│       └── package.json
│
└── plans/                    # Documentación
```

### 2.2 Estructura del Backend

```
src/main/java/com/santiago_rachen/lunaria_backend_springboot/
├── LunariaBackendSpringbootApplication.java  # Main
├── config/
│   ├── AppConfig.java
│   ├── AWSConfig.java
│   ├── CloudinaryConfig.java
│   ├── OpenApiConfig.java
│   ├── SecurityConfig.java
│   └── StaticResourceConfig.java
├── controller/
│   ├── AuthController.java      # Login/Registro
│   ├── BrandController.java     # Marcas
│   ├── CategoryController.java  # Categorías
│   ├── DashboardController.java  # Estadísticas
│   ├── FavoriteController.java  # Favoritos
│   ├── ItemController.java      # Productos
│   ├── SaleController.java       # Ventas
│   ├── StockController.java     # Inventario
│   └── UserController.java      # Usuarios
├── entity/
│   ├── BrandEntity.java
│   ├── CategoryEntity.java
│   ├── FavoriteEntity.java
│   ├── ItemEntity.java
│   ├── SaleEntity.java
│   ├── SaleItemEntity.java
│   ├── StockMovement.java
│   └── UserEntity.java
├── repository/
│   ├── BrandRepository.java
│   ├── CategoryRepository.java
│   ├── FavoriteRepository.java
│   ├── ItemRepository.java
│   ├── SaleEntityRepository.java
│   ├── SaleItemEntityRepository.java
│   ├── StockMovementRepository.java
│   └── UserRepository.java
├── service/
│   ├── BrandService.java
│   ├── CategoryService.java
│   ├── FavoriteService.java
│   ├── ItemService.java
│   ├── SaleService.java
│   ├── StockService.java
│   └── UserService.java
├── service/impl/
│   ├── BrandServiceImpl.java
│   ├── CategoryServiceImpl.java
│   ├── FavoriteServiceImpl.java
│   ├── ItemServiceImpl.java
│   ├── SaleServiceImpl.java
│   ├── StockServiceImpl.java
│   └── UserServiceImpl.java
├── io/
│   ├── AuthRequest.java
│   ├── AuthResponse.java
│   ├── ItemRequest.java
│   ├── ItemResponse.java
│   └── ...
├── filter/
│   └── JwtRequestFilter.java
└── util/
    └── JwtUtil.java
```

---

## 3. TECNOLOGÍAS UTILIZADAS

### 3.1 Backend

| Tecnología | Versión | Propósito |
|------------|---------|-----------|
| Spring Boot | 3.4.4 | Framework principal |
| Java | 17 | Lenguaje de programación |
| Spring Security | 6.x | Seguridad |
| Spring Data JPA | 3.x | Acceso a datos |
| MySQL Connector | 8.x | Driver MySQL |
| JWT | 0.9.1 | Autenticación |
| Lombok | 1.18.x | Reducción de código |
| Swagger/OpenAPI | 3.x | Documentación API |
| Cloudinary SDK | - | Almacenamiento de imágenes |
| Brevo SDK | - | Envío de correos |

### 3.2 Frontend

| Tecnología | Versión | Propósito |
|------------|---------|-----------|
| React | 19.0.0 | Framework UI |
| Vite | 6.2.0 | Build tool |
| Bootstrap | 5.3.x | Estilos CSS |
| React Router | 6.x | Enrutamiento |
| Axios | 1.7.x | Cliente HTTP |
| React Context | - | Estado global |

### 3.3 Infraestructura

| Servicio | Propósito | Costo |
|----------|-----------|-------|
| Railway | Backend + MySQL | $5/mes |
| Vercel | Frontend | Gratis |
| Cloudinary | Imágenes | Gratis (inicio) |
| Brevo | Emails | Gratis (inicio) |

---

## 4. CONFIGURACIÓN DE COMPONENTES

### 4.1 application.properties

```properties
# Servidor
server.port=${SERVER_PORT:9090}
server.servlet.context-path=${SERVER_SERVLET_CONTEXT_PATH:/api/v1.0}

# Base de datos
spring.datasource.url=${SPRING_DATASOURCE_URL:jdbc:mysql://localhost:3306/lunaria_database}
spring.datasource.username=${SPRING_DATASOURCE_USERNAME:root}
spring.datasource.password=${SPRING_DATASOURCE_PASSWORD:}

# JPA/Hibernate
spring.jpa.hibernate.ddl-auto=${SPRING_JPA_HIBERNATE_DDL_AUTO:validate}

# JWT
jwt.secret.key=${JWT_SECRET_KEY:lunaria_secret_key}

# Cloudinary
cloudinary.cloud_name=${CLOUDINARY_CLOUD_NAME}
cloudinary.api_key=${CLOUDINARY_API_KEY}
cloudinary.api_secret=${CLOUDINARY_API_SECRET}

# Archivos
spring.servlet.multipart.max-file-size=20MB
spring.servlet.multipart.max-request-size=20MB
```

### 4.2 SecurityConfig.java

```java
@Configuration
@EnableWebSecurity
public class SecurityConfig {
    
    @Autowired
    private JwtRequestFilter jwtRequestFilter;
    
    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
        http
            .csrf(csrf -> csrf.disable())
            .authorizeHttpRequests(auth -> auth
                .requestMatchers("/login", "/register", "/password-reset/**").permitAll()
                .requestMatchers("/admin/**").hasRole("ADMIN")
                .anyRequest().authenticated()
            )
            .addFilterBefore(jwtRequestFilter, UsernamePasswordAuthenticationFilter.class);
        
        return http.build();
    }
}
```

---

## 5. DIAGRAMA DE ARQUITECTURA

```
╔══════════════════════════════════════════════════════════════════════════════╗
║                          ARQUITECTURA DEL SISTEMA LUNARIA                    ║
║                         (Arquitectura de 3 Capas + Servicios Cloud)          ║
╚══════════════════════════════════════════════════════════════════════════════╝

┌──────────────────────────────────────────────────────────────────────────────┐
│                              CAPA DE PRESENTACIÓN                            │
│  ┌────────────────────────────────────────────────────────────────────────┐  │
│  │                        FRONTEND (Vercel)                               │  │
│  │  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐  ┌───────────┐      │  │
│  │  │   PÁGINAS   │  │ COMPONENTES │  │   SERVICIOS │  │  CONTEXT  │      │  │
│  │  ├─────────────┤  ├─────────────┤  ├─────────────┤  ├───────────┤      │  │
│  │  │   Login     │  │  Navbar     │  │   api.js    │  │  AuthCtx  │      │  │
│  │  │ Dashboard   │  │  ItemCard   │  │ config.js   │  │ CartCtx   │      │  │
│  │  │   Items     │  │  ItemForm   │  │ axios       │  │           │      │  │
│  │  │   Sales     │  │  DataTable  │  │             │  │           │      │  │
│  │  │ Favoritos   │  │  Modal      │  │             │  │           │      │  │
│  │  └─────────────┘  └─────────────┘  └─────────────┘  └───────────┘      │  │
│  │                                                                        │  │
│  │  TECNOLOGÍAS: React 19 + Vite + Bootstrap 5 + React Router 6           │  │
│  └────────────────────────────────────────────────────────────────────────┘  │
└───────────────────────────────────────────┬──────────────────────────────────┘
                                            │ HTTPS / REST API / JWT
                                            ▼
┌──────────────────────────────────────────────────────────────────────────────────────────────────┐
│                           CAPA DE LÓGICA DE NEGOCIOS                                             │
│  ┌────────────────────────────────────────────────────────────────────────────────────────────┐  │
│  │                    BACKEND (Railway - Java 17)                                             │  │
│  │  ┌──────────────────────────────────────────────────────────────────────────────────────┐  │  │
│  │  │                    SPRING BOOT 3.4.4                                                 │  │  │
│  │  │  ┌────────────────────────────────────────────────────────────────────────────────┐  │  │  │
│  │  │  │                    CONTROLADORES                                               │  │  │  │
│  │  │  │  ┌──────────────┐ ┌──────────────┐ ┌──────────────┐ ┌──────────────┐           │  │  │  │
│  │  │  │  │AuthController│ │ItemController│ │SaleController│ │DashboardCtrl │           │  │  │  │
│  │  │  │  │(Login/Reg)   │ │(CRUD Items)  │ │(Ventas)      │ │(Estadísticas)│           │  │  │  │
│  │  │  │  └──────────────┘ └──────────────┘ └──────────────┘ └──────────────┘           │  │  │  │
│  │  │  │  ┌───────────────┐ ┌──────────────────┐ ┌───────────────┐ ┌──────────────────┐ │  │  │  │
│  │  │  │  │BrandController│ │CategoryController│ │StockController│ │FavoriteController│ │  │  │  │
│  │  │  │  │(CRUD)         │ │(CRUD)            │ │(Inventario)   │ │(Favoritos)       │ │  │  │  │
│  │  │  │  └───────────────┘ └──────────────────┘ └───────────────┘ └──────────────────┘ │  │  │  │
│  │  │  │  ┌──────────────┐ ┌───────────────────────┐                                    │  │  │  │
│  │  │  │  │UserController│ │PasswordResetController│                                    │  │  │  │
│  │  │  │  │(Admin)       │ │(OTP Reset)            │                                    │  │  │  │
│  │  │  │  └──────────────┘ └───────────────────────┘                                    │  │  │  │
│  │  │  └────────────────────────────────────────────────────────────────────────────────┘  │  │  │
│  │  │                              │                                                       │  │  │
│  │  │                              ▼                                                       │  │  │
│  │  │  ┌───────────────────────────────────────────────────────────┐                       │  │  │
│  │  │  │                    SERVICIOS                              │                       │  │  │
│  │  │  │  ┌────────────┐ ┌────────────┐ ┌────────────┐ ┌────────┐  │                       │  │  │
│  │  │  │  │AuthService │ │ItemService │ │SaleService │ │StockSvc│  │                       │  │  │
│  │  │  │  └────────────┘ └────────────┘ └────────────┘ └────────┘  │                       │  │  │
│  │  │  │  ┌─────────────┐ ┌────────────┐ ┌────────────┐ ┌───────┐  │                       │  │  │
│  │  │  │  │BrandService │ │CategorySvc │ │FavoriteSvc │ │UserSvc│  │                       │  │  │
│  │  │  │  └─────────────┘ └────────────┘ └────────────┘ └───────┘  │                       │  │  │
│  │  │  │  ┌───────────────────────────────────────────────┐        │                       │  │  │
│  │  │  │  │         EmailService (Brevo)                  │        │                       │  │  │
│  │  │  │  └───────────────────────────────────────────────┘        │                       │  │  │
│  │  │  └───────────────────────────────────────────────────────────┘                       │  │  │
│  │  │                              │                                                       │  │  │
│  │  │                              ▼                                                       │  │  │
│  │  │  ┌───────────────────────────────────────────────────────────┐                       │  │  │
│  │  │  │                    ENTIDADES JPA                          │                       │  │  │
│  │  │  │  ┌───────┐ ┌───────┐ ┌───────┐ ┌────────┐ ┌──────┐        │                       │  │  │
│  │  │  │  │UserEnt│ │ItemEnt│ │SaleEnt│ │BrandEnt│ │CatEnt│        │                       │  │  │
│  │  │  │  └───────┘ └───────┘ └───────┘ └────────┘ └──────┘        │                       │  │  │
│  │  │  │  ┌───────────┐ ┌────────────────┐ ┌──────────────┐        │                       │  │  │
│  │  │  │  │FavoriteEnt│ │PasswordResetOtp│ │StockMovement │        │                       │  │  │
│  │  │  │  └───────────┘ └────────────────┘ └──────────────┘        │                       │  │  │
│  │  │  └───────────────────────────────────────────────────────────┘                       │  │  │
│  │  │                              │                                                       │  │  │
│  │  │                              ▼                                                       │  │  │
│  │  │  ┌───────────────────────────────────────────────────────────┐                       │  │  │
│  │  │  │               SEGURIDAD (Spring Security)                 │                       │  │  │
│  │  │  │  ┌─────────────┐  ┌───────────────┐  ┌─────────────────┐  │                       │  │  │
│  │  │  │  │JWT Filter   │  │BCrypt Password│  │CORS Config      │  │                       │  │  │
│  │  │  │  │(Auth)       │  │Encoder        │  │(Cross-Origin)   │  │                       │  │  │
│  │  │  │  └─────────────┘  └───────────────┘  └─────────────────┘  │                       │  │  │
│  │  │  └───────────────────────────────────────────────────────────┘                       │  │  │
│  │  └──────────────────────────────────────────────────────────────────────────────────────┘  │  │
│  │                                                                                            │  │
│  │  DEPENDENCIAS: Spring Security | JWT | JPA | MySQL | Lombok | Swagger                      │  │
│  └────────────────────────────────────────────────────────────────────────────────────────────┘  │
└───────────────────────────────────────────┬──────────────────────────────────────────────────────┘
                                            │ JDBC / REST
                                            ▼
┌─────────────────────────────────────────────────────────────────────────────┐
│                              CAPA DE DATOS                                  │
│  ┌─────────────────────────────┐    ┌────────────────────────────────────┐  │
│  │       MYSQL (Railway)       │    │         CLOUDINARY                 │  │
│  │  ┌────────────────────────┐ │    │  ┌──────────────────────────────┐  │  │
│  │  │     BASE DE DATOS      │ │    │  │      ALMACENAMIENTO          │  │  │
│  │  │ ┌───────────────────┐  │ │    │  │  ┌────────────────────────┐  │  │  │
│  │  │ │ tbl_users         │  │ │    │  │  │  Imágenes de           │  │  │  │
│  │  │ │ tbl_category      │  │ │    │  │  │  productos             │  │  │  │
│  │  │ │ tbl_brand         │    │    │  │  │                        │  │  │  │
│  │  │ │ tbl_items         │  │ │    │  │  │  - Optimización        │  │  │  │
│  │  │ │ tbl_sales         │  │ │    │  │  │  - CDN global          │  │  │  │
│  │  │ │ tbl_sale_items    │  │ │    │  │  │  - Transformaciones    │  │  │  │
│  │  │ │ tbl_favorites     │  │ │    │  │  └────────────────────────┘  │  │  │
│  │  │ │ tbl_stock_mov     │  │ │    │  │                              │  │  │
│  │  │ │ password_reset_otp│  │ │    │  └──────────────────────────────┘  │  │
│  │  │ └───────────────────┘  │ │    └────────────────────────────────────┘  │
│  │  │                        │ │                                            │  
│  │  │ Motor: InnoDB          │ │                                            │  
│  │  │ Charset: utf8mb4       │ │                                            │  
│  │  └────────────────────────┘ │                                            │  
│  └─────────────────────────────┘                                            │  
│                                                                             │  
│  ┌───────────────────────────────────────────────────────────────────────┐  │
│  │                        SERVICIOS EXTERNOS                             │  │
│  │  ┌───────────────────┐  ┌───────────────────┐  ┌──────────────────┐   │  │
│  │  │    RAILWAY        │  │    BREVO          │  │   CLOUDINARY     │   │  │
│  │  │  (Infraestructura)│  │   (Email)         │  │  (Imágenes)      │   │  │
│  │  │  - Backend        │  │  - OTP            │  │  - Storage       │   │  │
│  │  │  - MySQL          │  │  - Notificaciones │  │  - CDN           │   │  │
│  │  └───────────────────┘  └───────────────────┘  └──────────────────┘   │  │
│  └───────────────────────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────────────────────┘

════════════════════════════════════════════════════════════════════════════════
                              FLUJO DE DATOS
════════════════════════════════════════════════════════════════════════════════

1. USUARIO → FRONTEND (React)
   └─→ Acciones del usuario (clic, formularios)

2. FRONTEND → BACKEND (API REST)
   └─→ Peticiones HTTP con JWT Bearer Token

3. BACKEND (Controladores)
   └─→ Valida request → Llama a Servicio

4. BACKEND (Servicios)
   └─→ Lógica de negocio → Valida reglas

5. BACKEND (Repositorios)
   └─→ Consulta/Modifica datos en MySQL

6. RESPUESTA → FRONTEND
   └─→ JSON con datos o errores

7. SERICIOS EXTERNOS:
   └─→ Cloudinary: Subida/Descarga de imágenes
   └─→ Brevo: Envío de emails (OTP)
════════════════════════════════════════════════════════════════════════════════
```

---

## 6. BASE DE DATOS

### 6.1 Modelo Entidad-Relación

```
┌─────────────┐       ┌─────────────┐       ┌─────────────┐
│    Users    │       │  Category   │       │    Brand    │
├─────────────┤       ├─────────────┤       ├─────────────┤
│ id (PK)     │       │ id (PK)     │       │ id (PK)     │
│ email       │       │ name        │       │ name        │
│ password    │       │ description │       │ description │
│ role        │       │ created_at  │       │ created_at  │
│ name        │       └──────┬──────┘       └──────┬──────┘
│ created_at  │              │                     │
└──────┬──────┘              │                     │
       │                     ▼                     │
       │              ┌─────────────┐              │
       │              │   Items     │              │
       │              ├─────────────┤              │
       │              │ id (PK)     │◄─────────────│
       │              │ name        │ (brand_id FK)│
       │              │ price       │              │
       │              │ stock       │              │
       │              │ category_id │◄─────────────┘
       │              │ image_url   │ (category_id FK)
       │              │ created_at  │
       │              └──────┬──────┘
       │                     │
       │              ┌──────┴──────┐
       │              │             │
       ▼              ▼             ▼
┌─────────────┐  ┌─────────────┐  ┌──────────────┐
│  Favorites  │  │    Sales    │  │StockMovement │
├─────────────┤  ├─────────────┤  ├──────────────┤
│ user_id (FK)│  │ id (PK)     │  │ id (PK)      │
│ item_id (FK)│  │ customer    │  │ item_id (FK) │
│ created_at  │  │ total       │  │ quantity     │
└─────────────┘  │ payment_met │  │ type (IN/OUT)│
                 │ created_at  │  │ created_at   │
                 └─────┬───────┘  └──────────────┘
                       │
                       ▼
                ┌─────────────┐
                │ SaleItems   │
                ├─────────────┤
                │ sale_id (FK)│
                │ item_id (FK)│
                │ quantity    │
                │ price       │
                └─────────────┘
```

### 6.2 Tabla de Recuperación de Contraseña (OTP)

```
┌─────────────────────────────┐
│   password_reset_otp        │
├─────────────────────────────┤
│ id (PK)                     │
│ email                       │──────┐
│ otp_code (6 dígitos)        │      │
│ created_at                  │      │
│ expires_at                  │      │
│ used (BOOLEAN)              │      │
│ used_at                     │      │
│ ip_address                  │      │
│ user_agent                  │      │
└─────────────────────────────┘      │
                                     │
                        Sin relación FK
                        (tabla temporal)
```

### 6.2 Tablas Principales

| Tabla | Descripción | Registros típicos |
|-------|-------------|------------------|
| tbl_users | Usuarios del sistema | 10-100 |
| tbl_category | Categorías de productos | 5-20 |
| tbl_brand | Marcas de productos | 10-50 |
| tbl_items | Productos | 100-1000 |
| tbl_sales | Registro de ventas | 500-10000 |
| tbl_sale_items | Items de cada venta | 1000-50000 |
| tbl_favorites | Productos favoritos | 50-500 |
| tbl_stock_movements | Historial de inventario | 500-10000 |
| **password_reset_otp** | **Códigos OTP de recuperación** | **Por uso** |

### 6.3 Tabla de Recuperación de Contraseña (OTP)

| Campo | Tipo | Descripción |
|-------|------|-------------|
| id | BIGINT | Identificador único (PK) |
| email | VARCHAR(255) | Email del usuario |
| otp_code | VARCHAR(6) | Código OTP de 6 dígitos |
| created_at | TIMESTAMP | Fecha de creación |
| expires_at | TIMESTAMP | Fecha de expiración (10 min) |
| used | BOOLEAN | Si el código fue usado |
| used_at | TIMESTAMP | Fecha de uso |
| ip_address | VARCHAR(45) | IP del solicitante |
| user_agent | VARCHAR(500) | Navegador/dispositivo |

**Índices:**
- idx_email (email)
- idx_otp_code (otp_code)
- idx_expires_at (expires_at)

---

## 7. SEGURIDAD

### 7.1 Autenticación

- **Tipo**: JWT (JSON Web Tokens)
- **Algoritmo**: HS256
- **Expiración**: 24 horas
- **Almacenamiento**: Frontend (localStorage)

### 7.2 Autorización

| Rol | Permisos |
|-----|----------|
| ROLE_ADMIN | CRUD completo, Dashboard, Usuarios |
| ROLE_USER | Lectura, Ventas, Favoritos |

### 7.3 Medidas de Seguridad

- ✅ Contraseñas encriptadas con BCrypt
- ✅ Tokens JWT con expiración
- ✅ Validación de entradas
- ✅ Control de acceso por roles
- ✅ Protección CORS
- ✅ HTTPS en producción

---

## 8. APIs Y ENDPOINTS

### 8.1 Autenticación

| Método | Endpoint | Descripción | Acceso |
|--------|----------|-------------|--------|
| POST | /login | Iniciar sesión | Público |
| POST | /register | Registrarse | Público |
| POST | /password-reset/request | Solicitar código OTP | Público |
| POST | /password-reset/reset | Restablecer contraseña | Público |
| POST | /password-reset/resend | Reenviar código OTP | Público |

### 8.2 Productos

| Método | Endpoint | Descripción | Acceso |
|--------|----------|-------------|--------|
| GET | /items | Listar productos | Público |
| GET | /items/{id} | Ver producto | Público |
| POST | /admin/items | Crear producto | ADMIN |
| PUT | /admin/items/{id} | Editar producto | ADMIN |
| DELETE | /admin/items/{id} | Eliminar producto | ADMIN |

### 8.3 Categorías y Marcas

| Método | Endpoint | Descripción | Acceso |
|--------|----------|-------------|--------|
| GET | /categories | Listar categorías | Público |
| POST | /admin/categories | Crear categoría | ADMIN |
| GET | /brands | Listar marcas | Público |
| POST | /admin/brands | Crear marca | ADMIN |

### 8.4 Ventas

| Método | Endpoint | Descripción | Acceso |
|--------|----------|-------------|--------|
| GET | /sales | Listar ventas | USER |
| POST | /sales | Crear venta | USER |
| GET | /sales/latest | Ventas recientes | ADMIN |

### 8.5 Dashboard

| Método | Endpoint | Descripción | Acceso |
|--------|----------|-------------|--------|
| GET | /dashboard | Estadísticas | ADMIN |

### 8.6 Favoritos

| Método | Endpoint | Descripción | Acceso |
|--------|----------|-------------|--------|
| GET | /favorites | Mis favoritos | USER |
| POST | /favorites/{id} | Agregar favorito | USER |
| DELETE | /favorites/{id} | Quitar favorito | USER |

---

## 9. DESPLIEGUE

### 9.1 Backend (Railway)

1. Conectar repositorio de GitHub
2. Railway detecta Spring Boot automáticamente
3. Configurar variables de entorno
4. Deploy automático desde rama main

### 9.2 Frontend (Vercel)

1. Importar repositorio de GitHub
2. Framework detectado: Vite + React
3. Configurar VITE_API_BASE_URL
4. Deploy automático desde rama main

---

## 10. MANTENIMIENTO

### 10.1 Tareas de Mantenimiento

| Frecuencia | Tarea |
|------------|-------|
| Diario | Revisar logs de errores |
| Semanal | Backup de base de datos |
| Mensual | Actualizar dependencias |
| Trimestral | Revisión de seguridad |

### 10.2 Monitoreo

- **Railway**: Métricas de CPU, memoria, red
- **Vercel**: Métricas de rendimiento
- **Cloudinary**: Uso de almacenamiento

---

**Versión del documento:** 1.0
**Fecha de creación:** Marzo 2026
**Sistema:** Lunaria v2.0
