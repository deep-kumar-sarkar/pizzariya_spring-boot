package com.pizzariya.backend.entity;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "outlets")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Outlet {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String name;
    private String city;
    private String address;
    private String phone;
}
