package com.santiago_rachen.lunaria_backend_springboot.service;

import com.santiago_rachen.lunaria_backend_springboot.io.SaleRequest;
import com.santiago_rachen.lunaria_backend_springboot.io.SaleResponse;
import com.santiago_rachen.lunaria_backend_springboot.io.PaymentVerificationRequest;

import java.time.LocalDate;
import java.util.List;

public interface SaleService {

    SaleResponse createSale(SaleRequest request);

    void deleteSale(String saleId);

    List<SaleResponse> getLatestSales();

    SaleResponse verifyPayment(PaymentVerificationRequest request);

    Double sumSalesByDate(LocalDate date);

    Long countBySaleDate(LocalDate date);

    List<SaleResponse> findRecentSales();
}
