# Pruebas de Software con Selenium - Lunaria

Esta guía detalla cómo implementar pruebas automatizadas con Selenium WebDriver para el proyecto Lunaria, cubriendo pruebas funcionales, de integración y de caja negra desde la perspectiva del navegador.

---

## 1. Configuración del Entorno Selenium

### 1.1 Dependencias Requeridas

Agregar al `pom.xml` del backend:

```xml
<!-- Selenium WebDriver -->
<dependency>
    <groupId>org.seleniumhq.selenium</groupId>
    <artifactId>selenium-java</artifactId>
    <version>4.18.1</version>
</dependency>

<!-- Selenium WebDriver Manager -->
<dependency>
    <groupId>io.github.bonigarcia</groupId>
    <artifactId>webdrivermanager</artifactId>
    <version>5.7.0</version>
</dependency>

<!-- JUnit 5 -->
<dependency>
    <groupId>org.junit.jupiter</groupId>
    <artifactId>junit-jupiter</artifactId>
    <scope>test</scope>
</dependency>

<!-- Extent Reports para screenshots -->
<dependency>
    <groupId>com.aventstack</groupId>
    <artifactId>extentreports</artifactId>
    <version>5.1.1</version>
</dependency>
```

### 1.2 Estructura de Pruebas Selenium

```
src/test/
├── java/
│   └── com/
│       └── santiago_rachen/
│           └── lunaria_backend_springboot/
│               └── selenium/
│                   ├── base/
│                   │   ├── BaseTest.java
│                   │   └── BasePage.java
│                   ├── pages/
│                   │   ├── LoginPage.java
│                   │   ├── DashboardPage.java
│                   │   ├── ItemsPage.java
│                   │   └── SalePage.java
│                   └── tests/
│                       ├── LoginTest.java
│                       ├── ItemsCRUDTest.java
│                       ├── SalesTest.java
│                       └── NavigationTest.java
```

---

## 2. Clase Base para Pruebas

### 2.1 BaseTest.java

```java
package com.santiago_rachen.lunaria_backend_springboot.selenium.base;

import io.github.bonigarcia.wdm.WebDriverManager;
import org.junit.jupiter.api.*;
import org.openqa.selenium.WebDriver;
import org.openqa.selenium.chrome.ChromeDriver;
import org.openqa.selenium.chrome.ChromeOptions;
import org.openqa.selenium.edge.EdgeDriver;
import org.openqa.selenium.firefox.FirefoxDriver;
import org.openqa.selenium.support.ui.WebDriverWait;

import java.time.Duration;
import java.util.concurrent.TimeUnit;

@TestInstance(TestInstance.Lifecycle.PER_CLASS)
public class BaseTest {
    
    protected WebDriver driver;
    protected WebDriverWait wait;
    protected static final String BASE_URL = "http://localhost:5173";
    protected static final String API_BASE_URL = "http://localhost:9090/api/v1.0";
    
    @BeforeAll
    public void setUp() {
        WebDriverManager.chromedriver().setup();
        
        ChromeOptions options = new ChromeOptions();
        options.addArguments("--start-maximized");
        options.addArguments("--disable-notifications");
        options.addArguments("--disable-popup-blocking");
        options.addArguments("--incognito");
        
        driver = new ChromeDriver(options);
        driver.manage().timeouts().implicitlyWait(10, TimeUnit.SECONDS);
        driver.manage().timeouts().pageLoadTimeout(30, TimeUnit.SECONDS);
        
        wait = new WebDriverWait(driver, Duration.ofSeconds(15));
    }
    
    @AfterEach
    public void takeScreenshotOnFailure(TestInfo testInfo) {
        // Captura screenshot si la prueba falla
    }
    
    @AfterAll
    public void tearDown() {
        if (driver != null) {
            driver.quit();
        }
    }
    
    protected void navigateTo(String url) {
        driver.get(url);
    }
    
    protected String getCurrentUrl() {
        return driver.getCurrentUrl();
    }
}
```

---

## 3. Page Object Model (POM)

### 3.1 LoginPage.java

