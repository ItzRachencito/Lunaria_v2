# PLAN DE MANTENIMIENTO DEL SISTEMA LUNARIA

---

## 1. INTRODUCCIÓN

### 1.1 Propósito del Plan
Este documento establece las políticas, procedimientos y actividades de mantenimiento preventivo y correctivo del Sistema de Gestión de Inventarios LUNARIA, garantizando la continuidad, disponibilidad y óptimo rendimiento del sistema.

### 1.2 Alcance del Mantenimiento
El plan de mantenimiento abarca:
- Servidores y infraestructura
- Base de datos
- Aplicación backend (API)
- Aplicación web frontend
- Aplicación móvil
- Servicios externos (Cloudinary, Railway)

### 1.3 Objetivos
- Minimizar el tiempo de inactividad del sistema
- Garantizar la integridad y seguridad de los datos
- Mantener el rendimiento óptimo de la aplicación
- Prevenir fallas antes de que ocurran
- Cumplir con los niveles de servicio acordados

---

## 2. TIPOS DE MANTENIMIENTO

### 2.1 Mantenimiento Preventivo
Actividades realizadas para prevenir fallas antes de que ocurran.

| Actividad | Frecuencia | Descripción |
|-----------|------------|-------------|
| Revisión de logs | Diaria | Análisis de registros del sistema |
| Backups base de datos | Diaria | Respaldo automático de datos |
| Verificación de disco | Semanal | Monitoreo de espacio en servidores |
| Actualización de dependencias | Mensual | Actualizar librerías y dependencias |
| Revisión de seguridad | Mensual | Verificar vulnerabilidades |

### 2.2 Mantenimiento Correctivo
Actividades para corregir errores o fallas identificadas.

| Tipo | Descripción | Tiempo de Respuesta |
|------|-------------|---------------------|
| Crítico | Sistema fuera de línea | 1 hora |
| Alto | Funcionalidad principal afectada | 4 horas |
| Medio | Funcionalidad secundaria afectada | 24 horas |
| Bajo | Mejoras menores | 1 semana |

### 2.3 Mantenimiento Evolutivo
Cambios y mejoras para agregar nuevas funcionalidades.

| Prioridad | Descripción | Tiempo de Implementación |
|-----------|-------------|--------------------------|
| Alta | Funcionalidades solicitadas por cliente | 2-4 semanas |
| Media | Mejoras de usabilidad | 1-2 meses |
| Baja | Optimizaciones | Trimestral |

---

## 3. INFRAESTRUCTURA Y MONITOREO

### 3.1 Componentes a Monitorear

| Componente | Métricas | Umbral de Alerta |
|------------|----------|------------------|
| **Servidor Backend** | CPU, Memoria, Red | >80% uso |
| **Base de Datos** | Conexiones, Consultas lentas | >100 conexiones |
| **API** | Tiempo de respuesta, Errores | >3s respuesta, >5% errores |
| **Almacenamiento** | Espacio disponible | <20% libre |
| **Dominio** | Certificados SSL | <30 días para expirar |

### 3.2 Herramientas de Monitoreo

| Servicio | Función | Costo |
|----------|---------|-------|
| Railway Dashboard | Monitor de servidor y base de datos | Incluido |
| Cloudinary Dashboard | Monitor de almacenamiento de imágenes | Incluido |
| Google Analytics | Analítica web y móvil | Gratis |
| Uptime Robot | Verificación de disponibilidad | Gratis |

---

## 4. PROGRAMACIÓN DE MANTENIMIENTO

### 4.1 Calendario de Actividades

| Actividad | Diario | Semanal | Mensual | Trimestral |
|-----------|--------|---------|---------|------------|
| Revisión de logs | ✅ | | | |
| Backup automático | ✅ | | | |
| Verificar backups | | ✅ | | |
| Monitoreo de rendimiento | | ✅ | | |
| Revisión de seguridad | | | ✅ | |
| Actualización de dependencias | | | ✅ | |
| Auditoría completa | | | | ✅ |
| Pruebas de estrés | | | | ✅ |

