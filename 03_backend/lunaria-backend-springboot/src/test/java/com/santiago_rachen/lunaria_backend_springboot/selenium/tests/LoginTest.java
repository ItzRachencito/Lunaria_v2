package com.santiago_rachen.lunaria_backend_springboot.selenium.tests;

import com.santiago_rachen.lunaria_backend_springboot.selenium.base.BaseTest;
import com.santiago_rachen.lunaria_backend_springboot.selenium.pages.LoginPage;
import com.santiago_rachen.lunaria_backend_springboot.selenium.pages.DashboardPage;
import org.junit.jupiter.api.*;

import static org.junit.jupiter.api.Assertions.*;

/**
 * Selenium tests for Login functionality
 * Tests: TC-SEL-001 to TC-SEL-005
 */
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
        loginPage.login(ADMIN_EMAIL, ADMIN_PASSWORD);
        
        // Wait for navigation
        try {
            Thread.sleep(3000);
        } catch (InterruptedException e) {
            Thread.currentThread().interrupt();
        }
        
        // Assert
        assertTrue(loginPage.isLoginSuccessful(), "El login debería ser exitoso");
    }
    
    @Test
    @Order(2)
    @DisplayName("TC-SEL-002: Login con contraseña incorrecta")
    public void testLoginWithWrongPassword() {
        // Arrange
        loginPage.navigateTo();
        
        // Act
        loginPage.login(ADMIN_EMAIL, "wrongpassword");
        
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
        
        // Act - Click login without entering credentials
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
        loginPage.login(USER_EMAIL, USER_PASSWORD);
        
        // Wait for navigation
        try {
            Thread.sleep(3000);
        } catch (InterruptedException e) {
            Thread.currentThread().interrupt();
        }
        
        // Assert
        assertTrue(loginPage.isLoginSuccessful());
    }
}
