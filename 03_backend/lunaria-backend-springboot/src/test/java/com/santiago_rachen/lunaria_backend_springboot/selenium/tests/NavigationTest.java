package com.santiago_rachen.lunaria_backend_springboot.selenium.tests;

import com.santiago_rachen.lunaria_backend_springboot.selenium.base.BaseTest;
import com.santiago_rachen.lunaria_backend_springboot.selenium.pages.LoginPage;
import com.santiago_rachen.lunaria_backend_springboot.selenium.pages.DashboardPage;
import org.junit.jupiter.api.*;

import static org.junit.jupiter.api.Assertions.*;

/**
 * Selenium tests for Navigation functionality
 * Tests: TC-SEL-013 to TC-SEL-017
 */
@TestMethodOrder(MethodOrderer.OrderAnnotation.class)
public class NavigationTest extends BaseTest {
    
    private LoginPage loginPage;
    private DashboardPage dashboardPage;
    
    @BeforeEach
    public void init() {
        loginPage = new LoginPage(driver);
        dashboardPage = new DashboardPage(driver);
        
        // Login as admin before each test
        loginPage.navigateTo();
        loginPage.login(ADMIN_EMAIL, ADMIN_PASSWORD);
        
        // Wait for login to complete
        try {
            Thread.sleep(3000);
        } catch (InterruptedException e) {
            Thread.currentThread().interrupt();
        }
    }
    
    @Test
    @Order(1)
    @DisplayName("TC-SEL-013: Navegar a Gestión de Ítems")
    public void testNavigateToManageItems() {
        // Act
        dashboardPage.navigateToManageItems();
        
        // Wait for navigation
        try {
            Thread.sleep(2000);
        } catch (InterruptedException e) {
            Thread.currentThread().interrupt();
        }
        
        // Assert
        String currentUrl = driver.getCurrentUrl();
        assertTrue(currentUrl.contains("/admin/items"), 
            "URL should contain /admin/items, got: " + currentUrl);
    }
    
    @Test
    @Order(2)
    @DisplayName("TC-SEL-014: Navegar a Gestión de Categorías")
    public void testNavigateToManageCategories() {
        // Act
        dashboardPage.navigateToManageCategories();
        
        // Wait for navigation
        try {
            Thread.sleep(2000);
        } catch (InterruptedException e) {
            Thread.currentThread().interrupt();
        }
        
        // Assert
        String currentUrl = driver.getCurrentUrl();
        assertTrue(currentUrl.contains("/admin/categories"), 
            "URL should contain /admin/categories, got: " + currentUrl);
    }
    
    @Test
    @Order(3)
    @DisplayName("TC-SEL-015: Navegar a Gestión de Marcas")
    public void testNavigateToManageBrands() {
        // Act
        dashboardPage.navigateToManageBrands();
        
        // Wait for navigation
        try {
            Thread.sleep(2000);
        } catch (InterruptedException e) {
            Thread.currentThread().interrupt();
        }
        
        // Assert
        String currentUrl = driver.getCurrentUrl();
        assertTrue(currentUrl.contains("/admin/brands"), 
            "URL should contain /admin/brands, got: " + currentUrl);
    }
    
    @Test
    @Order(4)
    @DisplayName("TC-SEL-016: Navegar a Ventas")
    public void testNavigateToSales() {
        // Act
        dashboardPage.navigateToSales();
        
        // Wait for navigation
        try {
            Thread.sleep(2000);
        } catch (InterruptedException e) {
            Thread.currentThread().interrupt();
        }
        
        // Assert
        String currentUrl = driver.getCurrentUrl();
        assertTrue(currentUrl.contains("/sales"), 
            "URL should contain /sales, got: " + currentUrl);
    }
    
    @Test
    @Order(5)
    @DisplayName("TC-SEL-017: Navegar a Dashboard")
    public void testNavigateToDashboard() {
        // Arrange - Navigate away first
        navigateTo(BASE_URL + "/admin/items");
        
        try {
            Thread.sleep(2000);
        } catch (InterruptedException e) {
            Thread.currentThread().interrupt();
        }
        
        // Act - Navigate to dashboard via URL
        dashboardPage.navigateTo();
        
        // Wait for navigation
        try {
            Thread.sleep(2000);
        } catch (InterruptedException e) {
            Thread.currentThread().interrupt();
        }
        
        // Assert
        assertTrue(dashboardPage.isDashboardLoaded() || 
                   driver.getCurrentUrl().contains("/dashboard"),
            "Dashboard should be loaded");
    }
}
