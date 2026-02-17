package com.santiago_rachen.lunaria_backend_springboot.selenium.pages;

import org.openqa.selenium.By;
import org.openqa.selenium.WebDriver;
import org.openqa.selenium.WebElement;
import org.openqa.selenium.support.FindBy;
import org.openqa.selenium.support.PageFactory;
import org.openqa.selenium.support.ui.ExpectedConditions;
import org.openqa.selenium.support.ui.WebDriverWait;

import java.util.List;

/**
 * Page Object for Dashboard page
 * Encapsulates dashboard page elements and navigation actions
 */
public class DashboardPage {
    
    private WebDriver driver;
    private WebDriverWait wait;
    
    // Dashboard elements
    @FindBy(xpath = "//h1[contains(text(), 'Dashboard') or contains(text(), 'Panel')]")
    private WebElement dashboardTitle;
    
    @FindBy(xpath = "//h2[contains(text(), 'Dashboard') or contains(text(), 'Panel')]")
    private WebElement dashboardSubtitle;
    
    @FindBy(className = "stat-card")
    private List<WebElement> statCards;
    
    @FindBy(xpath = "//div[contains(@class, 'stats')]//div[contains(@class, 'card')]")
    private List<WebElement> statsCards;
    
    // Navigation links
    @FindBy(xpath = "//a[contains(@href, '/admin/items')]")
    private WebElement manageItemsLink;
    
    @FindBy(xpath = "//a[contains(@href, '/admin/categories')]")
    private WebElement manageCategoriesLink;
    
    @FindBy(xpath = "//a[contains(@href, '/admin/brands')]")
    private WebElement manageBrandsLink;
    
    @FindBy(xpath = "//a[contains(@href, '/admin/users')]")
    private WebElement manageUsersLink;
    
    @FindBy(xpath = "//a[contains(@href, '/sales')]")
    private WebElement salesLink;
    
    @FindBy(xpath = "//a[contains(@href, '/favorites')]")
    private WebElement favoritesLink;
    
    @FindBy(xpath = "//a[contains(@href, '/explore')]")
    private WebElement exploreLink;
    
    @FindBy(xpath = "//a[contains(@href, '/admin/stock')]")
    private WebElement stockLink;
    
    // Menu elements
    @FindBy(className = "navbar")
    private WebElement navbar;
    
    @FindBy(className = "sidebar")
    private WebElement sidebar;
    
    @FindBy(xpath = "//button[contains(text(), 'Logout') or contains(text(), 'Cerrar')]")
    private WebElement logoutButton;
    
    public DashboardPage(WebDriver driver) {
        this.driver = driver;
        this.wait = new WebDriverWait(driver, java.time.Duration.ofSeconds(10));
        PageFactory.initElements(driver, this);
    }
    
    /**
     * Navigate to dashboard
     */
    public void navigateTo() {
        driver.get("http://localhost:5173/dashboard");
        waitForPageLoad();
    }
    
    /**
     * Check if dashboard is loaded
     */
    public boolean isDashboardLoaded() {
        try {
            return (dashboardTitle != null && dashboardTitle.isDisplayed()) ||
                   (dashboardSubtitle != null && dashboardSubtitle.isDisplayed());
        } catch (Exception e) {
            return false;
        }
    }
    
    /**
     * Get dashboard title text
     */
    public String getDashboardTitle() {
        try {
            if (dashboardTitle != null && dashboardTitle.isDisplayed()) {
                return dashboardTitle.getText();
            }
            if (dashboardSubtitle != null && dashboardSubtitle.isDisplayed()) {
                return dashboardSubtitle.getText();
            }
            return "";
        } catch (Exception e) {
            return "";
        }
    }
    
    /**
     * Get number of stat cards
     */
    public int getStatCardsCount() {
        try {
            return statCards.size() > 0 ? statCards.size() : statsCards.size();
        } catch (Exception e) {
            return 0;
        }
    }
    
    /**
     * Navigate to Manage Items page
     */
    public void navigateToManageItems() {
        wait.until(ExpectedConditions.elementToBeClickable(manageItemsLink));
        manageItemsLink.click();
        waitForPageLoad();
    }
    
    /**
     * Navigate to Manage Categories page
     */
    public void navigateToManageCategories() {
        wait.until(ExpectedConditions.elementToBeClickable(manageCategoriesLink));
        manageCategoriesLink.click();
        waitForPageLoad();
    }
    
    /**
     * Navigate to Manage Brands page
     */
    public void navigateToManageBrands() {
        wait.until(ExpectedConditions.elementToBeClickable(manageBrandsLink));
        manageBrandsLink.click();
        waitForPageLoad();
    }
    
    /**
     * Navigate to Manage Users page
     */
    public void navigateToManageUsers() {
        wait.until(ExpectedConditions.elementToBeClickable(manageUsersLink));
        manageUsersLink.click();
        waitForPageLoad();
    }
    
    /**
     * Navigate to Sales page
     */
    public void navigateToSales() {
        wait.until(ExpectedConditions.elementToBeClickable(salesLink));
        salesLink.click();
        waitForPageLoad();
    }
    
    /**
     * Navigate to Favorites page
     */
    public void navigateToFavorites() {
        wait.until(ExpectedConditions.elementToBeClickable(favoritesLink));
        favoritesLink.click();
        waitForPageLoad();
    }
    
    /**
     * Navigate to Explore page
     */
    public void navigateToExplore() {
        wait.until(ExpectedConditions.elementToBeClickable(exploreLink));
        exploreLink.click();
        waitForPageLoad();
    }
    
    /**
     * Navigate to Stock page
     */
    public void navigateToStock() {
        wait.until(ExpectedConditions.elementToBeClickable(stockLink));
        stockLink.click();
        waitForPageLoad();
    }
    
    /**
     * Click logout button
     */
    public void logout() {
        if (logoutButton != null) {
            wait.until(ExpectedConditions.elementToBeClickable(logoutButton));
            logoutButton.click();
        }
    }
    
    /**
     * Get total sales value
     */
    public String getTotalSales() {
        try {
            WebElement salesCard = driver.findElement(
                By.xpath("//div[contains(@class, 'stat-card')]//h3[contains(text(), 'Ventas')]/following-sibling::p | " +
                        "//div[contains(@class, 'stat-card')]//span[contains(text(), 'Ventas')]/following-sibling::p")
            );
            return salesCard.getText();
        } catch (Exception e) {
            return "";
        }
    }
    
    /**
     * Get total items count
     */
    public String getTotalItems() {
        try {
            WebElement itemsCard = driver.findElement(
                By.xpath("//div[contains(@class, 'stat-card')]//h3[contains(text(), 'Items') or contains(text(), 'Productos')]/following-sibling::p")
            );
            return itemsCard.getText();
        } catch (Exception e) {
            return "";
        }
    }
    
    /**
     * Wait for page to load
     */
    private void waitForPageLoad() {
        wait.until(ExpectedConditions.jsReturnsValue("return document.readyState === 'complete'"));
    }
    
    /**
     * Check if current URL contains dashboard
     */
    public boolean isOnDashboardPage() {
        return driver.getCurrentUrl().contains("/dashboard");
    }
}
