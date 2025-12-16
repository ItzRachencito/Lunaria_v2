package com.santiago_rachen.lunaria_backend_springboot.controller;

import com.santiago_rachen.lunaria_backend_springboot.io.StockMovementResponse;
import com.santiago_rachen.lunaria_backend_springboot.service.StockService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/stock")
@RequiredArgsConstructor
@Tag(name = "Stock Management", description = "API for managing inventory stock levels and movements")
public class StockController {

    private final StockService stockService;

    @Operation(summary = "Increase stock", description = "Increases the stock quantity for a specific item. Requires authentication.")
    @ApiResponses(value = {
        @ApiResponse(responseCode = "200", description = "Stock increased successfully"),
        @ApiResponse(responseCode = "401", description = "Unauthorized - Invalid or missing JWT token"),
        @ApiResponse(responseCode = "404", description = "Item not found")
    })
    @SecurityRequirement(name = "bearerAuth")
    @PostMapping("/increase/{itemId}")
    public ResponseEntity<String> increaseStock(@Parameter(description = "ID of the item") @PathVariable Long itemId,
                                                @Parameter(description = "Quantity to increase") @RequestParam Integer quantity,
                                                @Parameter(description = "Reason for the increase") @RequestParam String reason,
                                                @Parameter(description = "Username performing the action") @RequestParam String userName) {
        stockService.increaseStock(itemId, quantity, reason, userName);
        return ResponseEntity.ok("Stock increased successfully");
    }

    @Operation(summary = "Adjust stock", description = "Sets the stock to a new absolute quantity for a specific item. Requires authentication.")
    @ApiResponses(value = {
        @ApiResponse(responseCode = "200", description = "Stock adjusted successfully"),
        @ApiResponse(responseCode = "401", description = "Unauthorized - Invalid or missing JWT token"),
        @ApiResponse(responseCode = "404", description = "Item not found")
    })
    @SecurityRequirement(name = "bearerAuth")
    @PostMapping("/adjust/{itemId}")
    public ResponseEntity<String> adjustStock(@Parameter(description = "ID of the item") @PathVariable Long itemId,
                                              @Parameter(description = "New stock quantity") @RequestParam Integer newStock,
                                              @Parameter(description = "Reason for the adjustment") @RequestParam String reason,
                                              @Parameter(description = "Username performing the action") @RequestParam String userName) {
        stockService.adjustStock(itemId, newStock, reason, userName);
        return ResponseEntity.ok("Stock adjusted successfully");
    }

    @Operation(summary = "Get stock movements", description = "Retrieves the stock movement history for a specific item. Requires authentication.")
    @ApiResponses(value = {
        @ApiResponse(responseCode = "200", description = "Stock movements retrieved successfully"),
        @ApiResponse(responseCode = "401", description = "Unauthorized - Invalid or missing JWT token"),
        @ApiResponse(responseCode = "404", description = "Item not found")
    })
    @SecurityRequirement(name = "bearerAuth")
    @GetMapping("/movements/{itemId}")
    public ResponseEntity<List<StockMovementResponse>> getProductMovements(@Parameter(description = "ID of the item") @PathVariable Long itemId) {
        List<StockMovementResponse> movements = stockService.getProductMovements(itemId);
        return ResponseEntity.ok(movements);
    }

    @Operation(summary = "Get stock dashboard", description = "Retrieves overall stock statistics and dashboard data. Requires authentication.")
    @ApiResponses(value = {
        @ApiResponse(responseCode = "200", description = "Stock dashboard data retrieved successfully"),
        @ApiResponse(responseCode = "401", description = "Unauthorized - Invalid or missing JWT token")
    })
    @SecurityRequirement(name = "bearerAuth")
    @GetMapping("/dashboard")
    public ResponseEntity<Map<String, Object>> getStockDashboard() {
        Map<String, Object> dashboard = stockService.getStockDashboard();
        return ResponseEntity.ok(dashboard);
    }

    @Operation(summary = "Get low stock products", description = "Retrieves products with low stock levels. Requires authentication.")
    @ApiResponses(value = {
        @ApiResponse(responseCode = "200", description = "Low stock products retrieved successfully"),
        @ApiResponse(responseCode = "401", description = "Unauthorized - Invalid or missing JWT token")
    })
    @SecurityRequirement(name = "bearerAuth")
    @GetMapping("/low-stock")
    public ResponseEntity<List<?>> getLowStockProducts() {
        List<?> products = stockService.getLowStockProducts();
        return ResponseEntity.ok(products);
    }

    @Operation(summary = "Get out of stock products", description = "Retrieves products that are completely out of stock. Requires authentication.")
    @ApiResponses(value = {
        @ApiResponse(responseCode = "200", description = "Out of stock products retrieved successfully"),
        @ApiResponse(responseCode = "401", description = "Unauthorized - Invalid or missing JWT token")
    })
    @SecurityRequirement(name = "bearerAuth")
    @GetMapping("/out-of-stock")
    public ResponseEntity<List<?>> getOutOfStockProducts() {
        List<?> products = stockService.getOutOfStockProducts();
        return ResponseEntity.ok(products);
    }
}
