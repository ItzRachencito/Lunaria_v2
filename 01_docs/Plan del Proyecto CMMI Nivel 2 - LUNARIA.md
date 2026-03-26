# Plan del Proyecto CMMI Nivel 2 - LUNARIA

## 1. Información General del Proyecto

| Elemento | Descripción |
|----------|-------------|
| Nombre del Proyecto | Sistema Web y Móvil de Gestión de Inventarios - LUNARIA |
| Cliente | Comercializadora de repuestos y accesorios (Uso interno) |
| Patrocinador | Santiago Rachen |
| Jefe del Proyecto | Santiago Rachen |
| Fecha Inicio | 01-10-2025 |
| Fecha Final | 15-03-2026 (5.5 meses) |
| Duridad | 5.5 meses (22 semanas) |
| Metodología | Scrum + CMM nivel 2 |
| Presupuesto | $28.760.000 COP |
| Versión | 1.0 |

## 2. Alcance del Proyecto

**Desarrollar un sistema web y móvil que permita gestionar productos, ventas, inventario y clientes en tiempo real.**

### Incluyen:
- ✅ Registro y gestión de productos con imágenes
- ✅ Control de inventarios en tiempo real
- ✅ Módulo de ventas con facturación
- ✅ Autenticación de usuarios con JWT
- ✅ Roles de usuario (ADMIN, USER)
- ✅ Aplicación móvil (Android/iOS)
- ✅ Módulo de favoritos para clientes
- ✅ Dashboard con estadísticas
- ✅ Recuperación de contraseña por email

### No incluye:
- ❌ Integración contable externa
- ❌ Módulo de proveedores
- ❌ Módulo de compras

---

## 3. Requisitos Principales

### 3.1 Requerimientos Funcionales

| ID | Descripción | Prioridad |
|----|-------------|-----------|
| RF-01 | Iniciar sesión con email y contraseña, retornar token JWT | Alta |
| RF-02 | Registrar nuevos usuarios con rol por defecto (ROLE_USER) | Alta |
| RF-03 | Validar que el email no esté registrado previamente | Alta |
| RF-04 | Proteger rutas según rol del usuario autenticado | Alta |
| RF-05 | Listar todos los usuarios registrados (solo ADMIN) | Media |
| RF-06 | Modificar roles de usuarios (solo ADMIN) | Media |
| RF-07 | Listar todos los productos disponibles con imagen, nombre, precio y stock | Alta |
| RF-08 | Buscar productos por nombre, marca o categoría | Alta |
| RF-09 | Crear nuevos productos con nombre, descripción, precios y stock | Alta |
| RF-10 | Subir imagen al crear un producto | Alta |
| RF-11 | Generar UUID único para cada producto | Alta |
| RF-12 | Editar datos de un producto existente (solo ADMIN) | Alta |
| RF-13 | Eliminar productos del catálogo (solo ADMIN) | Alta |
| RF-14 | Listar todas las categorías disponibles | Alta |
| RF-15 | Crear categorías con nombre, descripción e imagen | Alta |
| RF-16 | Editar categorías (solo ADMIN) | Alta |
| RF-17 | Eliminar categorías (solo ADMIN) | Alta |
| RF-18 | Listar todas las marcas disponibles | Alta |
| RF-19 | Crear y editar marcas (solo ADMIN) | Media |
| RF-20 | Registrar ventas con información del cliente | Alta |
| RF-21 | Generar comprobante de venta | Alta |
| RF-22 | Actualizar stock automáticamente después de venta | Alta |
| RF-23 | Registrar movimientos de inventario | Alta |
| RF-24 | Ver historial de movimientos de stock | Media |
| RF-25 | Agregar/quitar productos de favoritos | Alta |
| RF-26 | Ver dashboard con estadísticas de ventas | Alta |
| RF-27 | Recuperar contraseña mediante código OTP | Alta |
| RF-28 | Ver historial de ventas propias (USER) o todas (ADMIN) | Alta |
| RF-29 | Subir imágenes de productos a Cloudinary | Alta |
| RF-30 | Desplegar API en servidor (Railway/AWS) | Alta |