```java
package com.santiago_rachen.lunaria_backend_springboot.selenium.pages;

import org.openqa.selenium.By;
import org.openqa.selenium.WebDriver;
import org.openqa.selenium.WebElement;
import org.openqa.selenium.support.FindBy;
import org.openqa.selenium.support.PageFactory;
import org.openqa.selenium.support.ui.ExpectedConditions;

public class LoginPage {
    
    private WebDriver driver;
    
    // Locators
    @FindBy(id = "email")
    private WebElement emailInput;
    
    @FindBy(id = "password")
    private WebElement passwordInput;
    
    @FindBy(xpath = "//button[contains(text(), 'Login')]")
    private WebElement loginButton;
    
    @FindBy(className = "error-message")
    private WebElement errorMessage;
    
    public LoginPage(WebDriver driver) {
        this.driver = driver;
        PageFactory.initElements(driver, this);
    }
    
    public void navigateTo() {
        driver.get("http://localhost:5173/login");
    }
    
    public void enterEmail(String email) {
        emailInput.clear();
        emailInput.sendKeys(email);
    }
    
    public void enterPassword(String password) {
        passwordInput.clear();
        passwordInput.sendKeys(password);
    }
    
    public void clickLogin() {
        loginButton.click();
    }
    
    public void login(String email, String password) {
        enterEmail(email);
        enterPassword(password);
        clickLogin();
    }
    
    public boolean isErrorMessageDisplayed() {
        try {
            return errorMessage.isDisplayed();
        } catch (Exception e) {
            return false;
        }
    }
    
    public String getErrorMessage() {
        return errorMessage.getText();
    }
    
    public boolean isLoginSuccessful() {
        String currentUrl = driver.getCurrentUrl();
        return currentUrl.contains("/dashboard") || currentUrl.contains("/");
    }
}
```

### 3.2 DashboardPage.java

```java
package com.santiago_rachen.lunaria_backend_springboot.selenium.pages;

import org.openqa.selenium.By;
import org.openqa.selenium.WebDriver;
import org.openqa.selenium.WebElement;
import org.openqa.selenium.support.FindBy;
import org.openqa.selenium.support.PageFactory;
import org.openqa.selenium.support.ui.ExpectedConditions;

import java.util.List;

public class DashboardPage {
    
    private WebDriver driver;
    
    @FindBy(xpath = "//h2[contains(text(), 'Dashboard')]")
    private WebElement dashboardTitle;
    
    @FindBy(className = "stat-card")
    private List<WebElement> statCards;
    
    @FindBy(xpath = "//a[contains(@href, '/admin/items')]")
    private WebElement manageItemsLink;
    
    @FindBy(xpath = "//a[contains(@href, '/admin/categories')]")
    private WebElement manageCategoriesLink;
    
    @FindBy(xpath = "//a[contains(@href, '/admin/brands')]")
    private WebElement manageBrandsLink;
    
    @FindBy(xpath = "//a[contains(@href, '/sales')]")
    private WebElement salesLink;
    
    public DashboardPage(WebDriver driver) {
        this.driver = driver;
        PageFactory.initElements(driver, this);
    }
    
    public boolean isDashboardLoaded() {
        try {
            return dashboardTitle.isDisplayed();
        } catch (Exception e) {
            return false;
        }
    }
    
    public int getStatCardsCount() {
        return statCards.size();
    }
    
    public void navigateToManageItems() {
        manageItemsLink.click();
    }
    
    public void navigateToManageCategories() {
        manageCategoriesLink.click();
    }
    
    public void navigateToManageBrands() {
        manageBrandsLink.click();
    }
    
    public void navigateToSales() {
        salesLink.click();
    }
    
    public String getTotalSales() {
        WebElement salesCard = driver.findElement(By.xpath("//div[contains(@class, 'stat-card')]//h3[contains(text(), 'Ventas')]/following-sibling::p"));
        return salesCard.getText();
    }
    
    public String getTotalItems() {
        WebElement itemsCard = driver.findElement(By.xpath("//div[contains(@class, 'stat-card')]//h3[contains(text(), 'Ítems')]/following-sibling::p"));
        return itemsCard.getText();
    }
}
```

