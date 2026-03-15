package com.santiago_rachen.lunaria_backend_springboot.io;

import com.santiago_rachen.lunaria_backend_springboot.entity.StockStatus;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.sql.Timestamp;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class ItemResponse {
    private String itemId;
    private String name;
    private BigDecimal price;
    private BigDecimal purchasePrice;
    private BigDecimal installationPrice;
    private String categoryId;
    private String brandId;
    private String description;
    private Long id;
    private String categoryName;
    private String brandName;
    private String imgUrl;
    private Timestamp createdAt;
    private Timestamp updatedAt;
    private Integer stockQuantity;
    private StockStatus stockStatus;
    private Boolean canDelete;
}
