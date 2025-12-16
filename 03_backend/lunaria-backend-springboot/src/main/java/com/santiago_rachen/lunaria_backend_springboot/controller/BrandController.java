package com.santiago_rachen.lunaria_backend_springboot.controller;

import com.santiago_rachen.lunaria_backend_springboot.io.BrandRequest;
import com.santiago_rachen.lunaria_backend_springboot.io.BrandResponse;
import com.santiago_rachen.lunaria_backend_springboot.service.BrandService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequiredArgsConstructor
@Tag(name = "Brands", description = "API for managing product brands")
public class BrandController {

    private final BrandService brandService;

    @Operation(summary = "Add a new brand", description = "Creates a new brand in the system. Requires admin authentication.")
    @ApiResponses(value = {
        @ApiResponse(responseCode = "201", description = "Brand created successfully"),
        @ApiResponse(responseCode = "400", description = "Invalid input data"),
        @ApiResponse(responseCode = "401", description = "Unauthorized - Invalid or missing JWT token")
    })
    @SecurityRequirement(name = "bearerAuth")
    @PostMapping("/admin/brands")
    @ResponseStatus(HttpStatus.CREATED)
    public BrandResponse addBrand(@RequestBody BrandRequest request) {
        return brandService.add(request);
    }

    @Operation(summary = "Get all brands", description = "Retrieves a list of all available brands. No authentication required.")
    @ApiResponses(value = {
        @ApiResponse(responseCode = "200", description = "List of brands retrieved successfully")
    })
    @GetMapping("/brands")
    public List<BrandResponse> fetchBrands() {
        return brandService.read();
    }

    @Operation(summary = "Update a brand", description = "Updates an existing brand by ID. Requires admin authentication.")
    @ApiResponses(value = {
        @ApiResponse(responseCode = "200", description = "Brand updated successfully"),
        @ApiResponse(responseCode = "400", description = "Invalid input data"),
        @ApiResponse(responseCode = "401", description = "Unauthorized - Invalid or missing JWT token"),
        @ApiResponse(responseCode = "404", description = "Brand not found")
    })
    @SecurityRequirement(name = "bearerAuth")
    @PutMapping("/admin/brands/{brandId}")
    public BrandResponse updateBrand(@Parameter(description = "ID of the brand to update") @PathVariable String brandId, @RequestBody BrandRequest request) {
        try {
            return brandService.update(brandId, request);
        } catch (Exception e) {
            throw new RuntimeException("Unable to update brand: " + e.getMessage());
        }
    }

    @Operation(summary = "Delete a brand", description = "Deletes a brand by ID. Requires admin authentication.")
    @ApiResponses(value = {
        @ApiResponse(responseCode = "204", description = "Brand deleted successfully"),
        @ApiResponse(responseCode = "401", description = "Unauthorized - Invalid or missing JWT token"),
        @ApiResponse(responseCode = "404", description = "Brand not found")
    })
    @SecurityRequirement(name = "bearerAuth")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    @DeleteMapping("/admin/brands/{brandId}")
    public void remove(@Parameter(description = "ID of the brand to delete") @PathVariable String brandId) {
        try {
            brandService.delete(brandId);
        }catch (Exception e) {
            throw new RuntimeException("Unable to delete brand: " + e.getMessage());
        }
    }
}