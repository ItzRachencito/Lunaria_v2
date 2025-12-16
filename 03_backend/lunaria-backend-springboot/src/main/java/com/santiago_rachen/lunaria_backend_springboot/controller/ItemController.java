package com.santiago_rachen.lunaria_backend_springboot.controller;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.santiago_rachen.lunaria_backend_springboot.io.ItemRequest;
import com.santiago_rachen.lunaria_backend_springboot.io.ItemResponse;
import com.santiago_rachen.lunaria_backend_springboot.service.ItemService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.server.ResponseStatusException;

import java.io.IOException;
import java.util.List;

@RestController
@RequiredArgsConstructor
@Tag(name = "Items", description = "API for managing items in the e-commerce platform")
public class ItemController {

    private final ItemService itemService;

    @Operation(summary = "Add a new item", description = "Creates a new item in the catalog. Requires admin authentication. The item data is sent as JSON string and image as multipart file.")
    @ApiResponses(value = {
        @ApiResponse(responseCode = "201", description = "Item created successfully"),
        @ApiResponse(responseCode = "400", description = "Invalid input data"),
        @ApiResponse(responseCode = "401", description = "Unauthorized - Invalid or missing JWT token")
    })
    @SecurityRequirement(name = "bearerAuth")
    @ResponseStatus(HttpStatus.CREATED)
    @PostMapping("/admin/items")
    public ItemResponse addItem(@Parameter(description = "Item data in JSON format") @RequestPart("item") String itemString,
                                @Parameter(description = "Image file for the item") @RequestPart("file") MultipartFile file) {
        ObjectMapper objectMapper = new ObjectMapper();
        ItemRequest itemRequest = null;
        try {
            itemRequest = objectMapper.readValue(itemString, ItemRequest.class);
            return itemService.add(itemRequest, file);
        } catch (IOException ex) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Error occured while processing the json");
        }
    }

    @Operation(summary = "Get all items", description = "Retrieves a list of all available items in the catalog. No authentication required.")
    @ApiResponses(value = {
        @ApiResponse(responseCode = "200", description = "List of items retrieved successfully")
    })
    @GetMapping("/items")
    public List<ItemResponse> readItems() {
        return itemService.fetchItems();
    }

    @Operation(summary = "Update an item", description = "Updates an existing item by ID. Requires admin authentication.")
    @ApiResponses(value = {
        @ApiResponse(responseCode = "200", description = "Item updated successfully"),
        @ApiResponse(responseCode = "400", description = "Invalid input data"),
        @ApiResponse(responseCode = "401", description = "Unauthorized - Invalid or missing JWT token"),
        @ApiResponse(responseCode = "404", description = "Item not found")
    })
    @SecurityRequirement(name = "bearerAuth")
    @PutMapping("/admin/items/{itemId}")
    public ItemResponse updateItem(@Parameter(description = "ID of the item to update") @PathVariable String itemId, @RequestBody ItemRequest request) {
        try {
            return itemService.updateItem(itemId, request);
        } catch (Exception e) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, e.getMessage());
        }
    }

    @Operation(summary = "Delete an item", description = "Deletes an item by ID. Requires admin authentication.")
    @ApiResponses(value = {
        @ApiResponse(responseCode = "204", description = "Item deleted successfully"),
        @ApiResponse(responseCode = "401", description = "Unauthorized - Invalid or missing JWT token"),
        @ApiResponse(responseCode = "404", description = "Item not found")
    })
    @SecurityRequirement(name = "bearerAuth")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    @DeleteMapping("/admin/items/{itemId}")
    public void removeItem(@Parameter(description = "ID of the item to delete") @PathVariable String itemId) {
        try {
            itemService.deleteItem(itemId);
        } catch (Exception e) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Item not found");
        }
    }
}