### 4.2 Ventanas de Mantenimiento

| Tipo | Día | Horario | Duración Máxima |
|------|-----|---------|-----------------|
| Mantenimiento menor | Lunes | 2:00 AM - 4:00 AM | 2 horas |
| Mantenimiento mayor | Primer domingo del mes | 1:00 AM - 6:00 AM | 5 horas |
| Actualizaciones críticas | Según necesidad | Mínimo 24h aviso | Variable |

---

## 5. PROCEDIMIENTOS DE MANTENIMIENTO

### 5.1 Backup de Base de Datos

#### Checklist de Verificación Diaria

| # | Actividad de Verificación | Estado | Observaciones |
|---|---------------------------|--------|---------------|
| 1 | Verificar que el backup automático se ejecutó | ☐ | |
| 2 | Confirmar tamaño del archivo de backup (>0 KB) | ☐ | |
| 3 | Verificar que el backup se almacenó en Railway | ☐ | |
| 4 | Revisar logs de backup por errores | ☐ | |
| 5 | Confirmar retención de backups (últimos 7 días) | ☐ | |

**Procedimiento:**
1. Acceder al panel de Railway
2. Verificar sección "Backups" de la base de datos
3. Confirmar que el backup del día está completado
4. Descargar backup manual como respaldo adicional (semanal)

#### Lista de Chequeo Semanal

| # | Actividad | Responsable | Fecha |
|---|-----------|-------------|-------|
| 1 | Descargar backup manual | Administrador | |
| 2 | Almacenar en Google Drive | Administrador | |
| 3 | Verificar integridad del backup | Administrador | |
| 4 | Probar restauración en ambiente de prueba | Desarrollador | |

---

### 5.2 Actualización de Dependencias

#### Checklist Mensual

| # | Componente | Verificación | Estado |
|---|------------|--------------|--------|
| 1 | **Backend (Spring Boot)** | | |
| 1.1 | Verificar versiones de dependencias en pom.xml | ☐ | |
| 1.2 | Revisar vulnerabilidades conocidas (Dependabot) | ☐ | |
| 1.3 | Probar en ambiente local antes de producción | ☐ | |
| 2 | **Frontend Web (React)** | | |
| 2.1 | Ejecutar npm outdated | ☐ | |
| 2.2 | Revisar changelogs de paquetes | ☐ | |
| 2.3 | Actualizar paquetes menores (patch/minor) | ☐ | |
| 3 | **Móvil (React Native/Expo)** | | |
| 3.1 | Verificar SDK de Expo actualizado | ☐ | |
| 3.2 | Probar build de APK | ☐ | |

**Procedimiento:**
1. Ejecutar `npm outdated` o `mvn dependency:analyze`
2. Revisar changelogs de paquetes con actualizaciones
3. Probar en ambiente de desarrollo/local
4. Desplegar a producción si no hay errores

---

### 5.3 Revisión de Seguridad

#### Checklist Mensual de Seguridad

| # | Actividad de Seguridad | Estado | Evidencia |
|---|------------------------|--------|------------|
| 1 | **Autenticación** | | |
| 1.1 | Verificar que JWT expire correctamente | ☐ | |
| 1.2 | Confirmar que contraseñas están encriptadas (BCrypt) | ☐ | |
| 1.3 | Revisar intentos de login fallidos | ☐ | |
| 2 | **Permisos y Accesos** | | |
| 2.1 | Verificar que rutas de API estén protegidas | ☐ | |
| 2.2 | Confirmar control de roles (ADMIN/USER) | ☐ | |
| 2.3 | Revisar usuarios activos en el sistema | ☐ | |
| 3 | **Datos** | | |
| 3.1 | Confirmar backups se realizan diario | ☐ | |
| 3.2 | Verificar conexión HTTPS activa | ☐ | |
| 3.3 | Revisar variables de entorno sensibles | ☐ | |
| 4 | **Infraestructura** | | |
| 4.1 | Verificar certificado SSL vigente | ☐ | |
| 4.2 | Confirmar que Railway no exponga credenciales | ☐ | |
| 4.3 | Revisar logs de acceso por actividades sospechosas | ☐ | |

