# Plan de Migración - Proyecto Lunaria

---

## 1. Introducción

Este documento describe el proceso de migración de datos al sistema Lunaria.

---

## 2. Escenarios de Migración

### 2.1 Migración desde Sistema Legacy

| Etapa | Actividad | Tiempo Estimado |
|-------|-----------|-----------------|
| 1 | Análisis de datos source | 1 semana |
| 2 | Mapeo de campos | 2 días |
| 3 | Extracción de datos | 1 día |
| 4 | Transformación | 3 días |
| 5 | Carga inicial | 1 día |
| 6 | Validación | 2 días |

### 2.2 Migración desde Excel/CSV

```java
// Ejemplo de importación desde CSV
public void importarProductos(String archivoCSV) {
    // 1. Leer archivo CSV
    // 2. Validar datos
    // 3. Mapear a entidad
    // 4. Guardar en BD
}
```

---

## 3. Datos a Migrar

| Entidad | Campo origen | Campo destino | Transformación |
|---------|--------------|---------------|-----------------|
| Productos | nombre | name | Mayúsculas |
| Productos | precio_venta | price | Decimal |
| Productos | cantidad | stock | Entero |
| Categorías | categoria | category.name | Texto |
| Marcas | marca | brand.name | Texto |
| Usuarios | email | email | Minúsculas |

---

## 4. Proceso de Migración

### 4.1 Paso a Paso

1. **Inventario de datos**
   - Identificar todos los datos a migrar
   - Documentar formatos actuales
   - Evaluar calidad de datos

2. **Diseño de transformación**
   - Crear reglas de mapeo
   - Definir valores por defecto
   - Identificar datos inválidos

3. **Scripts de migración**
   - Crear scripts SQL/Python
   - Probar en ambiente de prueba
   - Documentar errores

4. **Ejecución**
   - Ejecutar en horario no productivo
   - Monitorear errores
   - Registrar tiempo

5. **Validación**
   - Comparar totales
   - Verificar muestra aleatoria
   - Probar funcionalidades

### 4.2 Script de Ejemplo

```sql
-- Migrar productos desde tabla legacy
INSERT INTO tbl_items (name, price, stock, category_id, brand_id, created_at)
SELECT 
    p.nombre_producto,
    p.precio_venta,
    p.cantidad_stock,
    (SELECT id FROM tbl_category WHERE name = p.categoria LIMIT 1),
    (SELECT id FROM tbl_brand WHERE name = p.marca LIMIT 1),
    NOW()
FROM productos_legacy p
WHERE p.estado = 'activo';
```

---

## 5. Manejo de Errores

| Error | Acción |
|-------|--------|
| Dato duplicado | Actualizar registro existente |
| Dato inválido | Guardar en log de errores |
| Campo obligatorio vacío | Usar valor por defecto |
| FK no existe | Crear registro o omitir |

---

## 6. Validación Post-Migración

- [ ] Total de registros coincides
- [ ] Muestra de 10 registros verificada
- [ ] Relaciones correctas
- [ ] Imágenes asociadas
- [ ] Usuarios pueden hacer login

---

## 7. Rollback

En caso de falla:
1. Detener migración
2. Restaurar backup de BD
3. Analizar errores
4. Corregir y reintentar

---

*Documento creado para el proyecto Lunaria*
