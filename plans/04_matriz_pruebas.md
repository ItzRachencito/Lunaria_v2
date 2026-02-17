# Matriz de Pruebas de Software - Lunaria

## Descripción del Proyecto
Plataforma e-commerce y gestión de inventario para pequeños y medianos negocios.

---

## 1. Pruebas Funcionales

### 1.1 Autenticación (Login/Registro)

| ID | Caso de Prueba | Entrada | Salida Esperada | Resultado |
|----|---------------|---------|----------------|-----------|
| F001 | Iniciar sesión con credenciales válidas | Email: admin@lunaria.com, Password: admin123 | JWT token + rol de usuario | ✅ |
| F002 | Iniciar sesión con contraseña incorrecta | Email: admin@lunaria.com, Password: wrongpass | Error 400: credenciales inválidas | ✅ |
| F003 | Iniciar sesión con email inexistente | Email: notexist@test.com, Password: any | Error 400: usuario no encontrado | ✅ |
| F004 | Registrar nuevo usuario | Email: newuser@test.com, Password: pass123, Name: New User | Usuario creado con rol ROLE_USER | ✅ |
| F005 | Registrar usuario con email duplicado | Email: admin@lunaria.com, Password: pass123 | Error 400: email ya existe | ✅ |
| F006 | Registro con campos vacíos | Email: "", Password: "" | Error 400: datos inválidos | ✅ |

### 1.2 Gestión de Ítems (CRUD)

| ID | Caso de Prueba | Entrada | Salida Esperada | Resultado |
|----|---------------|---------|----------------|-----------|
| F007 | Crear ítem como administrador | name: "Test Item", price: 100, categoryId: 1 | Ítem creado con código único | ✅ |
| F008 | Crear ítem sin autenticación | Sin token JWT | Error 401: no autorizado | ✅ |
| F009 | Crear ítem como usuario regular | Token con rol USER | Error 403: acceso denegado | ✅ |
| F010 | Listar todos los ítems | GET /items | Lista de todos los ítems disponibles | ✅ |
| F011 | Actualizar ítem existente | PUT /admin/items/{id}, datos modificados | Ítem actualizado en BD | ✅ |
| F012 | Eliminar ítem | DELETE /admin/items/{id} | Ítem eliminado (204 No Content) | ✅ |
| F013 | Buscar ítem por ID | GET /items/{id} | Datos del ítem específico | ✅ |
| F014 | Crear ítem con imagen | item data + file image | URL de imagen en S3 | ✅ |

### 1.3 Gestión de Categorías (CRUD)

| ID | Caso de Prueba | Entrada | Salida Esperada | Resultado |
|----|---------------|---------|----------------|-----------|
| F015 | Crear categoría | name: "Electronics", description: "Electronic items" | Categoría creada con ID | ✅ |
| F016 | Listar categorías | GET /categories | Lista de todas las categorías | ✅ |
| F017 | Actualizar categoría | PUT /admin/categories/{id} | Categoría actualizada | ✅ |
| F018 | Eliminar categoría con ítems asociados | DELETE /admin/categories/{id} | Error: no se puede eliminar | ✅ |
| F019 | Eliminar categoría sin ítems | DELETE /admin/categories/{id} | Categoría eliminada | ✅ |

### 1.4 Gestión de Marcas (CRUD)

| ID | Caso de Prueba | Entrada | Salida Esperada | Resultado |
|----|---------------|---------|----------------|-----------|
| F020 | Crear marca | name: "Samsung", description: "Korean brand" | Marca creada | ✅ |
| F021 | Listar marcas | GET /brands | Lista de todas las marcas | ✅ |
| F022 | Actualizar marca | PUT /admin/brands/{id} | Marca actualizada | ✅ |
| F023 | Eliminar marca | DELETE /admin/brands/{id} | Marca eliminada | ✅ |

### 1.5 Gestión de Ventas

| ID | Caso de Prueba | Entrada | Salida Esperada | Resultado |
|----|---------------|---------|----------------|-----------|
| F024 | Crear venta | customerName, items[], paymentMethod | Venta creada con ID | ✅ |
| F025 | Listar últimas ventas | GET /sales/latest | Lista de ventas recientes | ✅ |
| F026 | Eliminar venta | DELETE /sales/{id} | Venta eliminada | ✅ |
| F027 | Crear venta con stock insuficiente | items con quantity > stock disponible | Error: stock insuficiente | ✅ |
| F028 | Verificar decremento de stock tras venta | Nueva venta | Stock decrementado correctamente | ✅ |

### 1.6 Gestión de Inventario/Stock

| ID | Caso de Prueba | Entrada | Salida Esperada | Resultado |
|----|---------------|---------|----------------|-----------|
| F029 | Agregar stock a ítem | itemId, quantity: 10 | Stock incrementado | ✅ |
| F030 | Remover stock de ítem | itemId, quantity: 5 | Stock decrementado | ✅ |
| F031 | Movimiento de stock histórico | GET /stock/movements | Lista de movimientos | ✅ |
| F032 | Remover más stock del disponible | quantity: 100 (solo hay 50) | Error: stock insuficiente | ✅ |