### 3.2 Requerimientos No Funcionales

| ID | Descripción | Prioridad |
|----|-------------|-----------|
| RNF-01 | Tiempo de Respuesta <3 segundos | Rendimiento |
| RNF-02 | Acceso seguro con JWT y HTTPS | Seguridad |
| RNF-03 | Disponibilidad 99% | Confiabilidad |
| RNF-04 | API RESTful con documentación Swagger | Interoperabilidad |
| RNF-05 | Base de datos MySQL con respaldos | Confiabilidad |
| RNF-06 | Diseño responsivo para web y móvil | Usabilidad |

---

## 4. Planificación del Proyecto

### 4.1 Fases del Proyecto

| Fase | Descripción | Duración | Responsable |
|------|-------------|----------|-------------|
| Inicio | Definición alcance y requisitos | 1 semana | Santiago Rachen |
| Análisis | Levantamiento de requisitos detallados | 2 semanas | Santiago Rachen |
| Diseño | Arquitectura del sistema y base de datos | 2 semanas | Santiago Rachen |
| Desarrollo Backend | API REST con Spring Boot | 6 semanas | Santiago Rachen |
| Desarrollo Frontend Web | Interfaz web con React | 4 semanas | Santiago Rachen |
| Desarrollo Móvil | App con React Native/Expo | 4 semanas | Santiago Rachen |
| Pruebas | Unitarias, integración y aceptación | 2 semanas | Santiago Rachen |
| Despliegue | Configuración de servidores y entrega | 1 semana | Santiago Rachen |
| **Total** | | **22 semanas (5.5 meses)** | |

### 4.2 Cronograma de Gantt

#### 4.2.1 Vista General del Proyecto (22 semanas / 5.5 meses)

```
┌─────────────────────────────────────────────────┬─────────────────────────────────────────────────────────────────────────────────┐
│ FASE / ACTIVIDAD                                │ SEMANA                                                                        │
│                                                 │ 1  2  3  4  5  6  7  8  9  10 11 12 13 14 15 16 17 18 19 20 21 22          │
├─────────────────────────────────────────────────┼─────────────────────────────────────────────────────────────────────────────────┤
│ ▶ INICIO Y ANÁLISIS                             │████                                                                             │
│   • Kick-off y planificación                     │██                                                                               │
│   • Levantamiento de requisitos                  │ ██                                                                              │
│   • Validación con cliente                       │  ██                                                                             │
├───────────────────────────────────────────────── ┼─────────────────────────────────────────────────────────────────────────────────┤
│ ▶ DISEÑO                                        │     ████                                                                         │
│   • Arquitectura del sistema                     │     ██                                                                           │
│   • Diseño de base de datos                      │      ██                                                                          │
│   • Wireframes y prototipos                      │       ██                                                                         │
├──────────────────────────────────────────────── ┼─────────────────────────────────────────────────────────────────────────────────┤
│ ▶ DESARROLLO BACKEND                            │         ████████████████████████                                                  │
│   • Configuración entorno                      │         ██                                                                          │
│   • Autenticación y usuarios                  │          ████                                                                      │
│   • Productos, categorías, marcas            │              ████                                                                  │
│   • Ventas e inventario                       │                   ████                                                           │
│   • Dashboard y reportes                      │                        ████                                                        │
│   • Pruebas unitarias API                     │                             ██                                                    │
├─────────────────────────────────────────────────┼─────────────────────────────────────────────────────────────────────────────────┤
│ ▶ DESARROLLO FRONTEND WEB                     │                                   ██████████████                                  │
│   • Configuración React                       │                                   ██                                              │
│   • UI/UX y componentes                      │                                    ████                                          │
│   • Módulo Admin                              │                                        ████                                      │
│   • Módulo Cliente                            │                                             ████                                  │
│   • Integración y pruebas                     │                                                  ████                                 │
├─────────────────────────────────────────────────┼─────────────────────────────────────────────────────────────────────────────────┤
│ ▶ DESARROLLO MÓVIL                            │                                        ██████████████████████                        │
│   • Configuración Expo                        │                                        ██                                            │
│   • UI Móvil y navegación                    │                                         ████                                        │
│   • Integración API                          │                                              ████                                    │
│   • Funcionalidades adicionales              │                                                   ████                                │
│   • Build y pruebas                          │                                                        ████                           │
├─────────────────────────────────────────────────┼─────────────────────────────────────────────────────────────────────────────────┤
│ ▶ PRUEBAS INTEGRALES                          │                                                                    ██████          │
│   • Pruebas de integración                  │                                                                    ████              │
│   • QA y ajustes                              │                                                                     ████             │
├─────────────────────────────────────────────────┼─────────────────────────────────────────────────────────────────────────────────┤
│ ▶ DESPLIEGUE Y CIERRE                         │                                                                         ████          │
│   • Configuración producción                 │                                                                         ██              │
│   • Deployment                                │                                                                          ██             │
│   • Documentación y entrega                   │                                                                           ██            │
└─────────────────────────────────────────────────┴─────────────────────────────────────────────────────────────────────────────────┘
```

