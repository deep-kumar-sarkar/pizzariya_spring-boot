package com.pizzariya.backend.dto;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class CityStats {
    private String city;
    private Long count;
}
