package com.santiago_rachen.lunaria_backend_springboot.io;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.List;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class SaleResponse {
    private String saleId;
    private String customerName;
    private String phoneNumber;
    private List<SaleResponse.SaleItemResponse> items;
    private Double subtotal;
    private Double grandTotal;
    private PaymentMethod paymentMethod;
    private LocalDateTime createdAt;

    @Data
    @AllArgsConstructor
    @NoArgsConstructor
    @Builder
    public static class SaleItemResponse {
        private String itemId;
        private String name;
        private Double price;
        private Integer quantity;
    }
}