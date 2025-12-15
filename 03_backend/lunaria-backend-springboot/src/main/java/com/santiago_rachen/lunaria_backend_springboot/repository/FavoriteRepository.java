package com.santiago_rachen.lunaria_backend_springboot.repository;

import com.santiago_rachen.lunaria_backend_springboot.entity.FavoriteEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.Optional;

public interface FavoriteRepository extends JpaRepository<FavoriteEntity, Long> {

    List<FavoriteEntity> findByUserId(Long userId);

    Optional<FavoriteEntity> findByUserIdAndItemId(Long userId, Long itemId);

    boolean existsByUserIdAndItemId(Long userId, Long itemId);

    void deleteByUserIdAndItemId(Long userId, Long itemId);

    @Query("SELECT f FROM FavoriteEntity f WHERE f.user.id = :userId ORDER BY f.createdAt DESC")
    List<FavoriteEntity> findByUserIdOrderByCreatedAtDesc(@Param("userId") Long userId);
}