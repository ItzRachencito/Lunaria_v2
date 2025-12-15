package com.santiago_rachen.lunaria_backend_springboot.service;

import com.santiago_rachen.lunaria_backend_springboot.io.FavoriteResponse;

import java.util.List;

public interface FavoriteService {

    FavoriteResponse addToFavorites(Long userId, Long itemId);

    void removeFromFavorites(Long userId, Long itemId);

    List<FavoriteResponse> getUserFavorites(Long userId);

    boolean isFavorite(Long userId, Long itemId);
}