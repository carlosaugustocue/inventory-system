package com.inventory.system.dto;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;

public class ProductDTOs {

    @Data
    @Builder
    @AllArgsConstructor
    @NoArgsConstructor
    public static class ProductRequest {
        @NotBlank
        private String name;

        private String description;

        @NotNull
        @Min(0)
        private Integer quantity;

        @NotNull
        @Min(0)
        private BigDecimal price;

        private String category;
    }

    @Data
    @Builder
    @AllArgsConstructor
    @NoArgsConstructor
    public static class ProductResponse {
        private Long id;
        private String name;
        private String description;
        private Integer quantity;
        private BigDecimal price;
        private String category;
        private String createdBy;
    }
}