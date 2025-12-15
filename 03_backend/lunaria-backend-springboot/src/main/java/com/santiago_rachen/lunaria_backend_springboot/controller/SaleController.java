package com.santiago_rachen.lunaria_backend_springboot.controller;

import com.santiago_rachen.lunaria_backend_springboot.io.SaleRequest;
import com.santiago_rachen.lunaria_backend_springboot.io.SaleResponse;
import com.santiago_rachen.lunaria_backend_springboot.service.SaleService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/sales")
@RequiredArgsConstructor
public class SaleController {

    private final SaleService saleService;

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    @PreAuthorize("hasRole('ADMIN')")
    public SaleResponse createSale(@RequestBody SaleRequest request) {
        return saleService.createSale(request);
    }

    @ResponseStatus(HttpStatus.NO_CONTENT)
    @DeleteMapping("/{saleId}")
    public void deleteSale(@PathVariable String saleId) {
        saleService.deleteSale(saleId);
    }

    @GetMapping("/latest")
    public List<SaleResponse> getLatestSales() {
        return saleService.getLatestSales();
    }
}