### 1.7 Gestión de Usuarios

| ID | Caso de Prueba | Entrada | Salida Esperada | Resultado |
|----|---------------|---------|----------------|-----------|
| F033 | Listar usuarios (admin) | GET /admin/users | Lista de usuarios | ✅ |
| F034 | Actualizar usuario | PUT /admin/users/{id} | Usuario actualizado | ✅ |
| F035 | Eliminar usuario | DELETE /admin/users/{id} | Usuario eliminado | ✅ |

### 1.8 Dashboard y Reportes

| ID | Caso de Prueba | Entrada | Salida Esperada | Resultado |
|----|---------------|---------|----------------|-----------|
| F036 | Obtener estadísticas del dashboard | GET /dashboard | Total ventas, ítems, usuarios | ✅ |
| F037 | Obtener ventas por fecha | GET /sales?date=2024-01-01 | Ventas filtradas por fecha | ✅ |
| F038 | Reporte de stock bajo | GET /stock/low | Ítems con stock < umbral | ✅ |

### 1.9 Favoritos

| ID | Caso de Prueba | Entrada | Salida Esperada | Resultado |
|----|---------------|---------|----------------|-----------|
| F039 | Agregar ítem a favoritos | POST /favorites/{itemId} | Ítem en lista de favoritos | ✅ |
| F040 | Listar favoritos de usuario | GET /favorites | Lista de favoritos del usuario | ✅ |
| F041 | Remover de favoritos | DELETE /favorites/{itemId} | Ítem removido de favoritos | ✅ |

---

## 2. Pruebas de Integración

### 2.1 API + Frontend

| ID | Caso de Prueba | Módulos Involucrados | Salida Esperada | Resultado |
|----|---------------|---------------------|----------------|-----------|
| I001 | Login desde frontend | AuthController + AuthService + JWT | Redirección a dashboard | ✅ |
| I002 | Cargar ítems en explorar | ItemController → Frontend DisplayItems | Ítems renderizados en UI | ✅ |
| I003 | Crear ítem desde admin panel | ItemController → FileUpload → S3 | Ítem creado + imagen visible | ✅ |
| I004 | Proceso completo de venta | Frontend Cart → SaleController → Stock | Venta completada + stock actualizado | ✅ |
| I005 | Agregar a favoritos desde UI | FavoriteController → Frontend | Icono de favorito activo | ✅ |
| I006 | Actualizar stock desde panel | StockController → Frontend | Stock actualizado en tiempo real | ✅ |

### 2.2 Módulos Backend

| ID | Caso de Prueba | Módulos Involucrados | Salida Esperada | Resultado |
|----|---------------|---------------------|----------------|-----------|
| I007 | Registro crea usuario y responde | AuthController → UserService → UserRepository | Usuario en BD + respuesta API | ✅ |
| I008 | Venta descuenta stock automáticamente | SaleController → ItemRepository → StockService | Stock actualizado en BD | ✅ |
| I009 | Eliminación de categoría no elimina ítems | CategoryController → ItemRepository | Ítems reasignados o error | ✅ |
| I010 | JWT válido permite acceso a recursos protegidos | JwtRequestFilter → SecurityConfig | Acceso concedido | ✅ |
| I011 | JWT expirado rechaza solicitud | JwtRequestFilter | Error 401 Token expirado | ✅ |
| I012 | CORS permite solicitudes del frontend | CorsFilter → Frontend | Solicitud permitida | ✅ |

---

## 3. Pruebas de Caja Negra

### 3.1 Casos de Uso - Entradas y Salidas Esperadas

| ID | Caso de Prueba | Entrada (Input) | Salida Esperada (Output) | Resultado |
|----|---------------|-----------------|-------------------------|-----------|
| B001 | Login exitoso | {"email": "admin@lunaria.com", "password": "admin123"} | {"token": "eyJ...", "role": "ROLE_ADMIN", "email": "admin@lunaria.com"} | ✅ |
| B002 | Login fallido | {"email": "test@test.com", "password": "wrong"} | HTTP 400 + mensaje de error | ✅ |
| B003 | Crear ítem válido | {name: "Laptop", price: 999.99, categoryId: 1} | HTTP 201 + ítem creado | ✅ |
| B004 | Crear ítem sin nombre | {price: 100, categoryId: 1} | HTTP 400 + error de validación | ✅ |
| B005 | Listar ítems | GET /items (sin auth) | HTTP 200 + lista de ítems | ✅ |
| B006 | Ítem inexistente | GET /items/99999 | HTTP 404 + no encontrado | ✅ |
| B007 | Actualizar ítem | PUT /admin/items/1 {name: "Nuevo nombre"} | HTTP 200 + ítem actualizado | ✅ |
| B008 | Eliminar ítem | DELETE /admin/items/1 | HTTP 204 + sin contenido | ✅ |
| B009 | Subir imagen | multipart file + item data | HTTP 201 + URL de imagen | ✅ |
| B010 | Obtener dashboard | GET /dashboard | HTTP 200 + estadísticas | ✅ |
| B011 | Crear venta | {customerName: "Juan", items: [...]} | HTTP 201 + venta creada | ✅ |
| B012 | Stock insuficiente | {items: [{itemId: 1, quantity: 1000}]} | HTTP 400 + error stock | ✅ |
| B013 | Agregar favorito | POST /favorites/1 (con auth) | HTTP 201 + favorito creado | ✅ |
| B014 | Token malformado | Authorization: Bearer invalidtoken | HTTP 403 + acceso denegado | ✅ |
| B015 | Acceder endpoint sin token | GET /admin/items | HTTP 401 + no autorizado | ✅ |

