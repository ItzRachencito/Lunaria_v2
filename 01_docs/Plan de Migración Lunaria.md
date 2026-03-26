# PLAN DE MIGRACIÓN DEL SISTEMA LUNARIA

---

## 1. INTRODUCCIÓN

### 1.1 Propósito del Plan
Este documento establece los procedimientos y estrategias para migrar el sistema LUNARIA a nuevos proveedores de infraestructura en caso de saturación, problemas de servicio, costos elevados o descontinuación de servicios actuales.

### 1.2 Servicios Actuales a Migrar

| Servicio | Proveedor Actual | Función |
|----------|-----------------|---------|
| Backend API | Railway | Hospedaje del servidor Spring Boot |
| Base de datos | Railway (MySQL) | Almacenamiento de datos |
| Imágenes | Cloudinary | Almacenamiento de archivos multimedia |
| Dominio | [Proveedor actual] | Dirección web |
| CDN/Frontend | Vercel/Netlify | Hospedaje web estático |
| Git | GitHub | Control de versiones |

### 1.3 Proveedores Alternativos (Backup)

| Servicio | Proveedor Alternativo 1 | Proveedor Alternativo 2 |
|----------|------------------------|------------------------|
| Backend API | Render | DigitalOcean App Platform |
| Base de datos | PlanetScale (MySQL) | Supabase (PostgreSQL) |
| Imágenes | AWS S3 | Google Cloud Storage |
| Dominio | Namecheap | GoDaddy |
| CDN/Frontend | Vercel | Cloudflare Pages |
| Email | SendGrid | Amazon SES |

---

## 2. ESCENARIOS DE MIGRACIÓN

### 2.1 Cuándo Considerar la Migración

| Escenario | Indicadores | Severidad |
|-----------|-------------|-----------|
| **Saturación del servidor** | CPU >90% consistently, memory limits reached | Alta |
| **Costos elevados** | Monthly costs exceed budget by 50% | Media |
| **Problemas de disponibilidad** | Downtime >1% monthly, frequent outages | Crítica |
| **Fin de servicio** | Provider announces discontinuation | Crítica |
| **Rendimiento insuficiente** | Response times >5s consistently | Alta |
| **Seguridad comprometida** | Vulnerabilities unpatched | Crítica |
| **Soporte deficiente** | No response to critical issues | Media |

### 2.2 Tipos de Migración

| Tipo | Descripción | Tiempo Estimado |
|------|-------------|-----------------|
| **Migración completa** | Mover todos los servicios a nuevos proveedores | 2-4 semanas |
| **Migración parcial** | Migrar solo servicios problemáticos | 1-2 semanas |
| **Migración incremental** | Mover componentes uno por uno | 3-4 semanas |
| **Rollback** | Revertir a configuración anterior | 1-3 días |

---

## 3. ESTRATEGIA DE MIGRACIÓN

### 3.1 Enfoque de Migración

