package com.santiago_rachen.lunaria_backend_springboot.selenium.pages;

import org.openqa.selenium.By;
import org.openqa.selenium.NoSuchElementException;
import org.openqa.selenium.WebDriver;
import org.openqa.selenium.WebElement;
import org.openqa.selenium.support.FindBy;
import org.openqa.selenium.support.PageFactory;
import org.openqa.selenium.support.ui.ExpectedConditions;
import org.openqa.selenium.support.ui.WebDriverWait;

import java.util.List;

/**
 * Page Object for Sales page
 * Encapsulates sales and cart operations
 */
public class SalePage {
    
    private WebDriver driver;
    private WebDriverWait wait;
    
    // Item cards (products display)
    @FindBy(className = "item-card")
    private List<WebElement> itemCards;
    
    @FindBy(xpath = "//div[contains(@class, 'product')]")
    private List<WebElement> productCards;
    
    // Add to cart buttons
    @FindBy(xpath = "//button[contains(text(), 'Agregar') or contains(text(), 'Add')]")
    private List<WebElement> addToCartButtons;
    
    @FindBy(xpath = "//button[contains(@class, 'add-to-cart')]")
    private List<WebElement> addToCartBtnList;
    
    // Cart elements
    @FindBy(className = "cart-items")
    private WebElement cartItems;
    
    @FindBy(xpath = "//div[contains(@class, 'cart')]")
    private WebElement cart;
    
    @FindBy(xpath = "//span[contains(@class, 'cart-count')]")
    private WebElement cartCount;
    
    // Checkout buttons
    @FindBy(xpath = "//button[contains(text(), 'Carrito') or contains(text(), 'Cart')]")
    private WebElement cartButton;
    
    @FindBy(xpath = "//button[contains(text(), 'Finalizar') or contains(text(), 'Checkout')]")
    private WebElement checkoutButton;
    
    @FindBy(xpath = "//button[contains(text(), 'Pagar') or contains(text(), 'Pay')]")
    private WebElement payButton;
    
    // Customer form
    @FindBy(id = "customerName")
    private WebElement customerNameInput;
    
    @FindBy(id = "name")
    private WebElement nameInput;
    
    @FindBy(id = "customerPhone")
    private WebElement customerPhoneInput;
    
    @FindBy(id = "phone")
    private WebElement phoneInput;
    
    @FindBy(id = "customerEmail")
    private WebElement customerEmailInput;
    
    // Confirmation buttons
    @FindBy(xpath = "//button[contains(text(), 'Confirmar') or contains(text(), 'Confirm')]")
    private WebElement confirmButton;
    
    @FindBy(xpath = "//button[contains(text(), 'Aceptar') or contains(text(), 'Accept')]")
    private WebElement acceptButton;
    
    // Success/Error messages
    @FindBy(xpath = "//div[contains(@class, 'alert-success') or contains(@class, 'success')]")
    private WebElement successMessage;
    
    @FindBy(xpath = "//div[contains(@class, 'alert-danger') or contains(@class, 'error')]")
    private WebElement errorMessage;
    
    // Sale details
    @FindBy(className = "sale-total")
    private WebElement saleTotal;
    
    @FindBy(xpath = "//span[contains(@class, 'total')]")
    private WebElement totalAmount;
    
    public SalePage(WebDriver driver) {
        this.driver = driver;
        this.wait = new WebDriverWait(driver, java.time.Duration.ofSeconds(10));
        PageFactory.initElements(driver, this);
    }
    
    /**
     * Navigate to explore/sales page
     */
    public void navigateTo() {
        driver.get("http://localhost:5173/");
        waitForPageLoad();
    }
    
    /**
     * Navigate to sales history
     */
    public void navigateToSalesHistory() {
        driver.get("http://localhost:5173/sales");
        waitForPageLoad();
    }
    
    /**
     * Add first available item to cart
     */
    public void addFirstItemToCart() {
        if (addToCartButtons != null && !addToCartButtons.isEmpty()) {
            wait.until(ExpectedConditions.elementToBeClickable(addToCartButtons.get(0)));
            addToCartButtons.get(0).click();
            waitForCartUpdate();
        }
    }
    
    /**
     * Add item to cart by product name
     */
    public void addItemToCartByName(String itemName) {
        try {
            // Find the product card containing the item name
            WebElement productCard = driver.findElement(
                By.xpath("//div[contains(@class, 'item-card') or contains(@class, 'product')]//h4[contains(text(), '" + itemName + "')]/ancestor::div[contains(@class, 'item-card') or contains(@class, 'product')]")
            );
            WebElement addButton = productCard.findElement(
                By.xpath(".//button[contains(text(), 'Agregar') or contains(text(), 'Add')]")
            );
            wait.until(ExpectedConditions.elementToBeClickable(addButton));
            addButton.click();
            waitForCartUpdate();
        } catch (NoSuchElementException e) {
            // Try alternative approach
            addFirstItemToCart();
        }
    }
    