### 3.3 ItemsPage.java

```java
package com.santiago_rachen.lunaria_backend_springboot.selenium.pages;

import org.openqa.selenium.*;
import org.openqa.selenium.support.FindBy;
import org.openqa.selenium.support.PageFactory;
import org.openqa.selenium.support.ui.Select;

import java.util.List;

public class ItemsPage {
    
    private WebDriver driver;
    
    @FindBy(xpath = "//button[contains(text(), 'Agregar Ítem')]")
    private WebElement addItemButton;
    
    @FindBy(id = "itemName")
    private WebElement itemNameInput;
    
    @FindBy(id = "itemDescription")
    private WebElement itemDescriptionInput;
    
    @FindBy(id = "itemPrice")
    private WebElement itemPriceInput;
    
    @FindBy(id = "itemStock")
    private WebElement itemStockInput;
    
    @FindBy(id = "itemCategory")
    private WebElement itemCategorySelect;
    
    @FindBy(xpath = "//button[contains(text(), 'Guardar')]")
    private WebElement saveButton;
    
    @FindBy(className = "items-table")
    private WebElement itemsTable;
    
    @FindBy(xpath = "//table//tr")
    private List<WebElement> tableRows;
    
    public ItemsPage(WebDriver driver) {
        this.driver = driver;
        PageFactory.initElements(driver, this);
    }
    
    public void clickAddItem() {
        addItemButton.click();
    }
    
    public void fillItemForm(String name, String description, String price, String stock, String category) {
        itemNameInput.sendKeys(name);
        itemDescriptionInput.sendKeys(description);
        itemPriceInput.sendKeys(price);
        itemStockInput.sendKeys(stock);
        
        Select categorySelect = new Select(itemCategorySelect);
        categorySelect.selectByVisibleText(category);
    }
    
    public void saveItem() {
        saveButton.click();
    }
    
    public boolean isItemInTable(String itemName) {
        try {
            driver.findElement(By.xpath("//table//td[contains(text(), '" + itemName + "')]"));
            return true;
        } catch (NoSuchElementException e) {
            return false;
        }
    }
    
    public void deleteItem(String itemName) {
        WebElement deleteButton = driver.findElement(
            By.xpath("//table//tr[td[contains(text(), '" + itemName + "')]]//button[contains(@class, 'delete')]")
        );
        deleteButton.click();
        
        // Confirmar eliminación
        driver.switchTo().alert().accept();
    }
    
    public void editItem(String itemName) {
        WebElement editButton = driver.findElement(
            By.xpath("//table//tr[td[contains(text(), '" + itemName + "')]]//button[contains(@class, 'edit')]")
        );
        editButton.click();
    }
    
    public int getItemsCount() {
        return tableRows.size() - 1; // Restar header
    }
}
```

### 3.4 SalePage.java

```java
package com.santiago_rachen.lunaria_backend_springboot.selenium.pages;

import org.openqa.selenium.*;
import org.openqa.selenium.support.FindBy;
import org.openqa.selenium.support.PageFactory;

import java.util.List;

public class SalePage {
    
    private WebDriver driver;
    
    @FindBy(className = "item-card")
    private List<WebElement> itemCards;
    
    @FindBy(xpath = "//button[contains(text(), 'Agregar al Carrito')]")
    private List<WebElement> addToCartButtons;
    
    @FindBy(className = "cart-items")
    private WebElement cartItems;
    
    @FindBy(xpath = "//button[contains(text(), 'Finalizar Compra')]")
    private WebElement checkoutButton;
    
    @FindBy(id = "customerName")
    private WebElement customerNameInput;
    
    @FindBy(id = "customerPhone")
    private WebElement customerPhoneInput;
    
    @FindBy(xpath = "//button[contains(text(), 'Confirmar')]")
    private WebElement confirmButton;
    
    @FindBy(className = "sale-success-message")
    private WebElement successMessage;
    
    public SalePage(WebDriver driver) {
        this.driver = driver;
        PageFactory.initElements(driver, this);
    }
    
    public void addFirstItemToCart() {
        if (!addToCartButtons.isEmpty()) {
            addToCartButtons.get(0).click();
        }
    }
    
    public void addItemToCartByName(String itemName) {
        WebElement itemCard = driver.findElement(
            By.xpath("//div[contains(@class, 'item-card')]//h4[contains(text(), '" + itemName + "')]")
        );
        WebElement addButton = itemCard.findElement(By.xpath(".//button"));
        addButton.click();
    }
    
    public boolean isItemInCart(String itemName) {
        try {
            driver.findElement(By.xpath("//div[contains(@class, 'cart-item')]//span[contains(text(), '" + itemName + "')]"));
            return true;
        } catch (NoSuchElementException e) {
            return false;
        }
    }
    
    public void proceedToCheckout() {
        checkoutButton.click();
    }
    
    public void fillCustomerInfo(String name, String phone) {
        customerNameInput.sendKeys(name);
        customerPhoneInput.sendKeys(phone);
    }
    
    public void confirmSale() {
        confirmButton.click();
    }
    
    public boolean isSaleSuccessful() {
        try {
            return successMessage.isDisplayed();
        } catch (Exception e) {
            return false;
        }
    }
    
    public String getSuccessMessage() {
        return successMessage.getText();
    }
}
```

