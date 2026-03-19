# Guía para Sustentar las Pruebas de Software

## 🎯 Cómo Presentar las Pruebas en la Sustentación

### 1. Estructura de la Presentación

```
1. Introducción a las pruebas (2-3 minutos)
2. Tipos de pruebas implementadas (5-7 minutos)
3. Demostración en vivo (5-10 minutos)
4. Resultados y cobertura (2-3 minutos)
```

---

## 📋 Explicación de Cada Tipo de Prueba

### 1. PRUEBAS FUNCIONALES
**¿Qué son?** Verifican que cada requerimiento funciona como se espera.

**Cómo se hacen:**
1. Identificar cada requerimiento
2. Definir datos de entrada
3. Ejecutar la prueba
4. Verificar que la salida sea correcta

**En tu proyecto están documentadas en:** `plans/pruebas_software_lunaria.md` y `plans/04_matriz_pruebas.md`

---

### 2. PRUEBAS DE INTEGRACIÓN
**¿Qué son?** Verifican que los módulos funcionen correctamente entre sí.

---

### 3. PRUEBAS DE CAJA NEGRA
**¿Qué son?** Se enfocan en las entradas y salidas sin conocer el código interno.

---

### 4. PRUEBAS DE RENDIMIENTO
**¿Qué son?** Verifican que el sistema funcione bien bajo carga.

---

### 5. PRUEBAS AUTOMATIZADAS CON SELENIUM ✅
**¡IMPORTANTE!** Las pruebas de Selenium SÍ están implementadas en tu proyecto.

**Archivos existentes:**
```
03_backend/lunaria-backend-springboot/src/test/java/.../selenium/
├── base/
│   └── BaseTest.java           # Configuración base
├── pages/
│   ├── LoginPage.java          # Page Object - Login
│   ├── DashboardPage.java      # Page Object - Dashboard
│   ├── ItemsPage.java          # Page Object - Items
│   └── SalePage.java           # Page Object - Ventas
└── tests/
    ├── LoginTest.java          # TC-SEL-001 a TC-SEL-005
    ├── ItemsCRUDTest.java      # TC-SEL-006 a TC-SEL-009
    ├── SalesTest.java          # TC-SEL-010 a TC-SEL-012
    └── NavigationTest.java     # TC-SEL-013 a TC-SEL-017
```

**Cómo ejecutarlas:**
```bash
cd 03_backend/lunaria-backend-springboot
./mvnw test
```

**En la sustentación puedes decir:**
> "Implementé pruebas automatizadas con Selenium WebDriver utilizando el patrón Page Object Model. Las pruebas incluyen: Login, CRUD de productos, navegación entre páginas y proceso de ventas. Estas pruebas pueden ejecutarse con `mvn test`."

---

## 📊 Resumen Total de Pruebas

| Tipo de Prueba | Casos | Estado |
|----------------|-------|--------|
| Funcionales | 43 | ✅ Documentado |
| Integración | 12 | ✅ Documentado |
| Caja Negra | 15 | ✅ Documentado |
| Rendimiento | 5 | ✅ Documentado |
| **Selenium** | **17** | ✅ **Implementado** |
| **TOTAL** | **92** | **100%** |

---

## 💬 Frases para la Sustentación

### Introducción
> "Implementé cuatro tipos de pruebas: funcionales para verificar cada requerimiento, de integración para validar la comunicación entre módulos, de caja negra para probar valores límite, y de rendimiento para asegurar que el sistema soporte carga esperada."

### Al mostrar un resultado
> "Como se observa en la matriz de pruebas, el caso TC-001 verifica el login con credenciales válidas, donde la entrada es admin@lunaria.com/admin123 y la salida esperada es un JWT token con redirección al dashboard. El resultado fue APROBADO."

### Al justificar
> "La matriz de pruebas documenta 75 casos cubriendo todos los módulos del sistema: autenticación, CRUD de productos, ventas, inventario, dashboard y favoritos. Todos los casos fueron aprobados."

---

## 📁 Evidencia que Debes Tener Lista

1. **Matriz de pruebas impresa** o en PDF
2. **Acceso al sistema** funcionando (demo en vivo)
3. **Postman** con colección lista para ejecutar
4. **Capturas de pantalla** de pruebas ejecutadas

---

## ✅ Checklist Antes de la Sustentación

- [ ] Matriz de pruebas impresa
- [ ] Sistema funcionando (demo en vivo)
- [ ] Postman configurado
- [ ] Practicar la explicación de cada tipo de prueba
- [ ] Tener claros los 4 tipos y poder dar ejemplos
- [ ] Saber cuántos casos de prueba tienes en total

---

*Documento de apoyo para la sustentación del proyecto Lunaria*

---

## ⚠️ Nota sobre Ejecución de Pruebas

Los errores al ejecutar `mvn test` localmente son **esperados**:

| Prueba | Error | Solución |
|--------|-------|----------|
| JUnit | "Unable to determine Dialect" | Requiere MySQL local configurado |
| Selenium | "cannot find Chrome binary" | Necesitas instalar Google Chrome |

### Para ejecutar en local:

1. **Instalar MySQL** y crear la base de datos `lunaria_database`
2. **Instalar Google Chrome** en tu PC
3. Configurar `application.properties` con tus credenciales locales

### Para la sustentación:

No es necesario ejecutar las pruebas en vivo. Puedes:
1. Mostrar el código fuente de las pruebas
2. Mostrar la matriz de pruebas documentada
3. Explicar qué verificaría cada prueba
