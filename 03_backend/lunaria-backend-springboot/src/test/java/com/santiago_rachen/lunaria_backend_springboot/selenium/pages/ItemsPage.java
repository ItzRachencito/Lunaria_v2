package com.santiago_rachen.lunaria_backend_springboot.selenium.pages;

import org.openqa.selenium.By;
import org.openqa.selenium.NoSuchElementException;
import org.openqa.selenium.WebDriver;
import org.openqa.selenium.WebElement;
import org.openqa.selenium.support.FindBy;
import org.openqa.selenium.support.PageFactory;
import org.openqa.selenium.support.ui.ExpectedConditions;
import org.openqa.selenium.support.ui.Select;
import org.openqa.selenium.support.ui.WebDriverWait;

import java.util.List;

/**
 * Page Object for Items Management page
 * Encapsulates items CRUD operations
 */
public class ItemsPage {
    
    private WebDriver driver;
    private WebDriverWait wait;
    
    // Add Item button and form
    @FindBy(xpath = "//button[contains(text(), 'Agregar') or contains(text(), 'Add')]")
    private WebElement addItemButton;
    
    @FindBy(xpath = "//button[contains(text(), 'Nuevo') or contains(text(), 'New')]")
    private WebElement newItemButton;
    
    @FindBy(id = "name")
    private WebElement itemNameInput;
    
    @FindBy(id = "description")
    private WebElement itemDescriptionInput;
    
    @FindBy(id = "price")
    private WebElement itemPriceInput;
    
    @FindBy(id = "stock")
    private WebElement itemStockInput;
    
    @FindBy(id = "stockQuantity")
    private WebElement itemStockQuantityInput;
    
    @FindBy(id = "category")
    private WebElement itemCategorySelect;
    
    @FindBy(id = "categoryId")
    private WebElement itemCategoryIdSelect;
    
    @FindBy(id = "brand")
    private WebElement itemBrandSelect;
    
    @FindBy(xpath = "//button[contains(text(), 'Guardar') or contains(text(), 'Save')]")
    private WebElement saveButton;
    
    @FindBy(xpath = "//button[contains(text(), 'Cancelar') or contains(text(), 'Cancel')]")
    private WebElement cancelButton;
    
    // Table elements
    @FindBy(className = "items-table")
    private WebElement itemsTable;
    
    @FindBy(xpath = "//table")
    private WebElement table;
    
    @FindBy(xpath = "//table//tr")
    private List<WebElement> tableRows;
    
    @FindBy(xpath = "//table//td")
    private List<WebElement> tableCells;
    
    // Search
    @FindBy(id = "search")
    private WebElement searchInput;
    
    @FindBy(xpath = "//input[@placeholder='Buscar' or @placeholder='Search']")
    private WebElement searchPlaceholder;
    
    // Action buttons
    @FindBy(xpath = "//button[contains(@class, 'edit') or contains(@class, 'btn-primary')]")
    private List<WebElement> editButtons;
    
    @FindBy(xpath = "//button[contains(@class, 'delete') or contains(@class, 'btn-danger')]")
    private List<WebElement> deleteButtons;
    
    public ItemsPage(WebDriver driver) {
        this.driver = driver;
        this.wait = new WebDriverWait(driver, java.time.Duration.ofSeconds(10));
        PageFactory.initElements(driver, this);
    }
    
    /**
     * Navigate to items page
     */
    public void navigateTo() {
        driver.get("http://localhost:5173/admin/items");
        waitForPageLoad();
    }
    
    /**
     * Navigate to custom URL
     */
    public void navigateTo(String url) {
        driver.get(url);
        waitForPageLoad();
    }
    
    /**
     * Click add item button
     */
    public void clickAddItem() {
        wait.until(ExpectedConditions.elementToBeClickable(addItemButton));
        addItemButton.click();
        waitForFormLoad();
    }
    
    /**
     * Click new item button (alternative)
     */
    public void clickNewItem() {
        wait.until(ExpectedConditions.elementToBeClickable(newItemButton));
        newItemButton.click();
        waitForFormLoad();
    }
    
