package com.santiago_rachen.lunaria_backend_springboot.service.impl;

import com.cloudinary.Cloudinary;
import com.cloudinary.utils.ObjectUtils;
import com.santiago_rachen.lunaria_backend_springboot.config.AppConfig;
import com.santiago_rachen.lunaria_backend_springboot.entity.CategoryEntity;
import com.santiago_rachen.lunaria_backend_springboot.io.CategoryRequest;
import com.santiago_rachen.lunaria_backend_springboot.io.CategoryResponse;
import com.santiago_rachen.lunaria_backend_springboot.repository.CategoryRepository;
import com.santiago_rachen.lunaria_backend_springboot.repository.ItemRepository;
import com.santiago_rachen.lunaria_backend_springboot.service.CategoryService;
import com.santiago_rachen.lunaria_backend_springboot.service.FileUploadService;
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
public class CategoryServiceImpl implements CategoryService {

    private final CategoryRepository categoryRepository;
    private final ItemRepository itemRepository;
    private final Cloudinary cloudinary;
    private final AppConfig appConfig;

    public CategoryResponse add(CategoryRequest request, MultipartFile file) throws IOException {
        String imgUrl = null;

        if (file != null && !file.isEmpty()) {
            try {
                // Upload to Cloudinary
                Map uploadResult = cloudinary.uploader().upload(file.getBytes(), 
                    ObjectUtils.asMap(
                        "public_id", "categories/" + UUID.randomUUID().toString(),
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

        CategoryEntity newCategory = convertToEntity(request);
        newCategory.setImgUrl(imgUrl);
        newCategory = categoryRepository.save(newCategory);
        return convertToResponse(newCategory);
    }

    @Override
    public List<CategoryResponse> read() {
        return categoryRepository.findAll()
                .stream()
                .map(categoryEntity -> convertToResponse(categoryEntity))
                .collect(Collectors.toList());
    }

    @Override
    public CategoryResponse update(String categoryId, CategoryRequest request) {
        CategoryEntity existingCategory = categoryRepository.findByCategoryId(categoryId)
                .orElseThrow(() -> new RuntimeException("Category not found: " + categoryId));

        // Update fields
        if (request.getName() != null && !request.getName().trim().isEmpty()) {
            existingCategory.setName(request.getName());
        }
        if (request.getDescription() != null) {
            existingCategory.setDescription(request.getDescription());
        }
        if (request.getBgColor() != null && !request.getBgColor().trim().isEmpty()) {
            existingCategory.setBgColor(request.getBgColor());
        }

        existingCategory = categoryRepository.save(existingCategory);
        return convertToResponse(existingCategory);
    }

    @Override
    public void delete(String categoryId) {
        CategoryEntity existingCategory = categoryRepository.findByCategoryId(categoryId)
                .orElseThrow(() -> new RuntimeException("Category not found: "+categoryId));
        
        // Delete from Cloudinary if it's not a placeholder
        String imgUrl = existingCategory.getImgUrl();
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
        
        categoryRepository.delete(existingCategory);
    }
    
    private String extractPublicIdFromUrl(String url) {
        // Extract public_id from Cloudinary URL
        try {
            if (url.contains("cloudinary.com")) {
                String[] parts = url.split("/upload/");
                if (parts.length > 1) {
                    String path = parts[1];
                    path = path.replaceFirst("^v\\d+/", "");
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

    private CategoryResponse convertToResponse(CategoryEntity newCategory) {
        Integer itemsCount = itemRepository.countByCategoryId(newCategory.getId());

        // Process imgUrl to replace localhost with configured server URL for mobile compatibility
        String processedImgUrl = newCategory.getImgUrl();
        if (processedImgUrl != null && processedImgUrl.contains("localhost")) {
            processedImgUrl = processedImgUrl.replace("http://localhost:9090/api/v1.0", appConfig.getServerUrl() + "/api/v1.0");
        }

        return CategoryResponse.builder()
                .categoryId(newCategory.getCategoryId())
                .name(newCategory.getName())
                .description(newCategory.getDescription())
                .bgColor(newCategory.getBgColor())
                .imgUrl(processedImgUrl)
                .createdAt(newCategory.getCreatedAt())
                .updatedAt(newCategory.getUpdatedAt())
                .items(itemsCount)
                .build();
    }

    private CategoryEntity convertToEntity(CategoryRequest request) {
        return CategoryEntity.builder()
                .categoryId(UUID.randomUUID().toString())
                .name(request.getName())
                .description(request.getDescription())
                .bgColor(request.getBgColor())
                .build();
    }
}