---

### 5.4 Monitoreo de Rendimiento

#### Checklist Semanal de Rendimiento

| # | Métrica | Objetivo | Estado | Valor Actual |
|---|---------|----------|--------|--------------|
| 1 | **Backend API** | | | |
| 1.1 | Tiempo de respuesta promedio | < 500ms | ☐ | |
| 1.2 | Tiempo de respuesta máximo | < 2000ms | ☐ | |
| 1.3 | Número de errores 500 | 0 | ☐ | |
| 1.4 | Uso de memoria del servidor | < 80% | ☐ | |
| 2 | **Base de Datos** | | | |
| 2.1 | Conexiones simultáneas | < 80% | ☐ | |
| 2.2 | Consultas lentas (>1s) | 0 | ☐ | |
| 2.3 | Tamaño de base de datos | < 80% límite | ☐ | |
| 3 | **Frontend** | | | |
| 3.1 | Tiempo de carga de página | < 3s | ☐ | |
| 3.2 | Errores de JavaScript | 0 | ☐ | |
| 3.3 | Tamaño de bundle JS | < 500KB | ☐ | |

---

### 5.5 Mantenimiento de Imágenes (Cloudinary)

#### Checklist Mensual

| # | Actividad | Estado | Observaciones |
|---|-----------|--------|---------------|
| 1 | Verificar uso de almacenamiento | ☐ | |
| 2 | Revisar imágenes sin uso (>6 meses) | ☐ | |
| 3 | Confirmar transformación de imágenes optimizada | ☐ | |
| 4 | Verificar límites del plan gratuito | ☐ | |

---

## 6. GESTIÓN DE INCIDENTES

### 6.1 Clasificación de Incidentes

| Nivel | Descripción | Ejemplos | Tiempo de Respuesta |
|-------|-------------|----------|---------------------|
| **P1 - Crítico** | Sistema no disponible | Servidor caido, BD no responde | 1 hora |
| **P2 - Alto** | Función principal afectada | Login no funciona, no se pueden registrar ventas | 4 horas |
| **P3 - Medio** | Función secundaria afectada | Búsqueda lenta, errores menores | 24 horas |
| **P4 - Bajo** | Problemas cosméticos |	Errores de diseño, texto incorrecto | 1 semana |

### 6.2 Procedimiento de Respuesta a Incidentes

**Paso 1: Detección**
- Monitoreo automático alerta al equipo
- Usuario reporta el problema

**Paso 2: Clasificación**
- Evaluar impacto y urgencia
- Asignar nivel de prioridad

**Paso 3: Contención**
- Aislar el problema
- Implementar solución temporal

**Paso 4: Resolución**
- Aplicar solución definitiva
- Verificar funcionamiento

**Paso 5: Documentación**
- Registrar incidente
- Documentar lección aprendida

### 6.3 Contactos de Soporte

| Rol | Contacto | Teléfono | Email |
|-----|----------|----------|-------|
| Desarrollador Principal | Santiago Rachen | [Teléfono] | [Email] |
| Soporte Técnico | [Nombre] | [Teléfono] | [Email] |

---

## 7. ACTUALIZACIONES Y MEJORAS

### 7.1 Proceso de Actualización

| Fase | Actividad | Responsable |
|------|-----------|-------------|
| 1 | Solicitud de cambio | Usuario/Cliente |
| 2 | Análisis de impacto | Desarrollador |
| 3 | Aprobación | Jefe de Proyecto |
| 4 | Desarrollo | Desarrollador |
| 5 | Pruebas | QA |
| 6 | Despliegue | Desarrollador |
| 7 | Validación | Cliente |

### 7.2 Lista de Mejoras Pendientes

