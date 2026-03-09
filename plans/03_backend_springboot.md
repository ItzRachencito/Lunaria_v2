# Documentación del Backend - Lunaria

## 1. Visión General

El backend de Lunaria está desarrollado con **Spring Boot 3.4.4** y **Java 17**. Proporciona una API REST completa para gestionar el sistema de inventario y punto de venta.

### 1.1 Configuración del Proyecto

| Parámetro | Valor |
|-----------|-------|
| Framework | Spring Boot 3.4.4 |
| Java Version | 17 |
| Puerto por defecto | 9090 |
| Context Path | /api/v1.0 |
| Base de datos | MySQL (JPA/Hibernate) |

---

## 2. Estructura del Proyecto

### 2.1 Diagrama de Paquetes

```
src/main/java/com/santiago_rachen/lunaria_backend_springboot/
├── LunariaBackendSpringbootApplication.java    # Clase principal
├── config/                                    # Configuración
│   ├── AppConfig.java
│   ├── AWSConfig.java
│   ├── OpenApiConfig.java
│   ├── SecurityConfig.java
│   └── StaticResourceConfig.java
├── controller/                                 # Controladores REST
│   ├── AuthController.java
│   ├── BrandController.java
│   ├── CategoryController.java
│   ├── DashboardController.java
│   ├── FavoriteController.java
│   ├── ItemController.java
│   ├── SaleController.java
│   ├── StockController.java
│   └── UserController.java
├── entity/                                     # Entidades JPA
│   ├── BrandEntity.java
│   ├── CategoryEntity.java
│   ├── FavoriteEntity.java
│   ├── ItemEntity.java
│   ├── MovementType.java
│   ├── SaleEntity.java
│   ├── SaleItemEntity.java
│   ├── StockMovement.java
│   ├── StockStatus.java
│   └── UserEntity.java
├── io/                                         # DTOs
│   ├── AuthRequest.java
│   ├── AuthResponse.java
│   ├── BrandRequest.java
│   ├── BrandResponse.java
│   ├── CategoryRequest.java
│   ├── CategoryResponse.java
│   ├── DashboardResponse.java
│   ├── FavoriteResponse.java
│   ├── ItemRequest.java
│   ├── ItemResponse.java
│   ├── OrderRequest.java
│   ├── OrderResponse.java
│   ├── PaymentDetails.java
│   ├── PaymentMethod.java
│   ├── PaymentRequest.java
│   ├── SaleRequest.java
│   ├── SaleResponse.java
│   ├── StockMovementResponse.java
│   ├── UserRequest.java
│   └── UserResponse.java
├── repository/                                 # Repositorios JPA
│   ├── BrandRepository.java
│   ├── CategoryRepository.java
│   ├── FavoriteRepository.java
│   ├── ItemRepository.java
│   ├── SaleEntityRepository.java
│   ├── SaleItemEntityRepository.java
│   ├── StockMovementRepository.java
│   └── UserRepository.java
├── service/                                    # Interfaces de servicio
│   ├── BrandService.java
│   ├── CategoryService.java
│   ├── FavoriteService.java
│   ├── FileUploadService.java
│   ├── ItemService.java
│   ├── SaleService.java
│   ├── StockService.java
│   └── UserService.java
├── service/impl/                               # Implementaciones
│   ├── AppUserDetailsService.java
│   ├── BrandServiceImpl.java
│   ├── CategoryServiceImpl.java
│   ├── FavoriteServiceImpl.java
│   ├── FileUploadServiceImpl.java
│   ├── ItemServiceImpl.java
│   ├── SaleServiceImpl.java
│   └── UserServiceImpl.java
├── filter/                                     # Filtros
│   └── JwtRequestFilter.java
└── util/                                       # Utilidades
    └── JwtUtil.java
```

---

## 3. Entidades JPA

### 3.1 ItemEntity

Representa los productos del inventario.

