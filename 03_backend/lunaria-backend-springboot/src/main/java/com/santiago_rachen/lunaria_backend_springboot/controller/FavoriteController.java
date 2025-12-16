package com.santiago_rachen.lunaria_backend_springboot.controller;

import com.santiago_rachen.lunaria_backend_springboot.entity.UserEntity;
import com.santiago_rachen.lunaria_backend_springboot.io.FavoriteResponse;
import com.santiago_rachen.lunaria_backend_springboot.repository.UserRepository;
import com.santiago_rachen.lunaria_backend_springboot.service.FavoriteService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/favorites")
@RequiredArgsConstructor
@Tag(name = "Favorites", description = "API for managing user favorites")
public class FavoriteController {

    private final FavoriteService favoriteService;
    private final UserRepository userRepository;

    @Operation(summary = "Add item to favorites", description = "Adds an item to the authenticated user's favorites list.")
    @ApiResponses(value = {
        @ApiResponse(responseCode = "201", description = "Item added to favorites successfully"),
        @ApiResponse(responseCode = "401", description = "Unauthorized - Invalid or missing JWT token"),
        @ApiResponse(responseCode = "404", description = "Item not found")
    })
    @SecurityRequirement(name = "bearerAuth")
    @PostMapping("/{itemId}")
    @ResponseStatus(HttpStatus.CREATED)
    public FavoriteResponse addToFavorites(@Parameter(description = "ID of the item to add to favorites") @PathVariable String itemId, Authentication authentication) {
        System.out.println("Adding to favorites - itemId: " + itemId + ", user: " + authentication.getName());
        Long userId = getUserIdFromAuthentication(authentication);
        System.out.println("User ID: " + userId);
        return favoriteService.addToFavoritesByItemId(userId, itemId);
    }

    @Operation(summary = "Remove item from favorites", description = "Removes an item from the authenticated user's favorites list.")
    @ApiResponses(value = {
        @ApiResponse(responseCode = "204", description = "Item removed from favorites successfully"),
        @ApiResponse(responseCode = "401", description = "Unauthorized - Invalid or missing JWT token"),
        @ApiResponse(responseCode = "404", description = "Item not found in favorites")
    })
    @SecurityRequirement(name = "bearerAuth")
    @DeleteMapping("/{itemId}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void removeFromFavorites(@Parameter(description = "ID of the item to remove from favorites") @PathVariable String itemId, Authentication authentication) {
        Long userId = getUserIdFromAuthentication(authentication);
        favoriteService.removeFromFavoritesByItemId(userId, itemId);
    }

    @Operation(summary = "Get user favorites", description = "Retrieves all favorite items for the authenticated user.")
    @ApiResponses(value = {
        @ApiResponse(responseCode = "200", description = "List of user's favorite items retrieved successfully"),
        @ApiResponse(responseCode = "401", description = "Unauthorized - Invalid or missing JWT token")
    })
    @SecurityRequirement(name = "bearerAuth")
    @GetMapping
    public List<FavoriteResponse> getUserFavorites(Authentication authentication) {
        Long userId = getUserIdFromAuthentication(authentication);
        return favoriteService.getUserFavorites(userId);
    }

    @Operation(summary = "Check favorite status", description = "Checks if a specific item is in the authenticated user's favorites.")
    @ApiResponses(value = {
        @ApiResponse(responseCode = "200", description = "Favorite status returned successfully"),
        @ApiResponse(responseCode = "401", description = "Unauthorized - Invalid or missing JWT token")
    })
    @SecurityRequirement(name = "bearerAuth")
    @GetMapping("/{itemId}/status")
    public ResponseEntity<Map<String, Boolean>> checkFavoriteStatus(@Parameter(description = "ID of the item to check") @PathVariable String itemId, Authentication authentication) {
        Long userId = getUserIdFromAuthentication(authentication);
        boolean isFavorite = favoriteService.isFavoriteByItemId(userId, itemId);
        return ResponseEntity.ok(Map.of("isFavorite", isFavorite));
    }

    private Long getUserIdFromAuthentication(Authentication authentication) {
        // authentication.getName() returns the email
        String email = authentication.getName();
        System.out.println("Getting user by email: " + email);
        UserEntity user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("Usuario no encontrado"));
        System.out.println("Found user ID: " + user.getId());
        return user.getId();
    }
}