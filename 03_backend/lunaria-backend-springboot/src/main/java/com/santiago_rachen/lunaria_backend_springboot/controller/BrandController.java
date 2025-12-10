package com.santiago_rachen.lunaria_backend_springboot.controller;

import com.santiago_rachen.lunaria_backend_springboot.io.BrandRequest;
import com.santiago_rachen.lunaria_backend_springboot.io.BrandResponse;
import com.santiago_rachen.lunaria_backend_springboot.service.BrandService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequiredArgsConstructor
public class BrandController {

    private final BrandService brandService;

    @PostMapping("/admin/brands")
    @ResponseStatus(HttpStatus.CREATED)
    public BrandResponse addBrand(@RequestBody BrandRequest request) {
        return brandService.add(request);
    }

    @GetMapping("/brands")
    public List<BrandResponse> fetchBrands() {
        return brandService.read();
    }

    @ResponseStatus(HttpStatus.NO_CONTENT)
    @DeleteMapping("/admin/brands/{brandId}")
    public void remove(@PathVariable String brandId) {
        try {
            brandService.delete(brandId);
        }catch (Exception e) {
            throw new RuntimeException("Unable to delete brand: " + e.getMessage());
        }
    }
}