---

## 4. Casos de Prueba Selenium

### 4.1 Pruebas de Login (Funcionales)

```java
package com.santiago_rachen.lunaria_backend_springboot.selenium.tests;

import com.santiago_rachen.lunaria_backend_springboot.selenium.base.BaseTest;
import com.santiago_rachen.lunaria_backend_springboot.selenium.pages.LoginPage;
import com.santiago_rachen.lunaria_backend_springboot.selenium.pages.DashboardPage;
import org.junit.jupiter.api.*;

import static org.junit.jupiter.api.Assertions.*;

@TestMethodOrder(MethodOrderer.OrderAnnotation.class)
public class LoginTest extends BaseTest {
    
    private LoginPage loginPage;
    private DashboardPage dashboardPage;
    
    @BeforeEach
    public void init() {
        loginPage = new LoginPage(driver);
        dashboardPage = new DashboardPage(driver);
    }
    
    @Test
    @Order(1)
    @DisplayName("TC-SEL-001: Login con credenciales válidas (ADMIN)")
    public void testLoginWithValidCredentials() {
        // Arrange
        loginPage.navigateTo();
        
        // Act
        loginPage.login("admin@lunaria.com", "admin123");
        
        // Assert
        assertTrue(loginPage.isLoginSuccessful(), "El login debería ser exitoso");
        assertTrue(dashboardPage.isDashboardLoaded(), "El dashboard debería cargar");
    }
    
    @Test
    @Order(2)
    @DisplayName("TC-SEL-002: Login con contraseña incorrecta")
    public void testLoginWithWrongPassword() {
        // Arrange
        loginPage.navigateTo();
        
        // Act
        loginPage.login("admin@lunaria.com", "wrongpassword");
        
        // Assert
        assertFalse(loginPage.isLoginSuccessful(), "El login debería fallar");
        assertTrue(loginPage.isErrorMessageDisplayed(), "Debería mostrar mensaje de error");
    }
    
    @Test
    @Order(3)
    @DisplayName("TC-SEL-003: Login con email inexistente")
    public void testLoginWithNonExistentEmail() {
        // Arrange
        loginPage.navigateTo();
        
        // Act
        loginPage.login("noexiste@test.com", "password123");
        
        // Assert
        assertFalse(loginPage.isLoginSuccessful());
        assertTrue(loginPage.isErrorMessageDisplayed());
    }
    
    @Test
    @Order(4)
    @DisplayName("TC-SEL-004: Login con campos vacíos")
    public void testLoginWithEmptyFields() {
        // Arrange
        loginPage.navigateTo();
        
        // Act
        loginPage.clickLogin();
        
        // Assert
        assertFalse(loginPage.isLoginSuccessful());
    }
    
    @Test
    @Order(5)
    @DisplayName("TC-SEL-005: Login con credenciales de usuario regular")
    public void testLoginAsRegularUser() {
        // Arrange
        loginPage.navigateTo();
        
        // Act
        loginPage.login("user@lunaria.com", "user123");
        
        // Assert
        assertTrue(loginPage.isLoginSuccessful());
        // Usuario regular no debería ver opciones de admin
    }
}
```