| # | Mejora | Prioridad | Estado | Fecha Estimada |
|---|--------|-----------|--------|----------------|
| 1 | Módulo de reportes avanzados | Media | Pendiente | Q2 2026 |
| 2 | Integración con pasarela de pagos | Alta | Pendiente | Q2 2026 |
| 3 | App iOS | Media | Pendiente | Q3 2026 |
| 4 | Módulo de proveedores | Baja | Pendiente | Q4 2026 |

---

## 8. CAPACITACIÓN

### 8.1 Programa de Capacitación

| Tema | Dirigido a | Frecuencia | Duración |
|------|------------|------------|----------|
| Uso del sistema | Usuarios | Inicio + Refresco anual | 2 horas |
| Administración | Administradores | Trimestral | 4 horas |
| Mantenimiento técnico | Desarrollador | Continuo | - |

### 8.2 Materiales de Capacitación

- Manual de usuario (disponible en 01_docs)
- Videos tutoriales (enlaces)
- FAQ interno

---

## 9. COSTOS DE MANTENIMIENTO

### 9.1 Presupuesto Anual Estimado

| Concepto | Costo Mensual | Costo Anual |
|----------|---------------|-------------|
| Servidor Backend (Railway) | $150.000 COP | $1.800.000 COP |
| Base de datos MySQL | $100.000 COP | $1.200.000 COP |
| Dominio | $50.000 COP | $600.000 COP |
| Cloudinary (si excede plan) | $0-100.000 COP | $0-1.200.000 COP |
| **Total Estimado** | **$300.000-400.000 COP** | **$3.600.000-4.800.000 COP** |

### 9.2 Horas de Trabajo Estimadas

| Actividad | Horas/Mes | Horas/Año |
|-----------|-----------|-----------|
| Mantenimiento preventivo | 8 horas | 96 horas |
| Mantenimiento correctivo | 4 horas | 48 horas |
| Actualizaciones menores | 6 horas | 72 horas |
| Monitoreo y reportes | 4 horas | 48 horas |
| **Total** | **22 horas** | **264 horas** |

---

## 10. INDICADORES DE MANTENIMIENTO (KPIs)

### 10.1 Métricas de Servicio

| Indicador | Meta | Medición |
|-----------|------|----------|
| Disponibilidad del sistema | > 99% | Mensual |
| Tiempo de respuesta promedio API | < 500ms | Semanal |
| Tiempo de resolución de incidentes P1 | < 1 hora | Por incidente |
| Tiempo de resolución de incidentes P2 | < 4 horas | Por incidente |
| Porcentaje de backups exitosos | 100% | Diario |
| Satisfacción del usuario | > 90% | Trimestral |

### 10.2 Reporte Mensual de Mantenimiento

| Métrica | Valor del Mes | Valor Acumulado Año |
|---------|---------------|---------------------|
| Incidentes reportados | | |
| Incidentes resueltos | | |
| Tiempo promedio de resolución | | |
| Actualizaciones realizadas | | |
| Horas de mantenimiento | | |
| Costos incurredos | | |

---

## 11. ANEXOS

### 11.1 Glosario

| Término | Definición |
|---------|------------|
| **API** | Interfaz de programación de aplicaciones |
| **Backup** | Copia de seguridad de datos |
| **Deploy** | Despliegue a producción |
| **Dependencias** | Librerías externas utilizadas |
| **JWT** | Token web JSON para autenticación |
| **Logs** | Registros del sistema |
| **P1-P4** | Niveles de prioridad de incidentes |
| **Prod** | Ambiente de producción |
| **Staging** | Ambiente de pruebas |

### 11.2 Referencias

- Documentación técnica del sistema
- Manual de usuario
- Código fuente (GitHub)
- Panel de administración Railway

---

## 12. APROBACIONES

| Rol | Nombre | Fecha | Firma |
|-----|--------|-------|-------|
| Jefe de Proyecto | | _____________ | _____________ |
| Administrador de Sistemas | | _____________ | _____________ |
| Representante del Cliente | | _____________ | _____________ |

---

*Plan de Mantenimiento del Sistema LUNARIA v1.0*
*Fecha de elaboración: Marzo 2026*
*Próxima revisión: Junio 2026*
