package com.santiago_rachen.lunaria_backend_springboot.service;

import com.santiago_rachen.lunaria_backend_springboot.io.ItemRequest;
import com.santiago_rachen.lunaria_backend_springboot.io.ItemResponse;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.List;

public interface ItemService {

    ItemResponse add(ItemRequest request, MultipartFile file) throws IOException;

    List<ItemResponse> fetchItems();

    ItemResponse updateItem(String itemId, ItemRequest request);

    void deleteItem(String itemId);
}