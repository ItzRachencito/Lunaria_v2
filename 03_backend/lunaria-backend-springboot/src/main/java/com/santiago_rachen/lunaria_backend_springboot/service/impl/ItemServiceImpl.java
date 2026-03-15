package com.santiago_rachen.lunaria_backend_springboot.service.impl;

import com.cloudinary.Cloudinary;
import com.cloudinary.utils.ObjectUtils;
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
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.server.ResponseStatusException;

import java.io.IOException;
import java.util.List;
import java.util.Map;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class ItemServiceImpl implements ItemService {

    private final Cloudinary cloudinary;
    private final CategoryRepository categoryRepository;
    private final BrandRepository brandRepository;
    private final ItemRepository itemRepository;
    private final SaleItemEntityRepository saleItemEntityRepository;

    @Override
    public ItemResponse add(ItemRequest request, MultipartFile file) throws IOException {
        String imgUrl = null;

        if (file != null && !file.isEmpty()) {
            try {
                // Upload to Cloudinary
                Map uploadResult = cloudinary.uploader().upload(file.getBytes(), 
                    ObjectUtils.asMap(
                        "public_id", "items/" + UUID.randomUUID().toString(),
                        "folder", "lunaria",
                        "resource_type", "image"
                    ));
                imgUrl = (String) uploadResult.get("secure_url");
            } catch (Exception e) {
                throw new ResponseStatusException(HttpStatus.INTERNAL_SERVER_ERROR, "Error uploading image: " + e.getMessage());
            }
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
        return convertToResponse(newItem, true); // Admin is adding the item
    }

    private ItemResponse convertToResponse(ItemEntity newItem, boolean isAdmin) {
        // Check if item has any sales - if so, it cannot be deleted
        long salesCount = saleItemEntityRepository.countByItemId(newItem.getItemId());
        boolean canDelete = salesCount == 0;

        return ItemResponse.builder()
                .id(newItem.getId())
                .itemId(newItem.getItemId())
                .name(newItem.getName())
                .description(newItem.getDescription())
                .price(newItem.getPrice())
                .purchasePrice(isAdmin ? newItem.getPurchasePrice() : null) // Only show to admin
                .installationPrice(newItem.getInstallationPrice())
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
                .purchasePrice(request.getPurchasePrice())
                .installationPrice(request.getInstallationPrice())
                .stockQuantity(request.getStockQuantity() != null ? request.getStockQuantity() : 0)
                .build();
    }

    @Override
    public List<ItemResponse> fetchItems(boolean isAdmin) {
        return itemRepository.findAll()
                .stream()
                .map(itemEntity -> convertToResponse(itemEntity, isAdmin))
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
        if (request.getPurchasePrice() != null) {
            existingItem.setPurchasePrice(request.getPurchasePrice());
        }
        if (request.getInstallationPrice() != null) {
            existingItem.setInstallationPrice(request.getInstallationPrice());
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
        return convertToResponse(existingItem, true); // Admin is updating the item
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

        // Delete from Cloudinary if it's not a placeholder
        String imgUrl = existingItem.getImgUrl();
        if (imgUrl != null && !imgUrl.contains("placeholder.com")) {
            try {
                // Extract public_id from Cloudinary URL
                String publicId = extractPublicIdFromUrl(imgUrl);
                if (publicId != null) {
                    cloudinary.uploader().destroy(publicId, ObjectUtils.emptyMap());
                }
            } catch (Exception e) {
                // Log error but continue with deletion
                e.printStackTrace();
            }
        }
        
        itemRepository.delete(existingItem);
    }
    
    private String extractPublicIdFromUrl(String url) {
        // Extract public_id from Cloudinary URL
        // URL format: https://res.cloudinary.com/<cloud_name>/image/upload/v<version>/<public_id>.<format>
        try {
            if (url.contains("cloudinary.com")) {
                String[] parts = url.split("/upload/");
                if (parts.length > 1) {
                    String path = parts[1];
                    // Remove version prefix if present (v1234567890)
                    path = path.replaceFirst("^v\\d+/", "");
                    // Remove file extension
                    int lastDot = path.lastIndexOf(".");
                    if (lastDot > 0) {
                        path = path.substring(0, lastDot);
                    }
                    return path;
                }
            }
        } catch (Exception e) {
            e.printStackTrace();
        }
        return null;
    }
}
