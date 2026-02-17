package com.santiago_rachen.lunaria_backend_springboot.selenium.pages;

import org.openqa.selenium.By;
import org.openqa.selenium.WebDriver;
import org.openqa.selenium.WebElement;
import org.openqa.selenium.support.FindBy;
import org.openqa.selenium.support.PageFactory;
import org.openqa.selenium.support.ui.ExpectedConditions;
import org.openqa.selenium.support.ui.WebDriverWait;

/**
 * Page Object for Login page
 * Encapsulates login page elements and actions
 */
public class LoginPage {
    
    private WebDriver driver;
    private WebDriverWait wait;
    
    // Locators using @FindBy annotations
    @FindBy(id = "email")
    private WebElement emailInput;
    
    @FindBy(id = "password")
    private WebElement passwordInput;
    
    @FindBy(xpath = "//button[contains(text(), 'Login') or contains(text(), 'Iniciar')]")
    private WebElement loginButton;
    
    @FindBy(xpath = "//button[@type='submit']")
    private WebElement submitButton;
    
    @FindBy(className = "error-message")
    private WebElement errorMessage;
    
    @FindBy(xpath = "//div[contains(@class, 'alert') or contains(@class, 'error')]")
    private WebElement alertMessage;
    
    @FindBy(xpath = "//a[contains(@href, '/register')]")
    private WebElement registerLink;
    
    // Common error message patterns
    private By errorAlertLocator = By.xpath("//div[contains(@class, 'alert-danger') or contains(@class, 'error')]");
    private By successAlertLocator = By.xpath("//div[contains(@class, 'alert-success')]");
    
    public LoginPage(WebDriver driver) {
        this.driver = driver;
        this.wait = new WebDriverWait(driver, java.time.Duration.ofSeconds(10));
        PageFactory.initElements(driver, this);
    }
    
    /**
     * Navigate to login page
     */
    public void navigateTo() {
        driver.get("http://localhost:5173/login");
        waitForPageLoad();
    }
    
    /**
     * Navigate to login page with custom URL
     */
    public void navigateTo(String url) {
        driver.get(url);
        waitForPageLoad();
    }
    
    /**
     * Enter email
     */
    public void enterEmail(String email) {
        wait.until(ExpectedConditions.visibilityOf(emailInput));
        emailInput.clear();
        emailInput.sendKeys(email);
    }
    
    /**
     * Enter password
     */
    public void enterPassword(String password) {
        wait.until(ExpectedConditions.visibilityOf(passwordInput));
        passwordInput.clear();
        passwordInput.sendKeys(password);
    }
    
    /**
     * Click login button
     */
    public void clickLogin() {
        wait.until(ExpectedConditions.elementToBeClickable(loginButton));
        loginButton.click();
    }
    
    /**
     * Click submit button (alternative)
     */
    public void clickSubmit() {
        wait.until(ExpectedConditions.elementToBeClickable(submitButton));
        submitButton.click();
    }
    
    /**
     * Complete login with email and password
     */
    public void login(String email, String password) {
        enterEmail(email);
        enterPassword(password);
        clickLogin();
    }
    
    /**
     * Complete login and wait for redirect
     */
    public void loginAndWait(String email, String password) {
        enterEmail(email);
        enterPassword(password);
        clickLogin();
        // Wait for redirect - simplified approach
        try {
            Thread.sleep(2000);
        } catch (InterruptedException e) {
            Thread.currentThread().interrupt();
        }
    }
    
    /**
     * Check if error message is displayed
     */
    public boolean isErrorMessageDisplayed() {
        try {
            return errorMessage.isDisplayed() || 
                   driver.findElements(errorAlertLocator).size() > 0;
        } catch (Exception e) {
            return false;
        }
    }
    
    /**
     * Get error message text
     */
    public String getErrorMessage() {
        try {
            if (errorMessage.isDisplayed()) {
                return errorMessage.getText();
            }
            WebElement alert = driver.findElement(errorAlertLocator);
            return alert.getText();
        } catch (Exception e) {
            return "";
        }
    }
    
    /**
     * Check if login was successful (redirected away from login page)
     */
    public boolean isLoginSuccessful() {
        String currentUrl = driver.getCurrentUrl();
        return !currentUrl.contains("/login") && !currentUrl.contains("/register");
    }
    
    /**
     * Check if we are on the login page
     */
    public boolean isOnLoginPage() {
        String currentUrl = driver.getCurrentUrl();
        return currentUrl.contains("/login");
    }
    
    /**
     * Click register link
     */
    public void clickRegisterLink() {
        if (registerLink != null) {
            wait.until(ExpectedConditions.elementToBeClickable(registerLink));
            registerLink.click();
        }
    }
    
    /**
     * Wait for page to load
     */
    private void waitForPageLoad() {
        wait.until(ExpectedConditions.jsReturnsValue("return document.readyState === 'complete'"));
    }
    
    /**
     * Get page title
     */
    public String getPageTitle() {
        return driver.getTitle();
    }
}