```java
@Entity
@Table(name = "tbl_items")
public class ItemEntity {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @Column(unique = true)
    private String itemId;
    
    private String name;
    private BigDecimal price;
    private String description;
    private String imgUrl;
    
    @Column(nullable = false)
    private Integer stockQuantity = 0;
    
    @ManyToOne
    @JoinColumn(name = "category_id", nullable = false)
    @OnDelete(action = OnDeleteAction.RESTRICT)
    private CategoryEntity category;
    
    @ManyToOne
    @JoinColumn(name = "brand_id")
    @OnDelete(action = OnDeleteAction.SET_NULL)
    private BrandEntity brand;
    
    // Métodos de gestión de stock
    public boolean reduceStock(Integer quantity)
    public void increaseStock(Integer quantity)
    public StockStatus getStockStatus()
}
```

**Enum StockStatus:**
```java
public enum StockStatus {
    IN_STOCK,    // Stock normal
    LOW_STOCK,   // Stock bajo (<=2 unidades)
    OUT_OF_STOCK // Sin stock
}
```

---

### 3.2 UserEntity

Representa los usuarios del sistema.

```java
@Entity
@Table(name = "tbl_users")
public class UserEntity {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @Column(unique = true)
    private String userId;
    
    @Column(unique = true)
    private String email;
    
    private String password;
    private String role;      // ROLE_ADMIN o ROLE_USER
    private String name;
    
    @CreationTimestamp
    @Column(updatable = false)
    private Timestamp createdAt;
    
    @UpdateTimestamp
    private Timestamp updatedAt;
}
```

---

### 3.3 SaleEntity

Representa las ventas realizadas.

```java
@Entity
@Table(name = "tbl_sales")
public class SaleEntity {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    private String saleId;     // Formato: "SAL" + timestamp
    private String customerName;
    private String phoneNumber;
    private Double subtotal;
    private Double grandTotal;
    private LocalDateTime createdAt;
    
    @OneToMany(cascade = CascadeType.ALL, orphanRemoval = true)
    @JoinColumn(name = "sale_id")
    private List<SaleItemEntity> items = new ArrayList<>();
    
    @Enumerated(EnumType.STRING)
    private PaymentMethod paymentMethod;
    
    @PrePersist
    protected void onCreate() {
        this.saleId = "SAL"+System.currentTimeMillis();
        this.createdAt = LocalDateTime.now();
    }
}
```

---

### 3.4 StockMovement

Registra los movimientos de inventario.

```java
@Entity
@Table(name = "tbl_stock_movements")
public class StockMovement {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "item_id", nullable = false)
    private ItemEntity itemEntity;
    
    @Enumerated(EnumType.STRING)
    @Column(name = "movement_type", nullable = false)
    private MovementType movementType;
    
    @Column(nullable = false)
    private Integer quantity;
    
    @Column(name = "previous_stock", nullable = false)
    private Integer previousStock;
    
    @Column(name = "new_stock", nullable = false)
    private Integer newStock;
    
    private String referenceType;
    private Long referenceId;
    private String reason;
    private String createdBy;
    private LocalDateTime createdAt;
}
```

**Enum MovementType:**
```java
public enum MovementType {
    PURCHASE,  // Compra/Ajuste positivo
    SALE,      // Venta
    ADJUSTMENT,// Ajuste manual
    RETURN     // Devolución
}
```

---

## 4. Controladores REST

### 4.1 AuthController

Maneja la autenticación y registro de usuarios.

| Método | Endpoint | Descripción | Autenticación |
|--------|----------|-------------|---------------|
| POST | `/login` | Iniciar sesión | No |
| POST | `/register` | Registrar usuario | No |
| POST | `/encode` | Encriptar contraseña | No (dev) |

**Ejemplo de Login:**
```json
// Request
POST /login
{
    "email": "admin@lunaria.com",
    "password": "password123"
}

// Response
{
    "email": "admin@lunaria.com",
    "token": "eyJhbGciOiJIUzI1NiJ9...",
    "role": "ROLE_ADMIN"
}
```

---

### 4.2 ItemController

Gestión de productos.

| Método | Endpoint | Descripción | Rol requerido |
|--------|----------|-------------|---------------|
| POST | `/admin/items` | Crear producto | ADMIN |
| GET | `/items` | Listar productos | - |
| PUT | `/admin/items/{itemId}` | Actualizar producto | ADMIN |
| DELETE | `/admin/items/{itemId}` | Eliminar producto | ADMIN |

---

### 4.3 SaleController

Gestión de ventas.

