package com.santiago_rachen.lunaria_backend_springboot.controller;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.santiago_rachen.lunaria_backend_springboot.io.CategoryRequest;
import com.santiago_rachen.lunaria_backend_springboot.io.CategoryResponse;
import com.santiago_rachen.lunaria_backend_springboot.service.CategoryService;
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
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.server.ResponseStatusException;

import java.io.IOException;
import java.util.List;

@RestController
@RequiredArgsConstructor
@Tag(name = "Categories", description = "API for managing product categories")
public class CategoryController {

    private final CategoryService categoryService;

    @Operation(summary = "Add a new category", description = "Creates a new category with image. Requires admin authentication.")
    @ApiResponses(value = {
        @ApiResponse(responseCode = "201", description = "Category created successfully"),
        @ApiResponse(responseCode = "400", description = "Invalid input data"),
        @ApiResponse(responseCode = "401", description = "Unauthorized - Invalid or missing JWT token")
    })
    @SecurityRequirement(name = "bearerAuth")
    @PostMapping("/admin/categories")
    @ResponseStatus(HttpStatus.CREATED)
    public CategoryResponse addCategory(@Parameter(description = "Category data in JSON format") @RequestPart("category") String categoryString,
                                        @Parameter(description = "Image file for the category") @RequestPart("file") MultipartFile file) {
        ObjectMapper objectMapper = new ObjectMapper();
        CategoryRequest request = null;
        try {
            request = objectMapper.readValue(categoryString, CategoryRequest.class);
            return categoryService.add(request, file);
        } catch(JsonProcessingException ex) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Exception occred while parsing the json: "+ex.getMessage());
        } catch (IOException e) {
            throw new RuntimeException(e);
        }

    }

    @Operation(summary = "Get all categories", description = "Retrieves a list of all available categories. No authentication required.")
    @ApiResponses(value = {
        @ApiResponse(responseCode = "200", description = "List of categories retrieved successfully")
    })
    @GetMapping("/categories")
    public List<CategoryResponse> fetchCategories() {
        return categoryService.read();
    }

    @Operation(summary = "Update a category", description = "Updates an existing category by ID. Requires admin authentication.")
    @ApiResponses(value = {
        @ApiResponse(responseCode = "200", description = "Category updated successfully"),
        @ApiResponse(responseCode = "400", description = "Invalid input data"),
        @ApiResponse(responseCode = "401", description = "Unauthorized - Invalid or missing JWT token"),
        @ApiResponse(responseCode = "404", description = "Category not found")
    })
    @SecurityRequirement(name = "bearerAuth")
    @PutMapping("/admin/categories/{categoryId}")
    public CategoryResponse updateCategory(@Parameter(description = "ID of the category to update") @PathVariable String categoryId, @RequestBody CategoryRequest request) {
        try {
            return categoryService.update(categoryId, request);
        } catch (Exception e) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, e.getMessage());
        }
    }

    @Operation(summary = "Delete a category", description = "Deletes a category by ID. Requires admin authentication.")
    @ApiResponses(value = {
        @ApiResponse(responseCode = "204", description = "Category deleted successfully"),
        @ApiResponse(responseCode = "401", description = "Unauthorized - Invalid or missing JWT token"),
        @ApiResponse(responseCode = "404", description = "Category not found")
    })
    @SecurityRequirement(name = "bearerAuth")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    @DeleteMapping("/admin/categories/{categoryId}")
    public void remove(@Parameter(description = "ID of the category to delete") @PathVariable String categoryId) {
        try {
            categoryService.delete(categoryId);
        }catch (Exception e) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, e.getMessage());
        }
    }
}