#### 4.2.2 Detalle Semanal por Sprint (22 Semanas)

| Semana | Fase | Actividades Principales | Entregable | Responsabilidad |
|--------|------|------------------------|------------|-----------------|
| **SP 1** | Inicio | Kick-off, definición alcance, plan de proyecto,配置Git | Plan de Proyecto | PM |
| **SP 2** | Análisis | Requisitos funcionales, historias de usuario, priorización | Documento de Requisitos | Analista |
| **SP 3** | Análisis | Validación SRS con cliente, aprobación | SRS Firmado | Analista/Cliente |
| **SP 4** | Diseño | Arquitectura sistema, diagramas UML, modelo ER | Arquitectura | Arquit. |
| **SP 5** | Diseño | Wireframes, prototipo interactivo Figma | Prototipo UI/UX | Diseñador |
| **SP 6** | Backend | Config Spring Boot, security, JWT, repositorio | Entorno Listo | Dev Backend |
| **SP 7** | Backend | API Auth: login, register, recovery password | Auth API | Dev Backend |
| **SP 8** | Backend | API Usuarios: CRUD, roles, permisos | Usuarios API | Dev Backend |
| **SP 9** | Backend | API Productos: CRUD, upload imágenes Cloudinary | Productos API | Dev Backend |
| **SP 10** | Backend | API Categorías y Marcas, búsqueda | Catálogo API | Dev Backend |
| **SP 11** | Backend | API Ventas, comprobantes, inventario | Ventas API | Dev Backend |
| **SP 12** | Backend | Dashboard estadísticas, reportes, testing unitario | Dashboard API | Dev Backend |
| **SP 13** | Web | Config React, routing, Redux, estructura | Web Base | Dev Frontend |
| **SP 14** | Web | UI Components: Buttons, Cards, Forms, Tables | Componentes | Dev Frontend |
| **SP 15** | Web | Admin: Gestión productos, categorías, reportes | Admin Web | Dev Frontend |
| **SP 16** | Web | Cliente: Catálogo, carrito, checkout, perfil | Cliente Web | Dev Frontend |
| **SP 17** | Móvil | Config Expo, React Navigation, estructura | Móvil Base | Dev Móvil |
| **SP 18** | Móvil | UI: Login, Dashboard, Explorar, Perfil | UI Móvil | Dev Móvil |
| **SP 19** | Móvil | Funcionalidades: Productos, Favoritos, Carrito | Funcionalidades | Dev Móvil |
| **SP 20** | Móvil | Integración API, Testing, Ajustes | App Tested | Dev Móvil |
| **SP 21** | Pruebas | Integración completa, E2E testing, QA | Sistema Integrado | QA |
| **SP 22** | Despliegue | Railway, Netlify, APK, Docs, Entrega final | Producción | DevOps |

#### 4.2.3 Hitos del Proyecto (Milestones)