| Método | Endpoint | Descripción | Rol requerido |
|--------|----------|-------------|---------------|
| POST | `/sales` | Crear venta | ADMIN |
| GET | `/sales/latest` | Obtener últimas ventas | USER/ADMIN |
| DELETE | `/sales/{saleId}` | Eliminar venta | ADMIN |

---

### 4.4 DashboardController

Estadísticas del dashboard.

| Método | Endpoint | Descripción | Rol requerido |
|--------|----------|-------------|---------------|
| GET | `/dashboard` | Obtener datos del dashboard | USER/ADMIN |

**Response:**
```json
{
    "todaySale": 1500.00,
    "todaySaleCount": 15,
    "recentSales": [...]
}
```

---

### 4.5 CategoryController

Gestión de categorías.

| Método | Endpoint | Descripción | Rol requerido |
|--------|----------|-------------|---------------|
| POST | `/admin/categories` | Crear categoría | ADMIN |
| GET | `/categories` | Listar categorías | - |
| PUT | `/admin/categories/{categoryId}` | Actualizar categoría | ADMIN |
| DELETE | `/admin/categories/{categoryId}` | Eliminar categoría | ADMIN |

---

### 4.6 BrandController

Gestión de marcas.

| Método | Endpoint | Descripción | Rol requerido |
|--------|----------|-------------|---------------|
| POST | `/admin/brands` | Crear marca | ADMIN |
| GET | `/brands` | Listar marcas | - |
| PUT | `/admin/brands/{brandId}` | Actualizar marca | ADMIN |
| DELETE | `/admin/brands/{brandId}` | Eliminar marca | ADMIN |

---

### 4.7 StockController

Gestión de inventario.

| Método | Endpoint | Descripción | Rol requerido |
|--------|----------|-------------|---------------|
| GET | `/items/{itemId}/stock` | Ver stock | USER/ADMIN |
| POST | `/admin/stock/add` | Agregar stock | ADMIN |
| POST | `/admin/stock/remove` | Quitar stock | ADMIN |
| GET | `/admin/stock/movements` | Ver historial | ADMIN |

---

### 4.8 FavoriteController

Gestión de favoritos.

| Método | Endpoint | Descripción | Rol requerido |
|--------|----------|-------------|---------------|
| GET | `/favorites` | Listar favoritos | USER/ADMIN |
| POST | `/favorites/{itemId}` | Agregar favorito | USER/ADMIN |
| DELETE | `/favorites/{itemId}` | Quitar favorito | USER/ADMIN |

---

### 4.9 UserController

Gestión de usuarios (ADMIN).

| Método | Endpoint | Descripción | Rol requerido |
|--------|----------|-------------|---------------|
| GET | `/admin/users` | Listar usuarios | ADMIN |
| GET | `/admin/users/{userId}` | Ver usuario | ADMIN |
| PUT | `/admin/users/{userId}` | Actualizar usuario | ADMIN |
| DELETE | `/admin/users/{userId}` | Eliminar usuario | ADMIN |

---

## 5. Servicios

### 5.1 ItemServiceImpl

Gestión completa de productos:

```java
@Service
public class ItemServiceImpl implements ItemService {
    public ItemResponse add(ItemRequest request, MultipartFile file)
    public List<ItemResponse> fetchItems()
    public ItemResponse updateItem(String itemId, ItemRequest request)
    public void deleteItem(String itemId)
    public ItemEntity getItemByItemId(String itemId)
}
```

---

### 5.2 SaleServiceImpl

Gestión de ventas con control de inventario:

```java
@Service
public class SaleServiceImpl implements SaleService {
    public SaleResponse createSale(SaleRequest request)
    public void deleteSale(String saleId)
    public List<SaleResponse> getLatestSales()
    public Double sumSalesByDate(LocalDate date)
    public Long countBySaleDate(LocalDate date)
    public List<SaleResponse> findRecentSales()
}
```

---

### 5.3 StockService

Control de inventario:

```java
@Service
public class StockService {
    public void addStock(String itemId, Integer quantity, String reason, String username)
    public void removeStock(String itemId, Integer quantity, String reason, String username)
    public List<StockMovementResponse> getStockMovements(String itemId)
    public List<StockMovementResponse> getAllStockMovements()
}
```

---

## 6. Repositorios

