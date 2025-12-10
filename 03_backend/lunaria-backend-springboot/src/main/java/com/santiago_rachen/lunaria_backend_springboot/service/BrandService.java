package com.santiago_rachen.lunaria_backend_springboot.service;

import com.santiago_rachen.lunaria_backend_springboot.io.BrandRequest;
import com.santiago_rachen.lunaria_backend_springboot.io.BrandResponse;

import java.util.List;

public interface BrandService {

    BrandResponse add(BrandRequest request);

    List<BrandResponse> read();

    BrandResponse update(String brandId, BrandRequest request);

    void delete(String brandId);
}