| Hito | Semana | Fecha Esperada | Descripción | Criterio de Éxito | Entregable |
|------|--------|----------------|-------------|-------------------|------------|
| M1 | 1 | Semana 1 | Inicio del Proyecto | Plan aprobado por sponsor | Plan de Proyecto |
| M2 | 3 | Semana 3 | Fin de Análisis | Requisitos freezeados | SRS Documento |
| M3 | 5 | Semana 5 | Fin de Diseño | Prototipo aprobado | Wireframes/Figma |
| M4 | 12 | Semana 12 | Fin de Backend | API 100% funcional | API Docs (Swagger) |
| M5 | 16 | Semana 16 | Fin de Frontend Web | Web en staging | Web App |
| M6 | 20 | Semana 20 | Fin de Frontend Móvil | App en staging | Expo Build |
| M7 | 21 | Semana 21 | Fin de Pruebas | Zero defectos críticos | QA Report |
| M8 | 22 | Semana 22 | Despliegue Producción | Sistema vivo | URLs Produccón |
| M9 | 22 | Semana 22 | Cierre del Proyecto | Acta de entrega-signed | Acta Final |

### 4.3 Presupuesto Estimado

#### 4.3.1 Recursos Humanos (Desarrollo)

| Recurso | Cantidad | Costo Mensual | Meses | Total |
|---------|----------|---------------|-------|-------|
| Desarrollador Full Stack | 1 | $4.000.000 COP | 5.5 | $22.000.000 COP |
| **Subtotal RRHH** | | | | **$22.000.000 COP** |

> **Nota**: Salario promedio de desarrollador Full Stack en Colombia (2025-2026): $3.500.000 - $5.000.000 COP/mes

#### 4.3.2 Infraestructura y Servicios

| Concepto | Costo Mensual | Duración (6 meses) | Total |
|---------|---------------|-------------------|-------|
| Dominio (.com) | $50.000 COP | 6 meses | $300.000 COP |
| Servidor Backend (Railway) | $150.000 COP | 6 meses | $900.000 COP |
| Base de datos MySQL (Railway) | $100.000 COP | 6 meses | $600.000 COP |
| Cloudinary (imágenes) | $0 COP | 6 meses | $0 COP |
| Certificados SSL | $0 COP | 6 meses | $0 COP |
| **Subtotal Infraestructura** | | | **$1.800.000 COP** |

#### 4.3.3 Servicios y Otros

| Concepto | Costo | Notas |
|----------|-------|-------|
| Energía eléctrica (laptop) | $40.000 COP | 5.5 meses de desarrollo, 8h/día |
| Internet | $80.000 COP | 5.5 meses de desarrollo |
| Software (IDE, herramientas) | $0 COP | VS Code, Git gratuitos |
| **Subtotal Servicios** | | **$660.000 COP** |

#### 4.3.4 Equipo de Trabajo

| Equipo | Costo Estimado | Vida útil |
|--------|---------------|-----------|
| Laptop Desarrollo (8GB RAM, i5+) | $3.500.000 COP | Proyecto |
| Celular para pruebas (Android) | $800.000 COP | Proyecto |
| **Subtotal Equipo** | | **$4.300.000 COP** |

#### 4.3.5 Resumen del Presupuesto

| Categoría | Total |
|-----------|-------|
| Recursos Humanos | $22.000.000 COP |
| Infraestructura | $1.800.000 COP |
| Servicios y Otros | $660.000 COP |
| Equipo de Trabajo | $4.300.000 COP |
| **TOTAL PROYECTO** | **$28.760.000 COP** |

> **Nota**: El presupuesto puede variar según:
> - Experiencia del desarrollador (junior: $2.5M, senior: $6M+)
> - Si se contratan servicios adicionales (diseño UI, testing)
> - Costos de mantenimiento post-lanzamiento

---

## 5. Gestión de Requisitos (REQM)

- ✅ Requisitos documentados en código y archivos
- ✅ Control de cambios mediante control de versiones (Git)
- ✅ Historial de cambios en commits
- ✅ Trazabilidad: Requisitos → Código → Pruebas
- ✅ Validación con el cliente (usuario)

---

## 6. Gestión de Configuración (CM)

