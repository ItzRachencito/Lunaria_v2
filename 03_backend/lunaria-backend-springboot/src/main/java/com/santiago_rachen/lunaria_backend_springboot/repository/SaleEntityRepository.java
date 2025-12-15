package com.santiago_rachen.lunaria_backend_springboot.repository;

import com.santiago_rachen.lunaria_backend_springboot.entity.SaleEntity;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

public interface SaleEntityRepository extends JpaRepository<SaleEntity, Long> {

    Optional<SaleEntity> findBySaleId(String saleId);

    List<SaleEntity> findAllByOrderByCreatedAtDesc();

    @Query("SELECT SUM(o.grandTotal) FROM SaleEntity o WHERE DATE(o.createdAt) = :date")
    Double sumSalesByDate(@Param("date") LocalDate date);

    @Query("SELECT COUNT(o) FROM SaleEntity o WHERE DATE(o.createdAt) = :date")
    Long countBySaleDate(@Param("date") LocalDate date);

    @Query("SELECT o FROM SaleEntity o ORDER BY o.createdAt DESC")
    List<SaleEntity> findRecentSales(Pageable pageable);

}
