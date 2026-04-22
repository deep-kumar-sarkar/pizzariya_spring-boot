package com.pizzariya.backend.entity;

import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.Formula;

@Entity
@Table(name = "menu_items")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class MenuItem {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "outlet_id")
    private Outlet outlet;

    private String name;
    private String description;
    private Double price;
    private Boolean isVegetarian;
    private String cuisineType;

    @Formula("(SELECT COALESCE(AVG(r.rating), 0.0) FROM reviews r WHERE r.menu_item_id = id)")
    private Double averageRating;
}
