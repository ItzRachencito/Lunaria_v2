package com.santiago_rachen.lunaria_backend_springboot.controller;

import com.santiago_rachen.lunaria_backend_springboot.io.SaleRequest;
import com.santiago_rachen.lunaria_backend_springboot.io.SaleResponse;
import com.santiago_rachen.lunaria_backend_springboot.service.SaleService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/sales")
@RequiredArgsConstructor
@Tag(name = "Sales", description = "API for managing sales and transactions")
public class SaleController {

    private final SaleService saleService;

    @Operation(summary = "Create a new sale", description = "Creates a new sale transaction. Requires admin authentication.")
    @ApiResponses(value = {
        @ApiResponse(responseCode = "201", description = "Sale created successfully"),
        @ApiResponse(responseCode = "400", description = "Invalid sale data"),
        @ApiResponse(responseCode = "401", description = "Unauthorized - Invalid or missing JWT token")
    })
    @SecurityRequirement(name = "bearerAuth")
    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    @PreAuthorize("hasRole('ADMIN')")
    public SaleResponse createSale(@RequestBody SaleRequest request) {
        return saleService.createSale(request);
    }

    @Operation(summary = "Delete a sale", description = "Deletes a sale by ID. Requires authentication.")
    @ApiResponses(value = {
        @ApiResponse(responseCode = "204", description = "Sale deleted successfully"),
        @ApiResponse(responseCode = "401", description = "Unauthorized - Invalid or missing JWT token"),
        @ApiResponse(responseCode = "404", description = "Sale not found")
    })
    @SecurityRequirement(name = "bearerAuth")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    @DeleteMapping("/{saleId}")
    public void deleteSale(@Parameter(description = "ID of the sale to delete") @PathVariable String saleId) {
        saleService.deleteSale(saleId);
    }

    @Operation(summary = "Get latest sales", description = "Retrieves a list of the most recent sales. Requires authentication.")
    @ApiResponses(value = {
        @ApiResponse(responseCode = "200", description = "List of latest sales retrieved successfully"),
        @ApiResponse(responseCode = "401", description = "Unauthorized - Invalid or missing JWT token")
    })
    @SecurityRequirement(name = "bearerAuth")
    @GetMapping("/latest")
    public List<SaleResponse> getLatestSales() {
        return saleService.getLatestSales();
    }
}
