package com.santiago_rachen.lunaria_backend_springboot.service.impl;

import com.santiago_rachen.lunaria_backend_springboot.entity.SaleEntity;
import com.santiago_rachen.lunaria_backend_springboot.entity.SaleItemEntity;
import com.santiago_rachen.lunaria_backend_springboot.io.*;
import com.santiago_rachen.lunaria_backend_springboot.repository.ItemRepository;
import com.santiago_rachen.lunaria_backend_springboot.repository.SaleEntityRepository;
import com.santiago_rachen.lunaria_backend_springboot.service.SaleService;
import com.santiago_rachen.lunaria_backend_springboot.service.StockService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class SaleServiceImpl implements SaleService {

    private final SaleEntityRepository saleEntityRepository;
    private final ItemRepository itemRepository;
    private final StockService stockService;

    @Override
    public SaleResponse createSale(SaleRequest request) {
        // Check stock availability
        for (SaleRequest.SaleItemRequest item : request.getCartItems()) {
            var itemEntity = itemRepository.findByItemId(item.getItemId())
                    .orElseThrow(() -> new RuntimeException("Item not found: " + item.getItemId()));
            if (!stockService.hasEnoughStock(itemEntity.getId(), item.getQuantity())) {
                throw new RuntimeException("Insufficient stock for item: " + item.getName());
            }
        }

        SaleEntity newSale = convertToSaleEntity(request);

        List<SaleItemEntity> saleItems = request.getCartItems().stream()
                .map(this::convertToSaleItemEntity)
                .collect(Collectors.toList());
        newSale.setItems(saleItems);

        newSale = saleEntityRepository.save(newSale);

        // Reduce stock after successful sale creation
        for (SaleRequest.SaleItemRequest item : request.getCartItems()) {
            var itemEntity = itemRepository.findByItemId(item.getItemId())
                    .orElseThrow(() -> new RuntimeException("Item not found: " + item.getItemId()));
            stockService.reduceStock(itemEntity.getId(), item.getQuantity(),
                    "SALE", newSale.getId(), "System");
        }

        return convertToResponse(newSale);
    }

    private SaleItemEntity convertToSaleItemEntity(SaleRequest.SaleItemRequest saleItemRequest) {
        return SaleItemEntity.builder()
                .itemId(saleItemRequest.getItemId())
                .name(saleItemRequest.getName())
                .price(saleItemRequest.getPrice())
                .quantity(saleItemRequest.getQuantity())
                .build();
    }

    private SaleResponse convertToResponse(SaleEntity newSale) {
        return SaleResponse.builder()
                .saleId(newSale.getSaleId())
                .customerName(newSale.getCustomerName())
                .phoneNumber(newSale.getPhoneNumber())
                .subtotal(newSale.getSubtotal())
                .grandTotal(newSale.getGrandTotal())
                .paymentMethod(newSale.getPaymentMethod())
                .items(newSale.getItems().stream()
                        .map(this::convertToItemResponse)
                        .collect(Collectors.toList()))
                .createdAt(newSale.getCreatedAt())
                .build();

    }

    private SaleResponse.SaleItemResponse convertToItemResponse(SaleItemEntity saleItemEntity) {
        return SaleResponse.SaleItemResponse.builder()
                .itemId(saleItemEntity.getItemId())
                .name(saleItemEntity.getName())
                .price(saleItemEntity.getPrice())
                .quantity(saleItemEntity.getQuantity())
                .build();

    }

    private SaleEntity convertToSaleEntity(SaleRequest request) {
        return SaleEntity.builder()
                .customerName(request.getCustomerName())
                .phoneNumber(request.getPhoneNumber())
                .subtotal(request.getSubtotal())
                .grandTotal(request.getGrandTotal())
                .paymentMethod(PaymentMethod.valueOf(request.getPaymentMethod()))
                .build();
    }

    @Override
    public void deleteSale(String saleId) {
        SaleEntity existingSale = saleEntityRepository.findBySaleId(saleId)
                .orElseThrow(() -> new RuntimeException("Sale not found"));
        saleEntityRepository.delete(existingSale);
    }

    @Override
    public List<SaleResponse> getLatestSales() {
        return saleEntityRepository.findAllByOrderByCreatedAtDesc()
                .stream()
                .map(this::convertToResponse)
                .collect(Collectors.toList());
    }


    @Override
    public Double sumSalesByDate(LocalDate date) {
        return saleEntityRepository.sumSalesByDate(date);
    }

    @Override
    public Long countBySaleDate(LocalDate date) {
        return saleEntityRepository.countBySaleDate(date);
    }

    @Override
    public List<SaleResponse> findRecentSales() {
        return saleEntityRepository.findRecentSales(PageRequest.of(0, 5))
                .stream()
                .map(saleEntity -> convertToResponse(saleEntity))
                .collect(Collectors.toList());
    }

}