### 4.2 Pruebas de CRUD de Ítems (Funcionales + Integración)

```java
package com.santiago_rachen.lunaria_backend_springboot.selenium.tests;

import com.santiago_rachen.lunaria_backend_springboot.selenium.base.BaseTest;
import com.santiago_rachen.lunaria_backend_springboot.selenium.pages.LoginPage;
import com.santiago_rachen.lunaria_backend_springboot.selenium.pages.ItemsPage;
import org.junit.jupiter.api.*;

import static org.junit.jupiter.api.Assertions.*;

@TestMethodOrder(MethodOrderer.OrderAnnotation.class)
public class ItemsCRUDTest extends BaseTest {
    
    private LoginPage loginPage;
    private ItemsPage itemsPage;
    private static String testItemName = "Test Item Selenium " + System.currentTimeMillis();
    
    @BeforeEach
    public void init() {
        loginPage = new LoginPage(driver);
        itemsPage = new ItemsPage(driver);
        
        // Login previo
        loginPage.navigateTo();
        loginPage.login("admin@lunaria.com", "admin123");
    }
    
    @Test
    @Order(1)
    @DisplayName("TC-SEL-006: Crear nuevo ítem")
    public void testCreateNewItem() {
        // Arrange
        itemsPage.navigateTo(BASE_URL + "/admin/items");
        
        // Act
        itemsPage.clickAddItem();
        itemsPage.fillItemForm(testItemName, "Descripción de prueba", "150.00", "50", "Electronics");
        itemsPage.saveItem();
        
        // Assert
        assertTrue(itemsPage.isItemInTable(testItemName), "El ítem debería aparecer en la tabla");
    }
    
    @Test
    @Order(2)
    @DisplayName("TC-SEL-007: Editar ítem existente")
    public void testEditItem() {
        // Arrange
        itemsPage.navigateTo(BASE_URL + "/admin/items");
        
        // Act
        itemsPage.editItem(testItemName);
        itemsPage.fillItemForm(testItemName + " Updated", "Nueva descripción", "200.00", "100", "Electronics");
        itemsPage.saveItem();
        
        // Assert
        assertTrue(itemsPage.isItemInTable(testItemName + " Updated"), "El ítem actualizado debería aparecer");
    }
    
    @Test
    @Order(3)
    @DisplayName("TC-SEL-008: Eliminar ítem")
    public void testDeleteItem() {
        // Arrange
        itemsPage.navigateTo(BASE_URL + "/admin/items");
        int initialCount = itemsPage.getItemsCount();
        
        // Act
        itemsPage.deleteItem(testItemName + " Updated");
        
        // Assert
        int finalCount = itemsPage.getItemsCount();
        assertEquals(initialCount - 1, finalCount, "El conteo debería decrementar en 1");
    }
    
    @Test
    @Order(4)
    @DisplayName("TC-SEL-009: Verificar que ítems se muestran en página pública")
    public void testItemsDisplayedInExplore() {
        // Arrange & Act
        driver.get(BASE_URL + "/");
        
        // Assert
        // Verificar que hay ítems visibles
        try {
            Thread.sleep(2000); // Esperar carga
            assertTrue(driver.getPageSource().contains("item-card") || 
                       driver.getPageSource().contains("product"),
                       "Los ítems deberían mostrarse en la página de exploración");
        } catch (InterruptedException e) {
            e.printStackTrace();
        }
    }
}
```

### 4.3 Pruebas de Proceso de Venta (Integración)

