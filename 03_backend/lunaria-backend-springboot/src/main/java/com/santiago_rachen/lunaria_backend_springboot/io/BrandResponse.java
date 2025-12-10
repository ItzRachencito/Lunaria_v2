package com.santiago_rachen.lunaria_backend_springboot.io;

import lombok.Builder;
import lombok.Data;

import java.sql.Timestamp;

@Data
@Builder
public class BrandResponse {
    private String brandId;
    private String name;
    private String description;
    private Timestamp createdAt;
    private Timestamp updatedAt;
    private Integer items;
}