### 6.1 ItemRepository

```java
@Repository
public interface ItemRepository extends JpaRepository<ItemEntity, Long> {
    Optional<ItemEntity> findByItemId(String itemId);
    List<ItemEntity> findByCategoryCategoryId(String categoryId);
    List<ItemEntity> findByBrandBrandId(String brandId);
    List<ItemEntity> findByNameContainingIgnoreCase(String name);
}
```

---

### 6.2 SaleEntityRepository

```java
@Repository
public interface SaleEntityRepository extends JpaRepository<SaleEntity, Long> {
    Optional<SaleEntity> findBySaleId(String saleId);
    List<SaleEntity> findTop10ByOrderByCreatedAtDesc();
    Double sumGrandTotalByCreatedAtBetween(LocalDateTime start, LocalDateTime end);
    Long countByCreatedAtBetween(LocalDateTime start, LocalDateTime end);
}
```

---

## 7. Configuración

### 7.1 application.properties

```properties
server.port=${SERVER_PORT:9090}
spring.datasource.url=${SPRING_DATASOURCE_URL:jdbc:mysql://localhost:3306/lunaria_database}
spring.datasource.username=${SPRING_DATASOURCE_USERNAME:root}
spring.datasource.password=${SPRING_DATASOURCE_PASSWORD:}

spring.jpa.hibernate.ddl-auto=${SPRING_JPA_HIBERNATE_DDL_AUTO:validate}
server.servlet.context-path=${SERVER_SERVLET_CONTEXT_PATH:/api/v1.0}

app.server.url=${APP_SERVER_URL:http://localhost:9090}

# AWS S3 (opcional)
aws.access.key=${AWS_ACCESS_KEY:-}
aws.secret.key=${AWS_SECRET_KEY:-}
aws.region=${AWS_REGION:us-east-1}
aws.bucket.name=${AWS_BUCKET_NAME:}

# JWT
jwt.secret.key=${JWT_SECRET_KEY:lunaria_secret_key_please_change_in_production_minimum_256_bits_required}
```

---

### 7.2 Dependencias Maven (pom.xml)

```xml
<dependencies>
    <!-- Spring Boot Starters -->
    <dependency>
        <groupId>org.springframework.boot</groupId>
        <artifactId>spring-boot-starter-web</artifactId>
    </dependency>
    <dependency>
        <groupId>org.springframework.boot</groupId>
        <artifactId>spring-boot-starter-data-jpa</artifactId>
    </dependency>
    <dependency>
        <groupId>org.springframework.boot</groupId>
        <artifactId>spring-boot-starter-security</artifactId>
    </dependency>
    
    <!-- MySQL -->
    <dependency>
        <groupId>com.mysql</groupId>
        <artifactId>mysql-connector-j</artifactId>
    </dependency>
    
    <!-- AWS S3 -->
    <dependency>
        <groupId>software.amazon.awssdk</groupId>
        <artifactId>s3</artifactId>
    </dependency>
    
    <!-- JWT -->
    <dependency>
        <groupId>io.jsonwebtoken</groupId>
        <artifactId>jjwt</artifactId>
        <version>0.9.1</version>
    </dependency>
    
    <!-- OpenAPI / Swagger -->
    <dependency>
        <groupId>org.springdoc</groupId>
        <artifactId>springdoc-openapi-starter-webmvc-ui</artifactId>
        <version>2.7.0</version>
    </dependency>
    
    <!-- Lombok -->
    <dependency>
        <groupId>org.projectlombok</groupId>
        <artifactId>lombok</artifactId>
    </dependency>
    
    <!-- Testing -->
    <dependency>
        <groupId>org.seleniumhq.selenium</groupId>
        <artifactId>selenium-java</artifactId>
        <version>4.18.1</version>
        <scope>test</scope>
    </dependency>
</dependencies>
```

---

## 8. Documentación API (OpenAPI/Swagger)

La documentación interactiva está disponible en:

```
http://localhost:9090/api/v1.0/swagger-ui/index.html
```

O el endpoint JSON:

```
http://localhost:9090/api/v1.0/v3/api-docs
```

---

*Documento generado para el proyecto Lunaria v2*
*Backend: Spring Boot 3.4.4 + Java 17*
