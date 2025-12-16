package com.santiago_rachen.lunaria_backend_springboot.service.impl;

import com.santiago_rachen.lunaria_backend_springboot.config.AppConfig;
import com.santiago_rachen.lunaria_backend_springboot.entity.BrandEntity;
import com.santiago_rachen.lunaria_backend_springboot.entity.CategoryEntity;
import com.santiago_rachen.lunaria_backend_springboot.entity.ItemEntity;
import com.santiago_rachen.lunaria_backend_springboot.io.ItemRequest;
import com.santiago_rachen.lunaria_backend_springboot.io.ItemResponse;
import com.santiago_rachen.lunaria_backend_springboot.repository.BrandRepository;
import com.santiago_rachen.lunaria_backend_springboot.repository.CategoryRepository;
import com.santiago_rachen.lunaria_backend_springboot.repository.ItemRepository;
import com.santiago_rachen.lunaria_backend_springboot.repository.SaleItemEntityRepository;
import com.santiago_rachen.lunaria_backend_springboot.service.FileUploadService;
import com.santiago_rachen.lunaria_backend_springboot.service.ItemService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.util.StringUtils;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.server.ResponseStatusException;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class ItemServiceImpl implements ItemService {

    private final FileUploadService fileUploadService;
    private final CategoryRepository categoryRepository;
    private final BrandRepository brandRepository;
    private final ItemRepository itemRepository;
    private final SaleItemEntityRepository saleItemEntityRepository;
    private final AppConfig appConfig;

    @Override
    public ItemResponse add(ItemRequest request, MultipartFile file) throws IOException {
        String imgUrl = null;

        if (file != null && !file.isEmpty()) {
            //String imgUrl = fileUploadService.uploadFile(file);
            String fileName = UUID.randomUUID().toString()+"."+ StringUtils.getFilenameExtension(file.getOriginalFilename());
            Path uploadPath = Paths.get("uploads").toAbsolutePath().normalize();
            Files.createDirectories(uploadPath);
            Path targetLocation = uploadPath.resolve(fileName);
            Files.copy(file.getInputStream(), targetLocation, StandardCopyOption.REPLACE_EXISTING);
            imgUrl = appConfig.getServerUrl() + "/api/v1.0/uploads/"+fileName;
        } else {
            // Default image or placeholder
            imgUrl = "https://via.placeholder.com/300x300?text=No+Image";
        }
        ItemEntity newItem = convertToEntity(request);
        CategoryEntity existingCategory = categoryRepository.findByCategoryId(request.getCategoryId())
                .orElseThrow(() -> new RuntimeException("Category not found: "+request.getCategoryId()));
        newItem.setCategory(existingCategory);

        if (request.getBrandId() != null && !request.getBrandId().isEmpty()) {
            BrandEntity existingBrand = brandRepository.findByBrandId(request.getBrandId())
                    .orElseThrow(() -> new RuntimeException("Brand not found: "+request.getBrandId()));
            newItem.setBrand(existingBrand);
        }

        newItem.setImgUrl(imgUrl);
        newItem = itemRepository.save(newItem);
        return convertToResponse(newItem);
    }

    private ItemResponse convertToResponse(ItemEntity newItem) {
        // Check if item has any sales - if so, it cannot be deleted
        long salesCount = saleItemEntityRepository.countByItemId(newItem.getItemId());
        boolean canDelete = salesCount == 0;

        return ItemResponse.builder()
                .id(newItem.getId())
                .itemId(newItem.getItemId())
                .name(newItem.getName())
                .description(newItem.getDescription())
                .price(newItem.getPrice())
                .imgUrl(newItem.getImgUrl())
                .categoryName(newItem.getCategory().getName())
                .categoryId(newItem.getCategory().getCategoryId())
                .brandName(newItem.getBrand() != null ? newItem.getBrand().getName() : null)
                .brandId(newItem.getBrand() != null ? newItem.getBrand().getBrandId() : null)
                .createdAt(newItem.getCreatedAt())
                .updatedAt(newItem.getUpdatedAt())
                .stockQuantity(newItem.getStock())
                .stockStatus(newItem.getStockStatus())
                .canDelete(canDelete)
                .build();
    }

    private ItemEntity convertToEntity(ItemRequest request) {
        return ItemEntity.builder()
                .itemId(UUID.randomUUID().toString())
                .name(request.getName())
                .description(request.getDescription())
                .price(request.getPrice())
                .stockQuantity(request.getStockQuantity() != null ? request.getStockQuantity() : 0)
                .build();
    }

    @Override
    public List<ItemResponse> fetchItems() {
        return itemRepository.findAll()
                .stream()
                .map(itemEntity -> convertToResponse(itemEntity))
                .collect(Collectors.toList());
    }

    @Override
    public ItemResponse updateItem(String itemId, ItemRequest request) {
        ItemEntity existingItem = itemRepository.findByItemId(itemId)
                .orElseThrow(() -> new RuntimeException("Item not found: " + itemId));

        // Update fields
        if (request.getName() != null && !request.getName().trim().isEmpty()) {
            existingItem.setName(request.getName());
        }
        if (request.getPrice() != null) {
            existingItem.setPrice(request.getPrice());
        }
        if (request.getDescription() != null) {
            existingItem.setDescription(request.getDescription());
        }
        if (request.getStockQuantity() != null) {
            existingItem.setStockQuantity(request.getStockQuantity());
        }

        // Update category if provided
        if (request.getCategoryId() != null && !request.getCategoryId().trim().isEmpty()) {
            CategoryEntity existingCategory = categoryRepository.findByCategoryId(request.getCategoryId())
                    .orElseThrow(() -> new RuntimeException("Category not found: " + request.getCategoryId()));
            existingItem.setCategory(existingCategory);
        }

        // Update brand if provided
        if (request.getBrandId() != null) {
            if (request.getBrandId().trim().isEmpty()) {
                existingItem.setBrand(null); // Remove brand
            } else {
                BrandEntity existingBrand = brandRepository.findByBrandId(request.getBrandId())
                        .orElseThrow(() -> new RuntimeException("Brand not found: " + request.getBrandId()));
                existingItem.setBrand(existingBrand);
            }
        }

        existingItem = itemRepository.save(existingItem);
        return convertToResponse(existingItem);
    }

    @Override
    public void deleteItem(String itemId) {
        ItemEntity existingItem = itemRepository.findByItemId(itemId)
                .orElseThrow(() -> new RuntimeException("Item not found: "+itemId));

        // Check if item has any sales - prevent deletion if it does
        long salesCount = saleItemEntityRepository.countByItemId(itemId);
        if (salesCount > 0) {
            throw new RuntimeException("Cannot delete item: it has been sold " + salesCount + " time(s)");
        }

        //boolean isFileDelete = fileUploadService.deleteFile(existingItem.getImgUrl());
        String imgUrl = existingItem.getImgUrl();
        String fileName = imgUrl.substring(imgUrl.lastIndexOf("/")+1);
        Path uploadPath = Paths.get("uploads").toAbsolutePath().normalize();
        Path filePath = uploadPath.resolve(fileName);
        try {
            Files.deleteIfExists(filePath);
            itemRepository.delete(existingItem);
        } catch (IOException e) {
            e.printStackTrace();
            throw new ResponseStatusException(HttpStatus.INTERNAL_SERVER_ERROR, "Unable to delete the image");
        }
    }
}