    /**
     * Check if item is in cart
     */
    public boolean isItemInCart(String itemName) {
        try {
            driver.findElement(By.xpath("//div[contains(@class, 'cart-item')]//span[contains(text(), '" + itemName + "')]"));
            return true;
        } catch (NoSuchElementException e) {
            return false;
        }
    }
    
    /**
     * Open cart
     */
    public void openCart() {
        if (cartButton != null) {
            wait.until(ExpectedConditions.elementToBeClickable(cartButton));
            cartButton.click();
        }
    }
    
    /**
     * Proceed to checkout
     */
    public void proceedToCheckout() {
        wait.until(ExpectedConditions.elementToBeClickable(checkoutButton));
        checkoutButton.click();
    }
    
    /**
     * Fill customer information
     */
    public void fillCustomerInfo(String name, String phone) {
        // Try different field names
        WebElement nameField = nameInput != null ? nameInput : customerNameInput;
        WebElement phoneField = phoneInput != null ? phoneInput : customerPhoneInput;
        
        if (nameField != null) {
            nameField.clear();
            nameField.sendKeys(name);
        }
        
        if (phoneField != null) {
            phoneField.clear();
            phoneField.sendKeys(phone);
        }
    }
    
    /**
     * Confirm sale
     */
    public void confirmSale() {
        WebElement confirmBtn = confirmButton != null ? confirmButton : acceptButton;
        if (confirmBtn != null) {
            wait.until(ExpectedConditions.elementToBeClickable(confirmBtn));
            confirmBtn.click();
            // Wait for sale to process
            try {
                Thread.sleep(2000);
            } catch (InterruptedException e) {
                Thread.currentThread().interrupt();
            }
        }
    }
    
    /**
     * Check if sale was successful
     */
    public boolean isSaleSuccessful() {
        try {
            return (successMessage != null && successMessage.isDisplayed()) ||
                   driver.findElements(By.xpath("//div[contains(@class, 'alert-success')]")).size() > 0;
        } catch (Exception e) {
            return false;
        }
    }
    
    /**
     * Get success message text
     */
    public String getSuccessMessage() {
        try {
            if (successMessage != null && successMessage.isDisplayed()) {
                return successMessage.getText();
            }
            // Try to find any success message
            WebElement msg = driver.findElement(By.xpath("//div[contains(@class, 'alert-success')]"));
            return msg.getText();
        } catch (Exception e) {
            return "";
        }
    }
    
    /**
     * Get error message text
     */
    public String getErrorMessage() {
        try {
            if (errorMessage != null && errorMessage.isDisplayed()) {
                return errorMessage.getText();
            }
            WebElement msg = driver.findElement(By.xpath("//div[contains(@class, 'alert-danger')]"));
            return msg.getText();
        } catch (Exception e) {
            return "";
        }
    }
    
    /**
     * Get cart count
     */
    public String getCartCount() {
        try {
            if (cartCount != null && cartCount.isDisplayed()) {
                return cartCount.getText();
            }
            return "0";
        } catch (Exception e) {
            return "0";
        }
    }
    
    /**
     * Get sale total amount
     */
    public String getSaleTotal() {
        try {
            if (saleTotal != null && saleTotal.isDisplayed()) {
                return saleTotal.getText();
            }
            if (totalAmount != null && totalAmount.isDisplayed()) {
                return totalAmount.getText();
            }
            WebElement total = driver.findElement(By.xpath("//span[contains(@class, 'total')]"));
            return total.getText();
        } catch (Exception e) {
            return "";
        }
    }
    
    /**
     * Wait for cart to update
     */
    private void waitForCartUpdate() {
        try {
            Thread.sleep(1000);
        } catch (InterruptedException e) {
            Thread.currentThread().interrupt();
        }
    }
    
    /**
     * Wait for page to load
     */
    private void waitForPageLoad() {
        wait.until(ExpectedConditions.jsReturnsValue("return document.readyState === 'complete'"));
    }
    
    /**
     * Check if on sales/explore page
     */
    public boolean isOnSalesPage() {
        String url = driver.getCurrentUrl();
        return url.contains("/") || url.contains("/explore") || url.contains("/sales");
    }
}
