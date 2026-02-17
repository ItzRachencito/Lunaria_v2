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

/**
 * Base class for all Selenium tests
 * Provides common setup and teardown functionality
 */
@TestInstance(TestInstance.Lifecycle.PER_CLASS)
public class BaseTest {
    
    protected WebDriver driver;
    protected WebDriverWait wait;
    
    // Application URLs
    protected static final String BASE_URL = "http://localhost:5173";
    protected static final String API_BASE_URL = "http://localhost:9090/api/v1.0";
    
    // Test credentials
    protected static final String ADMIN_EMAIL = "admin@lunaria.com";
    protected static final String ADMIN_PASSWORD = "admin123";
    protected static final String USER_EMAIL = "user@lunaria.com";
    protected static final String USER_PASSWORD = "user123";
    
    @BeforeAll
    public void setUp() {
        // Setup ChromeDriver using WebDriverManager
        WebDriverManager.chromedriver().setup();
        
        // Configure Chrome options
        ChromeOptions options = new ChromeOptions();
        options.addArguments("--start-maximized");
        options.addArguments("--disable-notifications");
        options.addArguments("--disable-popup-blocking");
        options.addArguments("--incognito");
        options.addArguments("--disable-extensions");
        options.addArguments("--disable-web-security");
        options.addArguments("--allow-running-insecure-content");
        
        // Initialize WebDriver
        driver = new ChromeDriver(options);
        
        // Configure timeouts
        driver.manage().timeouts().implicitlyWait(10, TimeUnit.SECONDS);
        driver.manage().timeouts().pageLoadTimeout(30, TimeUnit.SECONDS);
        
        // Initialize explicit wait
        wait = new WebDriverWait(driver, Duration.ofSeconds(15));
    }
    
    @AfterEach
    public void takeScreenshotOnFailure(TestInfo testInfo) {
        // This method can be extended to capture screenshots on test failure
        // Implementation can use TakesScreenshot interface
    }
    
    @AfterAll
    public void tearDown() {
        if (driver != null) {
            driver.quit();
        }
    }
    
    /**
     * Navigate to a specific URL
     */
    protected void navigateTo(String url) {
        driver.get(url);
    }
    
    /**
     * Get current URL
     */
    protected String getCurrentUrl() {
        return driver.getCurrentUrl();
    }
    
    /**
     * Refresh the current page
     */
    protected void refreshPage() {
        driver.navigate().refresh();
    }
    
    /**
     * Go back in browser history
     */
    protected void goBack() {
        driver.navigate().back();
    }
    
    /**
     * Go forward in browser history
     */
    protected void goForward() {
        driver.navigate().forward();
    }
}
