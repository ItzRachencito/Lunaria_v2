package com.santiago_rachen.lunaria_backend_springboot.controller;

import com.santiago_rachen.lunaria_backend_springboot.io.StockMovementResponse;
import com.santiago_rachen.lunaria_backend_springboot.service.StockService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/stock")
@RequiredArgsConstructor
public class StockController {

    private final StockService stockService;

    @PostMapping("/increase/{itemId}")
    public ResponseEntity<String> increaseStock(@PathVariable Long itemId,
                                                @RequestParam Integer quantity,
                                                @RequestParam String reason,
                                                @RequestParam String userName) {
        stockService.increaseStock(itemId, quantity, reason, userName);
        return ResponseEntity.ok("Stock increased successfully");
    }

    @PostMapping("/adjust/{itemId}")
    public ResponseEntity<String> adjustStock(@PathVariable Long itemId,
                                              @RequestParam Integer newStock,
                                              @RequestParam String reason,
                                              @RequestParam String userName) {
        stockService.adjustStock(itemId, newStock, reason, userName);
        return ResponseEntity.ok("Stock adjusted successfully");
    }

    @GetMapping("/movements/{itemId}")
    public ResponseEntity<List<StockMovementResponse>> getProductMovements(@PathVariable Long itemId) {
        List<StockMovementResponse> movements = stockService.getProductMovements(itemId);
        return ResponseEntity.ok(movements);
    }

    @GetMapping("/dashboard")
    public ResponseEntity<Map<String, Object>> getStockDashboard() {
        Map<String, Object> dashboard = stockService.getStockDashboard();
        return ResponseEntity.ok(dashboard);
    }

    @GetMapping("/low-stock")
    public ResponseEntity<List<?>> getLowStockProducts() {
        List<?> products = stockService.getLowStockProducts();
        return ResponseEntity.ok(products);
    }

    @GetMapping("/out-of-stock")
    public ResponseEntity<List<?>> getOutOfStockProducts() {
        List<?> products = stockService.getOutOfStockProducts();
        return ResponseEntity.ok(products);
    }
}
