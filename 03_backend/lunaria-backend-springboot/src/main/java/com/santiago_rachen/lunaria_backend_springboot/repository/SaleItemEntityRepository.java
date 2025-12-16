package com.santiago_rachen.lunaria_backend_springboot.repository;

import com.santiago_rachen.lunaria_backend_springboot.entity.SaleItemEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

public interface SaleItemEntityRepository extends JpaRepository<SaleItemEntity, Long> {

    @Query("SELECT COUNT(s) FROM SaleItemEntity s WHERE s.itemId = :itemId")
    long countByItemId(@Param("itemId") String itemId);
}