```
┌─────────────────────────────────────────────────────────────┐
│                    ESTRATEGIA BLUE-GREEN                    │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│   PRODUCCIÓN ACTUAL (Blue)     NUEVO AMBIENTE (Green)       │
│   ──────────────────────       ──────────────────────        │
│   Railway + MySQL        →     Render + PlanetScale          │
│                                                             │
│   1. Crear ambiente verde                                    │
│   2. Migrar datos                                          │
│   3. Probar funcionamiento                                  │
│   4. DNS switch                                             │
│   5. Validar producción                                     │
│   6. Descomponer azul (si todo OK)                          │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

### 3.2 Fases de la Migración

| Fase | Actividades | Duración |
|------|-------------|----------|
| 1. Evaluación | Análisis de requisitos, selección de proveedores | 1 semana |
| 2. Preparación | Crear cuentas, configurar ambiente nuevo | 2-3 días |
| 3. Desarrollo | Adaptar código si es necesario | 3-5 días |
| 4. Datos | Exportar/importar base de datos | 1-2 días |
| 5. Imágenes | Transferir archivos multimedia | 1-3 días |
| 6. Pruebas | Testing completo en ambiente nuevo | 2-3 días |
| 7. Switch | Cambiar DNS y validar | 1 día |
| 8. Monitoreo | Verificar estabilidad post-migración | 3-7 días |

---

## 4. PROCEDIMIENTOS DE MIGRACIÓN

### 4.1 Migración de Backend (Railway → Render)

#### Checklist de Preparación

| # | Actividad | Estado | Responsable | Evidencia |
|---|-----------|--------|-------------|-----------|
| 1 | **Evaluación del Nuevo Proveedor** | | | |
| 1.1 | Crear cuenta en Render | ☐ | | |
| 1.2 | Revisar especificaciones y precios | ☐ | | |
| 1.3 | Verificar compatibilidad con Java 17 | ☐ | | |
| 1.4 | Confirmar soporte para Spring Boot | ☐ | | |
| 1.5 | Revisar opciones de base de datos integradas | ☐ | | |
| 2 | **Preparación del Código** | | | |
| 2.1 | Actualizar configuración para nuevo servidor | ☐ | | |
| 2.2 | Ajustar variables de entorno | ☐ | | |
| 2.3 | Configurar puertos dinámicos (PORT env) | ☐ | | |
| 2.4 | Verificar dependencias en pom.xml | ☐ | | |
| 2.5 | Probar build localmente | ☐ | | |

#### Checklist de Ejecución

| # | Actividad | Estado | Responsable | Evidencia |
|---|-----------|--------|-------------|-----------|
| 3 | **Despliegue en Nuevo Servidor** | | | |
| 3.1 | Conectar repositorio Git a Render | ☐ | | |
| 3.2 | Configurar variables de entorno en Render | ☐ | | |
| 3.3 | Configurar build command (mvn clean package) | ☐ | | |
| 3.4 | Configurar start command | ☐ | | |
| 3.5 | Desplegar aplicación | ☐ | | |
| 3.6 | Verificar que la API responde | ☐ | | |
| 4 | **Pruebas de Integración** | | | |
| 4.1 | Probar endpoint de autenticación | ☐ | | |
| 4.2 | Probar CRUD de productos | ☐ | | |
| 4.3 | Probar registro de ventas | ☐ | | |
| 4.4 | Probar carga de imágenes | ☐ | | |
| 4.5 | Verificar tiempo de respuesta <3s | ☐ | | |

---

### 4.2 Migración de Base de Datos (Railway MySQL → PlanetScale)

#### Checklist de Preparación

| # | Actividad | Estado | Responsable | Evidencia |
|---|-----------|--------|-------------|-----------|
| 1 | **Evaluación de PlanetScale** | | | |
| 1.1 | Crear cuenta en PlanetScale | ☐ | | |
| 1.2 | Crear nueva base de datos | ☐ | | |
| 1.3 | Obtener credenciales de conexión | ☐ | | |
| 1.4 | Revisar limitaciones del plan gratuito | ☐ | | |
| 2 | **Preparación de Datos** | | | |
| 2.1 | Exportar datos actuales (mysqldump) | ☐ | | |
| 2.2 | Verificar tamaño del backup | ☐ | | |
| 2.3 | Documentar estructura de tablas | ☐ | | |
| 2.4 | Revisar procedimientos almacenados si existen | ☐ | | |

#### Checklist de Ejecución

| # | Actividad | Estado | Responsable | Evidencia |
|---|-----------|--------|-------------|-----------|
| 3 | **Migración de Datos** | | | |
| 3.1 | Importar esquema de base de datos | ☐ | | |
| 3.2 | Importar datos de tablas | ☐ | | |
| 3.3 | Verificar integridad de datos | ☐ | | |
| 3.4 | Contar registros en cada tabla | ☐ | | |
| 3.5 | Probar consultas principales | ☐ | | |
| 4 | **Actualizar Conexión en Backend** | | | |
| 4.1 | Actualizar URL de conexión en variables de entorno | ☐ | | |
| 4.2 | Probar conexión desde aplicación | ☐ | | |
| 4.3 | Verificar que las tablas se crean correctamente | ☐ | | |

---

### 4.3 Migración de Imágenes (Cloudinary → AWS S3)

#### Checklist de Preparación

| # | Actividad | Estado | Responsable | Evidencia |
|---|-----------|--------|-------------|-----------|
| 1 | **Evaluación de AWS S3** | | | |
| 1.1 | Crear cuenta AWS (si no existe) | ☐ | | |
| 1.2 | Crear bucket en S3 | ☐ | | |
| 1.3 | Configurar permisos públicos de lectura | ☐ | | |
| 1.4 | Obtener credenciales IAM | ☐ | | |
| 1.5 | Configurar CORS para la aplicación | ☐ | | |
| 2 | **Herramienta de Transferencia** | | | |
| 2.1 | Instalar AWS CLI | ☐ | | |
| 2.2 | Configurar credenciales | ☐ | | |
| 2.3 | Listar todas las imágenes en Cloudinary | ☐ | | |
| 2.4 | Descargar lista de URLs | ☐ | | |

#### Checklist de Ejecución

| # | Actividad | Estado | Responsable | Evidencia |
|---|-----------|--------|-------------|-----------|
| 3 | **Transferencia de Imágenes** | | | |
| 3.1 | Descargar imágenes de Cloudinary localmente | ☐ | | |
| 3.2 | Subir imágenes a AWS S3 | ☐ | | |
| 3.3 | Verificar que todas las imágenes se subieron | ☐ | | |
| 3.4 | Generar nuevas URLs para las imágenes | ☐ | | |
| 3.5 | Actualizar URLs en base de datos | ☐ | | |
| 4 | **Verificación** | | | |
| 4.1 | Probar carga de nuevas imágenes | ☐ | | |
| 4.2 | Verificar que las imágenes antiguas se muestran | ☐ | | |
| 4.3 | Probar en web y móvil | ☐ | | |

---

### 4.4 Migración de Dominio

#### Checklist de Ejecución

| # | Actividad | Estado | Responsable | Evidencia |
|---|-----------|--------|-------------|-----------|
| 1 | **Nuevo Proveedor** | | | |
| 1.1 | Comprar dominio en nuevo proveedor | ☐ | | |
| 1.2 | Configurar DNS en nuevo proveedor | ☐ | | |
| 1.3 | Configurar registros A y CNAME | ☐ | | |
| 2 | **Certificado SSL** | | | |
| 2.1 | Generar nuevo certificado SSL | ☐ | | |
| 2.2 | Instalar en nuevo servidor | ☐ | | |
| 2.3 | Verificar HTTPS funciona | ☐ | | |
| 3 | **Cambio de DNS** | | | |
| 3.1 | Actualizar servidores de nombres (NS) | ☐ | | |
| 3.2 | Esperar propagación DNS (24-48 horas) | ☐ | | |
| 3.3 | Verificar que el dominio apunta al nuevo servidor | ☐ | | |
| 4 | **Validación Final** | | | |
| 4.1 | Probar desde múltiples ubicaciones | ☐ | | |
| 4.2 | Verificar certificados SSL | ☐ | | |
| 4.3 | Confirmar que todos los enlaces funcionan | ☐ | | |

---

## 5. PLAN DE CONTINGENCIA (ROLLBACK)

### 5.1 Cuándo Ejecutar Rollback

| Situación | Acción Inmediata |
|-----------|------------------|
| Error crítico en producción | Detener migración, iniciar rollback |
| Pérdida de datos | Restaurar desde backup, rollback |
| Tiempo de respuesta >10s | Rollback inmediato |
| Funcionalidad principal rota | Rollback a versión anterior |

### 5.2 Procedimiento de Rollback

#### Checklist de Rollback

| # | Actividad | Estado | Responsable | Evidencia |
|---|-----------|--------|-------------|-----------|
| 1 | **Detener Migración** | | | |
| 1.1 | Notificar al equipo de la situación | ☐ | | |
| 1.2 | Detener despliegue en nuevo servidor | ☐ | | |
| 2 | **Restaurar Servicios Anteriores** | | | |
| 2.1 | Apuntar DNS de vuelta al servidor anterior | ☐ | | |
| 2.2 | Restaurar conexión a base de datos anterior | ☐ | | |
| 2.3 | Restaurar URLs de imágenes a Cloudinary | ☐ | | |
| 3 | **Verificación** | | | |
| 3.1 | Confirmar que sistema opera normalmente | ☐ | | |
| 3.2 | Verificar que todas las funcionalidades работают | ☐ | | |
| 3.3 | Comunicar al equipo que el problema está resuelto | ☐ | | |
| 4 | **Documentación** | | | |
| 4.1 | Documentar causa del fallo | ☐ | | |
| 4.2 | Planificar corrección para próximo intento | ☐ | | |

### 5.3 Tiempo Máximo de Recuperación (RTO)

| Escenario | RTO Objetivo |
|-----------|---------------|
| Migración de API | 4 horas |
| Migración de Base de Datos | 2 horas |
| Migración de Imágenes | 8 horas |
| Migración de Dominio | 24 horas |
| **Tiempo Total Máximo** | **48 horas** |

---

## 6. PRUEBAS POST-MIGRACIÓN

### 6.1 Checklist de Validación Completa

| # | Prueba | Estado | Evidencia |
|---|--------|--------|-----------|
| 1 | **Funcionalidad Core** | | |
| 1.1 | Login y autenticación | ☐ | |
| 1.2 | Registro de usuarios | ☐ | |
| 1.3 | CRUD completo de productos | ☐ | |
| 1.4 | CRUD de categorías | ☐ | |
| 1.5 | CRUD de marcas | ☐ | |
| 1.6 | Registro de ventas | ☐ | |
| 1.7 | Generación de comprobantes | ☐ | |
| 2 | **Rendimiento** | | |
| 2.1 | Tiempo de respuesta API <3s | ☐ | |
| 2.2 | Tiempo de carga página <5s | ☐ | |
| 2.3 | Carga de imágenes <2s | ☐ | |
| 3 | **Seguridad** | | |
| 3.1 | HTTPS funcionando correctamente | ☐ | |
| 3.2 | Autenticación JWT funciona | ☐ | |
| 3.3 | Rutas protegidas funcionan | ☐ | |
| 4 | **Dispositivos** | | |
| 4.1 | Web funciona en Chrome | ☐ | |
| 4.2 | Web funciona en Firefox | ☐ | |
| 4.3 | App móvil Android funciona | ☐ | |
| 5 | **Datos** | | |
| 5.1 | Todos los productos visibles | ☐ | |
| 5.2 | Historial de ventas intacto | ☐ | |
| 5.3 | Imágenes se cargan correctamente | ☐ | |
| 5.4 | Favoritos de usuarios preservados | ☐ | |

---

## 7. COMUNICACIÓN

### 7.1 Plan de Comunicación

| Fase | Audiencia | Mensaje | Medio |
|------|-----------|---------|-------|
| Antes | Equipo técnico | Inicio de migración | Email/Slack |
| Antes | Usuarios | Mantenimiento programado | Banner en app |
| Durante | Equipo técnico | Progreso de migración | Slack |
| Después | Todos | Migración completada | Email/Comunicado |
| Si falla | Todos | Rollback ejecutado, investigación en curso | Email/In-app |

### 7.2 Notificaciones

| Tipo de Migración | Tiempo de Anticipación |
|-------------------|------------------------|
| Mantenimiento menor | 24 horas |
| Migración significativa | 1 semana |
| Migración crítica | 2 semanas |

---

## 8. COSTOS DE MIGRACIÓN

### 8.1 Estimación de Costos

| Concepto | Costo Estimado | Notas |
|----------|---------------|-------|
| Nuevos proveedores (setup) | $0 - 200.000 COP | Depends del proveedor |
| Dominio nuevo (si aplica) | $50.000 COP/año | .com |
| Horas de trabajo | 40-80 horas | Según complejidad |
| Potencial downtime | Mínimo (<1 hora) | Con estrategia blue-green |
| **Total estimado** | **$500.000 - 1.500.000 COP** | |

---

## 9. CRONOGRAMA DE MIGRACIÓN

### 9.1 Migración Completa (4 Semanas)

| Semana | Actividades |
|--------|-------------|
| **Semana 1** | Evaluación, selección de proveedores, preparación de cuentas |
| **Semana 2** | Configuración de ambiente nuevo, migración de base de datos |
| **Semana 3** | Migración de imágenes, pruebas en ambiente nuevo |
| **Semana 4** | Switch, validación, monitoreo post-migración |

### 9.2 Migración de Emergencia (48-72 horas)

| Hora | Actividades |
|------|-------------|
| 0-4 | Preparación rápida, backup completo |
| 4-12 | Migración de base de datos |
| 12-24 | Migración de archivos, pruebas |
| 24-48 | Switch, validación final |

---

## 10. RESPONSABLES

| Rol | Responsabilidad | Contacto |
|-----|-----------------|----------|
| Líder de Proyecto | Supervisión general | [Nombre] |
| Desarrollador Backend | Migración API y BD | [Nombre] |
| DevOps | Configuración servidores | [Nombre] |
| QA | Pruebas de validación | [Nombre] |
| Soporte | Comunicación con usuarios | [Nombre] |

---

## 11. APROBACIONES

| Rol | Nombre | Fecha | Firma |
|-----|--------|-------|-------|
| Jefe de Proyecto | | _____________ | _____________ |
| Arquitecto de Sistemas | | _____________ | _____________ |
| Cliente/Usuario | | _____________ | _____________ |

---

## 12. ANEXOS

### 12.1 Comandos Útiles

```bash
# Exportar base de datos MySQL
mysqldump -u usuario -p nombre_base > backup.sql

# Importar base de datos
mysql -u usuario -p nombre_base < backup.sql

# S3 sync (AWS CLI)
aws s3 sync ./imagenes s3://tu-bucket/

# Test de carga
curl -o /dev/null -s -w "%{time_total}\n" https://tu-api.com/endpoint
```

### 12.2 Variables de Entorno Críticas

| Variable | Descripción |
|----------|-------------|
| DATABASE_URL | Conexión a base de datos |
| JWT_SECRET | Clave secreta para tokens |
| CLOUDINARY_URL | Credenciales Cloudinary |
| AWS_ACCESS_KEY_ID | Acceso AWS |
| AWS_SECRET_ACCESS_KEY | Clave secreta AWS |
| RAILWAY_STATIC_URL | URL del servidor |

---

*Plan de Migración del Sistema LUNARIA v1.0*
*Fecha de elaboración: Marzo 2026*
*Próxima revisión: Septiembre 2026*
