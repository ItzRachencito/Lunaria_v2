package com.santiago_rachen.lunaria_backend_springboot.service.impl;

import com.santiago_rachen.lunaria_backend_springboot.entity.BrandEntity;
import com.santiago_rachen.lunaria_backend_springboot.io.BrandRequest;
import com.santiago_rachen.lunaria_backend_springboot.io.BrandResponse;
import com.santiago_rachen.lunaria_backend_springboot.repository.BrandRepository;
import com.santiago_rachen.lunaria_backend_springboot.repository.ItemRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class BrandServiceImpl implements com.santiago_rachen.lunaria_backend_springboot.service.BrandService {

    private final BrandRepository brandRepository;
    private final ItemRepository itemRepository;

    @Override
    public BrandResponse add(BrandRequest request) {
        BrandEntity newBrand = convertToEntity(request);
        newBrand = brandRepository.save(newBrand);
        return convertToResponse(newBrand);
    }

    @Override
    public List<BrandResponse> read() {
        return brandRepository.findAll()
                .stream()
                .map(brandEntity -> convertToResponse(brandEntity))
                .collect(Collectors.toList());
    }

    @Override
    public BrandResponse update(String brandId, BrandRequest request) {
        BrandEntity existingBrand = brandRepository.findByBrandId(brandId)
                .orElseThrow(() -> new RuntimeException("Brand not found: " + brandId));

        // Update fields
        if (request.getName() != null && !request.getName().trim().isEmpty()) {
            existingBrand.setName(request.getName());
        }
        if (request.getDescription() != null) {
            existingBrand.setDescription(request.getDescription());
        }

        existingBrand = brandRepository.save(existingBrand);
        return convertToResponse(existingBrand);
    }

    @Override
    public void delete(String brandId) {
        BrandEntity existingBrand = brandRepository.findByBrandId(brandId)
                .orElseThrow(() -> new RuntimeException("Brand not found: "+brandId));
        brandRepository.delete(existingBrand);
    }

    private BrandResponse convertToResponse(BrandEntity brandEntity) {
        Integer itemsCount = itemRepository.countByBrandId(brandEntity.getId());
        return BrandResponse.builder()
                .brandId(brandEntity.getBrandId())
                .name(brandEntity.getName())
                .description(brandEntity.getDescription())
                .createdAt(brandEntity.getCreatedAt())
                .updatedAt(brandEntity.getUpdatedAt())
                .items(itemsCount)
                .build();
    }

    private BrandEntity convertToEntity(BrandRequest request) {
        return BrandEntity.builder()
                .brandId(UUID.randomUUID().toString())
                .name(request.getName())
                .description(request.getDescription())
                .build();
    }
}