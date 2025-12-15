package com.santiago_rachen.lunaria_backend_springboot.service.impl;

import com.santiago_rachen.lunaria_backend_springboot.entity.FavoriteEntity;
import com.santiago_rachen.lunaria_backend_springboot.entity.ItemEntity;
import com.santiago_rachen.lunaria_backend_springboot.entity.UserEntity;
import com.santiago_rachen.lunaria_backend_springboot.io.FavoriteResponse;
import com.santiago_rachen.lunaria_backend_springboot.repository.FavoriteRepository;
import com.santiago_rachen.lunaria_backend_springboot.repository.ItemRepository;
import com.santiago_rachen.lunaria_backend_springboot.repository.UserRepository;
import com.santiago_rachen.lunaria_backend_springboot.service.FavoriteService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class FavoriteServiceImpl implements FavoriteService {

    private final FavoriteRepository favoriteRepository;
    private final UserRepository userRepository;
    private final ItemRepository itemRepository;

    @Override
    public FavoriteResponse addToFavorites(Long userId, Long itemId) {
        UserEntity user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("Usuario no encontrado"));

        ItemEntity item = itemRepository.findById(itemId)
                .orElseThrow(() -> new RuntimeException("Producto no encontrado"));

        if (favoriteRepository.existsByUserIdAndItemId(userId, itemId)) {
            throw new RuntimeException("El producto ya está en favoritos");
        }

        FavoriteEntity favorite = FavoriteEntity.builder()
                .user(user)
                .item(item)
                .build();

        favorite = favoriteRepository.save(favorite);

        return convertToResponse(favorite);
    }

    @Override
    public void removeFromFavorites(Long userId, Long itemId) {
        if (!favoriteRepository.existsByUserIdAndItemId(userId, itemId)) {
            throw new RuntimeException("El producto no está en favoritos");
        }

        favoriteRepository.deleteByUserIdAndItemId(userId, itemId);
    }

    @Override
    public List<FavoriteResponse> getUserFavorites(Long userId) {
        return favoriteRepository.findByUserIdOrderByCreatedAtDesc(userId)
                .stream()
                .map(this::convertToResponse)
                .collect(Collectors.toList());
    }

    @Override
    public FavoriteResponse addToFavoritesByItemId(Long userId, String itemId) {
        ItemEntity item = itemRepository.findByItemId(itemId)
                .orElseThrow(() -> new RuntimeException("Producto no encontrado"));

        return addToFavorites(userId, item.getId());
    }

    @Override
    @Transactional
    public void removeFromFavoritesByItemId(Long userId, String itemId) {
        ItemEntity item = itemRepository.findByItemId(itemId)
                .orElseThrow(() -> new RuntimeException("Producto no encontrado"));

        removeFromFavorites(userId, item.getId());
    }

    @Override
    public boolean isFavorite(Long userId, Long itemId) {
        return favoriteRepository.existsByUserIdAndItemId(userId, itemId);
    }

    @Override
    public boolean isFavoriteByItemId(Long userId, String itemId) {
        ItemEntity item = itemRepository.findByItemId(itemId)
                .orElseThrow(() -> new RuntimeException("Producto no encontrado"));

        return isFavorite(userId, item.getId());
    }

    private FavoriteResponse convertToResponse(FavoriteEntity favorite) {
        return FavoriteResponse.builder()
                .id(favorite.getId())
                .itemId(favorite.getItem().getItemId())  // Use String UUID instead of Long ID
                .itemName(favorite.getItem().getName())
                .itemDescription(favorite.getItem().getDescription())
                .itemImgUrl(favorite.getItem().getImgUrl())
                .addedAt(favorite.getCreatedAt().toLocalDateTime())
                .build();
    }
}