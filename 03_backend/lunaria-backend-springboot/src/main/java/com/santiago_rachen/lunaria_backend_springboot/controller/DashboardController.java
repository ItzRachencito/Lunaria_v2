package com.santiago_rachen.lunaria_backend_springboot.controller;

import com.santiago_rachen.lunaria_backend_springboot.io.DashboardResponse;
import com.santiago_rachen.lunaria_backend_springboot.io.SaleResponse;
import com.santiago_rachen.lunaria_backend_springboot.service.SaleService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.time.LocalDate;
import java.util.List;

@RestController
@RequestMapping("/dashboard")
@RequiredArgsConstructor
public class DashboardController {

    private final SaleService saleService;

    @GetMapping
    public DashboardResponse getDashboardData() {
        LocalDate today = LocalDate.now();
        Double todaySale = saleService.sumSalesByDate(today);
        Long todaySaleCount = saleService.countBySaleDate(today);
        List<SaleResponse> recentSales = saleService.findRecentSales();
        return new DashboardResponse(
                todaySale != null ? todaySale : 0.0,
                todaySaleCount != null ? todaySaleCount : 0,
                recentSales
        );
    }
}