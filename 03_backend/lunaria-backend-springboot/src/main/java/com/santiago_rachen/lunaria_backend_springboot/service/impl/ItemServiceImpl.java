package com.santiago_rachen.lunaria_backend_springboot.service.impl;

import com.santiago_rachen.lunaria_backend_springboot.entity.BrandEntity;
import com.santiago_rachen.lunaria_backend_springboot.entity.CategoryEntity;
import com.santiago_rachen.lunaria_backend_springboot.entity.ItemEntity;
import com.santiago_rachen.lunaria_backend_springboot.io.ItemRequest;
import com.santiago_rachen.lunaria_backend_springboot.io.ItemResponse;
import com.santiago_rachen.lunaria_backend_springboot.repository.BrandRepository;
import com.santiago_rachen.lunaria_backend_springboot.repository.CategoryRepository;
import com.santiago_rachen.lunaria_backend_springboot.repository.ItemRepository;
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

    @Override
    public ItemResponse add(ItemRequest request, MultipartFile file) throws IOException {
        //String imgUrl = fileUploadService.uploadFile(file);
        String fileName = UUID.randomUUID().toString()+"."+ StringUtils.getFilenameExtension(file.getOriginalFilename());
        Path uploadPath = Paths.get("uploads").toAbsolutePath().normalize();
        Files.createDirectories(uploadPath);
        Path targetLocation = uploadPath.resolve(fileName);
        Files.copy(file.getInputStream(), targetLocation, StandardCopyOption.REPLACE_EXISTING);
        String imgUrl = "http://localhost:9090/api/v1.0/uploads/"+fileName;
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
    public void deleteItem(String itemId) {
        ItemEntity existingItem = itemRepository.findByItemId(itemId)
                .orElseThrow(() -> new RuntimeException("Item not found: "+itemId));
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