    /**
     * Fill item form
     */
    public void fillItemForm(String name, String description, String price, String stock, String category) {
        // Enter basic fields
        if (itemNameInput != null) {
            itemNameInput.clear();
            itemNameInput.sendKeys(name);
        }
        
        if (itemDescriptionInput != null) {
            itemDescriptionInput.clear();
            itemDescriptionInput.sendKeys(description);
        }
        
        // Enter price (try different fields)
        if (itemPriceInput != null) {
            itemPriceInput.clear();
            itemPriceInput.sendKeys(price);
        }
        
        // Enter stock (try different fields)
        if (itemStockInput != null) {
            itemStockInput.clear();
            itemStockInput.sendKeys(stock);
        } else if (itemStockQuantityInput != null) {
            itemStockQuantityInput.clear();
            itemStockQuantityInput.sendKeys(stock);
        }
        
        // Select category
        if (itemCategorySelect != null && category != null) {
            Select categorySelect = new Select(itemCategorySelect);
            try {
                categorySelect.selectByVisibleText(category);
            } catch (Exception e) {
                try {
                    categorySelect.selectByValue(category);
                } catch (Exception e2) {
                    // Category selection failed, continue anyway
                }
            }
        }
    }
    
    /**
     * Save item
     */
    public void saveItem() {
        wait.until(ExpectedConditions.elementToBeClickable(saveButton));
        saveButton.click();
        // Wait for success message or page to reload
        try {
            Thread.sleep(1000);
        } catch (InterruptedException e) {
            Thread.currentThread().interrupt();
        }
    }
    
    /**
     * Cancel form
     */
    public void cancelForm() {
        if (cancelButton != null) {
            wait.until(ExpectedConditions.elementToBeClickable(cancelButton));
            cancelButton.click();
        }
    }
    
    /**
     * Check if item exists in table
     */
    public boolean isItemInTable(String itemName) {
        try {
            driver.findElement(By.xpath("//table//td[contains(text(), '" + itemName + "')]"));
            return true;
        } catch (NoSuchElementException e) {
            return false;
        }
    }
    
    /**
     * Find item row in table
     */
    private WebElement findItemRow(String itemName) {
        try {
            return driver.findElement(By.xpath("//table//tr[td[contains(text(), '" + itemName + "')]]"));
        } catch (NoSuchElementException e) {
            return null;
        }
    }
    
    /**
     * Delete item by name
     */
    public void deleteItem(String itemName) {
        WebElement row = findItemRow(itemName);
        if (row != null) {
            try {
                WebElement deleteButton = row.findElement(By.xpath(".//button[contains(@class, 'delete') or contains(@class, 'btn-danger')]"));
                wait.until(ExpectedConditions.elementToBeClickable(deleteButton));
                deleteButton.click();
                
                // Wait for confirmation dialog and accept
                try {
                    Thread.sleep(500);
                    driver.switchTo().alert().accept();
                } catch (Exception e) {
                    // No alert, continue
                }
                
                // Wait for page to update
                Thread.sleep(1000);
            } catch (Exception e) {
                // Delete button not found
            }
        }
    }
    
    /**
     * Edit item by name
     */
    public void editItem(String itemName) {
        WebElement row = findItemRow(itemName);
        if (row != null) {
            try {
                WebElement editButton = row.findElement(By.xpath(".//button[contains(@class, 'edit') or contains(@class, 'btn-primary')]"));
                wait.until(ExpectedConditions.elementToBeClickable(editButton));
                editButton.click();
                waitForFormLoad();
            } catch (Exception e) {
                // Edit button not found
            }
        }
    }
    
    /**
     * Get items count in table
     */
    public int getItemsCount() {
        try {
            if (tableRows != null && tableRows.size() > 0) {
                return tableRows.size() - 1; // Subtract header row
            }
            return 0;
        } catch (Exception e) {
            return 0;
        }
    }
    
    /**
     * Search for item
     */
    public void searchItem(String searchTerm) {
        if (searchInput != null) {
            searchInput.clear();
            searchInput.sendKeys(searchTerm);
        } else if (searchPlaceholder != null) {
            searchPlaceholder.clear();
            searchPlaceholder.sendKeys(searchTerm);
        }
        
        // Wait for results
        try {
            Thread.sleep(1000);
        } catch (InterruptedException e) {
            Thread.currentThread().interrupt();
        }
    }
    
    /**
     * Wait for form to load
     */
    private void waitForFormLoad() {
        try {
            Thread.sleep(500);
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
     * Check if table is displayed
     */
    public boolean isTableDisplayed() {
        try {
            return (itemsTable != null && itemsTable.isDisplayed()) ||
                   (table != null && table.isDisplayed());
        } catch (Exception e) {
            return false;
        }
    }
    
    /**
     * Check if we are on login page (not logged in)
     */
    public boolean isOnLoginPage() {
        String currentUrl = driver.getCurrentUrl();
        return currentUrl.contains("/login") || currentUrl.contains("/register");
    }
}
