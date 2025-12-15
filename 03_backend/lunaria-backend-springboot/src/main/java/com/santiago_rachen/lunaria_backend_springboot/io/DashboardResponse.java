package com.santiago_rachen.lunaria_backend_springboot.io;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class DashboardResponse {

    private Double todaySales;
    private Long todaySaleCount;
    private List<SaleResponse> recentSales;
}