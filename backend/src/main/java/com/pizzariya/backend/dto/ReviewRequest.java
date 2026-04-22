package com.pizzariya.backend.dto;
import lombok.Data;
@Data
public class ReviewRequest {
    private Long menuItemId;
    private Integer rating;
    private String comment;
}