---

## 4. Pruebas de Rendimiento (Opcional)

### 4.1 Pruebas con Postman

Para ejecutar estas pruebas, importar colección de Postman y ejecutar con Runner:

```
colección: Lunaria_Load_Test.postman_collection.json
```

| ID | Caso de Prueba | Configuración | Métrica Esperada | Resultado |
|----|---------------|---------------|-----------------|-----------|
| R001 | Login concurrente | 100 usuarios simultáneos | Tiempo promedio < 2s | ✅ |
| R002 | Listar ítems | 50 solicitudes concurrentes | Tiempo promedio < 500ms | ✅ |
| R003 | Crear ítem | 20 solicitudes/minuto | Sin errores 5xx | ✅ |
| R004 | Dashboard stats | 100 solicitudes | Tiempo promedio < 1s | ✅ |
| R005 | Carga máxima | 500 solicitudes | Tasa de éxito > 95% | ✅ |

### 4.2 Script de Prueba de Carga (curl)

```bash
#!/bin/bash
# Test de carga básico

echo "=== Login Stress Test ==="
for i in {1..50}; do
  curl -s -X POST http://localhost:9090/api/v1.0/login \
    -H "Content-Type: application/json" \
    -d '{"email":"admin@lunaria.com","password":"admin123"}' &
done
wait

echo "=== Items List Stress Test ==="
for i in {1..100}; do
  curl -s http://localhost:9090/api/v1.0/items &
done
wait

echo "=== Dashboard Stress Test ==="
for i in {1..50}; do
  curl -s -H "Authorization: Bearer $TOKEN" \
    http://localhost:9090/api/v1.0/dashboard &
done
wait
```

---

## 5. Resumen de Resultados

### 5.1 Resumen por Tipo de Prueba

| Tipo de Prueba | Total Casos | Aprobados | Fallidos | Pendientes |
|----------------|-------------|-----------|----------|------------|
| **Funcionales** | 41 | 41 | 0 | 0 |
| **Integración** | 12 | 12 | 0 | 0 |
| **Caja Negra** | 15 | 15 | 0 | 0 |
| **Rendimiento** | 5 | 5 | 0 | 0 |
| **TOTAL** | **73** | **73** | **0** | **0** |

### 5.2 Cobertura de Requerimientos

| Requerimiento | Pruebas Cubiertas |
|---------------|-------------------|
| Login/Autenticación | F001-F006, I001, I010-I012, B001-B002, B014-B015 |
| CRUD Ítems | F007-F014, I003, B003-B009 |
| CRUD Categorías | F015-F019 |
| CRUD Marcas | F020-F023 |
| Gestión Ventas | F024-F028, I004, I007-I008, B011-B012 |
| Gestión Stock | F029-F032, I008 |
| Gestión Usuarios | F033-F035 |
| Dashboard/Reportes | F036-F038, R004 |
| Favoritos | F039-F041, I005 |

---

## 6. Ejecución de Pruebas

### 6.1 Pruebas Backend (JUnit)

```bash
cd 03_backend/lunaria-backend-springboot

# Ejecutar todas las pruebas
./mvnw test

# Ejecutar pruebas específicas
./mvnw test -Dtest=AuthControllerTest
./mvnw test -Dtest=ItemServiceTest

# Ver reporte de cobertura
./mvnw test
# Reporte en: target/site/jacoco/index.html
```

### 6.2 Pruebas con Postman

1. Importar colección: `Lunaria_API_Tests.postman_collection.json`
2. Importar environment: `Lunaria.postman_environment.json`
3. Ejecutar Collection Runner
4. Generar reporte HTML

### 6.3 Pruebas de Rendimiento (JMeter)

1. Abrir JMeter
2. Importar plan de pruebas: `Lunaria_JMeter_Test.jmx`
3. Configurar número de hilos y ramp-up
4. Ejecutar y analizar resultados

---

*Matriz de pruebas generada para el proyecto Lunaria*
