package com.pizzariya.backend.dto;
import lombok.Data;
import java.util.List;
import java.util.Map;
@Data
public class OrderRequest {
    private Map<Long, List<OrderItemDto>> itemsByOutlet;
    
    @Data
    public static class OrderItemDto {
        private Long menuItemId;
        private Double price;
        private Integer quantity;
    }
}
