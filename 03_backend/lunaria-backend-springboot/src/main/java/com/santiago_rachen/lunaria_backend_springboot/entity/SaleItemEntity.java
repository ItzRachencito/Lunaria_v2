package com.santiago_rachen.lunaria_backend_springboot.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.context.annotation.Configuration;

@Entity
@Table(name = "tbl_sale_items")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class SaleItemEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private String itemId;
    private String name;
    private Double price;
    private Integer quantity;
}
