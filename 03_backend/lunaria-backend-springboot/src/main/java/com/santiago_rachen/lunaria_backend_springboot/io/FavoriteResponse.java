package com.santiago_rachen.lunaria_backend_springboot.io;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class FavoriteResponse {

    private Long id;
    private String itemId;
    private String itemName;
    private String itemDescription;
    private String itemImgUrl;
    private LocalDateTime addedAt;
}