package com.santiago_rachen.lunaria_backend_springboot.repository;

import com.santiago_rachen.lunaria_backend_springboot.entity.SaleItemEntity;
import org.springframework.data.jpa.repository.JpaRepository;

public interface SaleItemEntityRepository extends JpaRepository<SaleItemEntity, Long> {
}