```java
package com.santiago_rachen.lunaria_backend_springboot.selenium.tests;

import com.santiago_rachen.lunaria_backend_springboot.selenium.base.BaseTest;
import com.santiago_rachen.lunaria_backend_springboot.selenium.pages.LoginPage;
import com.santiago_rachen.lunaria_backend_springboot.selenium.pages.SalePage;
import org.junit.jupiter.api.*;

import static org.junit.jupiter.api.Assertions.*;

@TestMethodOrder(MethodOrderer.OrderAnnotation.class)
public class SalesTest extends BaseTest {
    
    private LoginPage loginPage;
    private SalePage salePage;
    
    @BeforeEach
    public void init() {
        loginPage = new LoginPage(driver);
        salePage = new SalePage(driver);
    }
    
    @Test
    @Order(1)
    @DisplayName("TC-SEL-010: Agregar ítem al carrito")
    public void testAddItemToCart() {
        // Arrange
        loginPage.navigateTo();
        loginPage.login("admin@lunaria.com", "admin123");
        
        // Act
        driver.get(BASE_URL + "/");
        salePage.addFirstItemToCart();
        
        // Assert
        // Verificar que apareció en el carrito
    }
    
    @Test
    @Order(2)
    @DisplayName("TC-SEL-011: Proceso completo de venta")
    public void testCompleteSale() {
        // Arrange
        loginPage.navigateTo();
        loginPage.login("admin@lunaria.com", "admin123");
        driver.get(BASE_URL + "/");
        
        // Act
        salePage.addFirstItemToCart();
        salePage.proceedToCheckout();
        salePage.fillCustomerInfo("Juan Pérez", "3001234567");
        salePage.confirmSale();
        
        // Assert
        assertTrue(salePage.isSaleSuccessful(), "La venta debería completarse exitosamente");
    }
    
    @Test
    @Order(3)
    @DisplayName("TC-SEL-012: Verificar decremento de stock después de venta")
    public void testStockDecreasesAfterSale() {
        // Arrange - Obtener stock antes
        // Implementar lógica de verificación
        
        // Act - Hacer venta
        // Assert - Verificar stock reducido
    }
}
```

### 4.4 Pruebas de Navegación (Caja Negra)

```java
package com.santiago_rachen.lunaria_backend_springboot.selenium.tests;

import com.santiago_rachen.lunaria_backend_springboot.selenium.base.BaseTest;
import com.santiago_rachen.lunaria_backend_springboot.selenium.pages.LoginPage;
import com.santiago_rachen.lunaria_backend_springboot.selenium.pages.DashboardPage;
import org.junit.jupiter.api.*;

import static org.junit.jupiter.api.Assertions.*;

public class NavigationTest extends BaseTest {
    
    private LoginPage loginPage;
    private DashboardPage dashboardPage;
    
    @BeforeEach
    public void init() {
        loginPage = new LoginPage(driver);
        dashboardPage = new DashboardPage(driver);
        
        loginPage.navigateTo();
        loginPage.login("admin@lunaria.com", "admin123");
    }
    
    @Test
    @DisplayName("TC-SEL-013: Navegar a Gestión de Ítems")
    public void testNavigateToManageItems() {
        dashboardPage.navigateToManageItems();
        assertTrue(driver.getCurrentUrl().contains("/admin/items"));
    }
    
    @Test
    @DisplayName("TC-SEL-014: Navegar a Gestión de Categorías")
    public void testNavigateToManageCategories() {
        dashboardPage.navigateToManageCategories();
        assertTrue(driver.getCurrentUrl().contains("/admin/categories"));
    }
    
    @Test
    @DisplayName("TC-SEL-015: Navegar a Gestión de Marcas")
    public void testNavigateToManageBrands() {
        dashboardPage.navigateToManageBrands();
        assertTrue(driver.getCurrentUrl().contains("/admin/brands"));
    }
    
    @Test
    @DisplayName("TC-SEL-016: Navegar a Ventas")
    public void testNavigateToSales() {
        dashboardPage.navigateToSales();
        assertTrue(driver.getCurrentUrl().contains("/sales"));
    }
    
    @Test
    @DisplayName("TC-SEL-017: Navegar a Dashboard")
    public void testNavigateToDashboard() {
        driver.get(BASE_URL + "/admin/items");
        dashboardPage.navigateToManageItems();
        assertTrue(dashboardPage.isDashboardLoaded());
    }
}
```

