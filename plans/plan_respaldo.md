# Plan de Respaldo - Proyecto Lunaria

---

## 1. Introducción

Este documento establece los procedimientos de respaldo y recuperación para el sistema Lunaria.

---

## 2. Componentes a Respaldar

| Componente | Frecuencia | Ubicación |
|------------|------------|-----------|
| Base de Datos MySQL | Diario | Railway |
| Imágenes/Archivos | Diario | Cloudinary |
| Código Fuente | Por versión | GitHub |
| Configuración | Por cambio | Railway Variables |

---

## 3. Estrategia de Respaldo

### 3.1 Base de Datos

**Automático (Railway):**
- Railway incluye backups automáticos
- Retención: 7 días (plan básico)

**Manual (Recomendado):**
```bash
# Exportar base de datos
mysqldump -h hostname -u user -p lunaria_database > backup_$(date +%Y%m%d).sql

# Respaldar en Google Drive o Dropbox
```

### 3.2 Imágenes y Archivos

- **Cloudinary**: Los medios se almacenan en la nube de Cloudinary
- **Backups**: Configurar retención en Cloudinary (versión de archivos)

### 3.3 Código Fuente

- GitHub como repositorio principal
- Ramas: main (producción), develop (desarrollo)
- Tags para versiones release

---

## 4. Frecuencia de Respaldos

| Tipo | Frecuencia | Retention |
|------|------------|-----------|
| Base de datos | Diario | 30 días |
| Imágenes | Semanal | Indefinido |
| Código | Por commit | Indefinido |
| Configuración | Por cambio | 10 versiones |

---

## 5. Procedimiento de Recuperación

### 5.1 Recuperar Base de Datos

```bash
# 1. Detener aplicación
# 2. Restaurar backup
mysql -h hostname -u user -p lunaria_database < backup_fecha.sql
# 3. Verificar integridad
# 4. Reiniciar aplicación
```

### 5.2 Recuperar Imágenes

1. Contactar soporte de Cloudinary
2. Restaurar desde versión anterior
3. Verificar URLs en base de datos

---

## 6. Responsables

| Tarea | Responsable |
|-------|-------------|
| Ejecutar backups | Sistema automático |
| Verificar integridad | Administrador |
| Recuperación | Administrador de sistema |
| Documentación | Lider técnico |

---

## 7. Pruebas de Recuperación

Realizar pruebas trimestrales de recuperación:
1. Restaurar en ambiente de prueba
2. Verificar integridad de datos
3. Documentar tiempo de recuperación

---

*Documento creado para el proyecto Lunaria*
