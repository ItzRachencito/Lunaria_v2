package com.santiago_rachen.lunaria_backend_springboot.io;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class SaleRequest {

    private String customerName;
    private String phoneNumber;
    private List<SaleItemRequest> cartItems;
    private Double subtotal;
    private Double tax;
    private Double grandTotal;
    private String paymentMethod;

    @Data
    @AllArgsConstructor
    @NoArgsConstructor
    @Builder
    public static class SaleItemRequest {
        private String itemId;
        private String name;
        private Double price;
        private Integer quantity;
    }
}