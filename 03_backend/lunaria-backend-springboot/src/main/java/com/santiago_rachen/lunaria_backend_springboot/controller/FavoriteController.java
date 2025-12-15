package com.santiago_rachen.lunaria_backend_springboot.controller;

import com.santiago_rachen.lunaria_backend_springboot.io.FavoriteResponse;
import com.santiago_rachen.lunaria_backend_springboot.repository.UserRepository;
import com.santiago_rachen.lunaria_backend_springboot.service.FavoriteService;
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
public class FavoriteController {

    private final FavoriteService favoriteService;
    private final UserRepository userRepository;

    @PostMapping("/{itemId}")
    @ResponseStatus(HttpStatus.CREATED)
    public FavoriteResponse addToFavorites(@PathVariable Long itemId, Authentication authentication) {
        Long userId = getUserIdFromAuthentication(authentication);
        return favoriteService.addToFavorites(userId, itemId);
    }

    @DeleteMapping("/{itemId}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void removeFromFavorites(@PathVariable Long itemId, Authentication authentication) {
        Long userId = getUserIdFromAuthentication(authentication);
        favoriteService.removeFromFavorites(userId, itemId);
    }

    @GetMapping
    public List<FavoriteResponse> getUserFavorites(Authentication authentication) {
        Long userId = getUserIdFromAuthentication(authentication);
        return favoriteService.getUserFavorites(userId);
    }

    @GetMapping("/{itemId}/status")
    public ResponseEntity<Map<String, Boolean>> checkFavoriteStatus(@PathVariable Long itemId, Authentication authentication) {
        Long userId = getUserIdFromAuthentication(authentication);
        boolean isFavorite = favoriteService.isFavorite(userId, itemId);
        return ResponseEntity.ok(Map.of("isFavorite", isFavorite));
    }

    private Long getUserIdFromAuthentication(Authentication authentication) {
        // authentication.getName() returns the email
        String email = authentication.getName();
        return userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("Usuario no encontrado"))
                .getId();
    }
}