| Elemento | Descripción |
|----------|-------------|
| Repositorio | GitHub: github.com/santiago-rachen/lunaria |
| Rama Principal | main |
| Ramas de Desarrollo | develop |
| Ramas de Funciones | feature/* |
| Control de Cambios | Pull Requests con revisión |
| Versiones | Tags semánticos (v1.0, v1.1, etc.) |
| Baseline | Por cada Sprint completado |

---

## 7. Monitoreo y Control (PMC)

| Actividad | Frecuencia | Responsable |
|-----------|------------|-------------|
| Daily Standup | Diaria | Equipo |
| Sprint Planning | Quincenal | Scrum Master |
| Sprint Review | Quincenal | Equipo |
| Sprint Retrospective | Quincenal | Equipo |
| Seguimiento de Avance | Semanal | Product Owner |
| Control de Riesgos | Continuo | Equipo |

---

## 8. Gestión de Riesgos

| Riesgo | Impacto | Probabilidad | Plan de Mitigación |
|--------|---------|--------------|-------------------|
| Retrasos en desarrollo | Alto | Media | Sprint cortos, priorización |
| Cambios frecuentes en requisitos | Alto | Alta | Control de cambios, Freeze de requisitos |
| Problemas de despliegue | Medio | Baja | Documentación, pruebas locales |
| Caída del servidor | Alto | Baja | Monitoreo, alertas |
| Pérdida de datos | Crítico | Baja | Backups automáticos |

---

## 9. Aseguramiento de Calidad (PPQA)

- ✅ Pruebas unitarias en backend (JUnit)
- ✅ Pruebas de integración (Selenium WebDriver)
- ✅ Pruebas de API con Postman
- ✅ Revisión de código
- ✅ Pruebas de aceptación manuales

---

## 10. Métricas de Medición (MA)

| Métrica | Descripción | Frecuencia |
|---------|-------------|------------|
| Velocidad del Sprint | Historias de usuario completadas | Quincenal |
| Defectos | Número de errores encontrados | Semanal |
| Cobertura de pruebas | % de código probado | Por Sprint |
| Tiempo de respuesta | Latencia de API | Continuo |

---

## 11. Gestión de Proveedores (SAM)

| Proveedor | Servicio | Costo | Evaluación |
|-----------|----------|-------|------------|
| Railway | Hosting Backend + MySQL | $0-50/mes | Bueno |
| Cloudinary | Almacenamiento imágenes | Gratis | Excelente |
| Expo | Desarrollo móvil | Gratis | Excelente |
| GitHub | Repositorio código | Gratis | Excelente |

---

## 12. Entregables

| Entregable | Fecha | Estado |
|------------|-------|--------|
| Documento de Requisitos | 30-01-2025 | ✅ Completado |
| Diseño del Sistema (UML) | 15-02-2025 | ✅ Completado |
| Prototipo UI/UX | 28-02-2025 | ✅ Completado |
| API Backend | 15-04-2025 | ✅ Completado |
| Frontend Web | 30-06-2025 | ✅ Completado |
| App Móvil | 15-10-2025 | ✅ Completado |
| Sistema Integrado | 15-01-2026 | ✅ Completado |
| Pruebas y Ajustes | 25-02-2026 | ✅ Completado |
| Despliegue Produccón | 25-03-2026 | ✅ Completado |

---

## 13. Aprobaciones

| Rol | Nombre | Fecha | Firma |
|-----|--------|-------|-------|
| Patrocinador | Santiago Rachen | _____________ | _____________ |
| Jefe de Proyecto | Santiago Rachen | _____________ | _____________ |
| Cliente | _____________ | _____________ | _____________ |

---

## 14. Tecnologías Utilizadas

### Backend
- Java 17
- Spring Boot 3.x
- Spring Security con JWT
- MySQL 8
- Hibernate/JPA
- Swagger/OpenAPI
- Cloudinary (imágenes)
- Maven

### Frontend Web
- React
- React Router
- Redux Toolkit
- Axios
- Bootstrap/Tailwind

### Frontend Móvil
- React Native
- Expo
- Redux Toolkit Query
- React Navigation

### Infraestructura
- Railway (Backend + MySQL)
- Cloudinary (Imágenes)
- GitHub (Código)

---

*Documento generado el 26-03-2026*
*Versión 1.0*