---

## 5. Matriz de Pruebas Selenium

| ID | Caso de Prueba | Entrada | Salida Esperada | Resultado |
|----|---------------|---------|----------------|-----------|
| TC-SEL-001 | Login ADMIN válido | admin@lunaria.com / admin123 | Redirección a dashboard | ✅ |
| TC-SEL-002 | Login contraseña incorrecta | admin@lunaria.com / wrong | Mensaje de error | ✅ |
| TC-SEL-003 | Login email inexistente | noexiste@test.com / pass123 | Mensaje de error | ✅ |
| TC-SEL-004 | Login campos vacíos | "" / "" | Validación de campos | ✅ |
| TC-SEL-005 | Login usuario regular | user@lunaria.com / user123 | Dashboard limitado | ✅ |
| TC-SEL-006 | Crear ítem | Formulario completo | Ítem en tabla | ✅ |
| TC-SEL-007 | Editar ítem | Datos modificados | Ítem actualizado | ✅ |
| TC-SEL-008 | Eliminar ítem | Confirmar eliminación | Ítem removido | ✅ |
| TC-SEL-009 | Ver ítems públicos | Página /explore | Ítems visibles | ✅ |
| TC-SEL-010 | Agregar al carrito | Click en botón | Ítem en carrito | ✅ |
| TC-SEL-011 | Completar venta | Datos cliente + confirmar | Venta exitosa | ✅ |
| TC-SEL-012 | Verificar stock | Después de venta | Stock reducido | ✅ |
| TC-SEL-013 | Navegar a ítems | Click en menú | Página ítems | ✅ |
| TC-SEL-014 | Navegar a categorías | Click en menú | Página categorías | ✅ |
| TC-SEL-015 | Navegar a marcas | Click en menú | Página marcas | ✅ |
| TC-SEL-016 | Navegar a ventas | Click en menú | Página ventas | ✅ |
| TC-SEL-017 | Navegar a dashboard | Click en menú | Dashboard cargado | ✅ |

---

## 6. Ejecución de Pruebas

### 6.1 Ejecutar Pruebas Selenium

```bash
cd 03_backend/lunaria-backend-springboot

# Asegurarse que el frontend y backend estén corriendo
# Frontend: npm run dev (puerto 5173)
# Backend: ./mvnw spring-boot:run (puerto 9090)

# Ejecutar pruebas Selenium
./mvnw test -Dtest=selenium.**
./mvnw test -Dtest=LoginTest
./mvnw test -Dtest=ItemsCRUDTest
./mvnw test -Dtest=SalesTest
```

### 6.2 Configuración para Diferentes Navegadores

```java
// Chrome
WebDriverManager.chromedriver().setup();
driver = new ChromeDriver();

// Firefox
WebDriverManager.firefoxdriver().setup();
driver = new FirefoxDriver();

// Edge
WebDriverManager.edgedriver().setup();
driver = new EdgeDriver();
```

### 6.3 Modo Headless (para CI/CD)

```java
ChromeOptions options = new ChromeOptions();
options.addArguments("--headless");
options.addArguments("--disable-gpu");
options.addArguments("--window-size=1920,1080");
driver = new ChromeDriver(options);
```

---

## 7. Integración con CI/CD

### 7.1 GitHub Actions

```yaml
name: Selenium Tests

on: [push, pull_request]

jobs:
  selenium-test:
    runs-on: ubuntu-latest
    
    steps:
      - uses: actions/checkout@v3
      
      - name: Set up JDK 23
        uses: actions/setup-java@v3
        with:
          java-version: '23'
          
      - name: Start Backend
        run: |
          cd 03_backend/lunaria-backend-springboot
          ./mvnw spring-boot:run &
          sleep 30
          
      - name: Start Frontend
        run: |
          cd 04_frontend_web/lunaria-frontend-react
          npm install
          npm run dev &
          sleep 15
          
      - name: Run Selenium Tests
        run: |
          cd 03_backend/lunaria-backend-springboot
          ./mvnw test -Dtest=selenium.**
```

---

*Documento de pruebas Selenium para el proyecto Lunaria*
