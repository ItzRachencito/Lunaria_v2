package com.santiago_rachen.lunaria_backend_springboot.repository;

import com.santiago_rachen.lunaria_backend_springboot.entity.OrderItemEntity;
import org.springframework.data.jpa.repository.JpaRepository;

public interface OrderItemEntityRepository extends JpaRepository<OrderItemEntity, Long> {
}
