package com.pizzariya.backend.controller;

import com.pizzariya.backend.dto.OrderRequest;
import com.pizzariya.backend.entity.OrderItem;
import com.pizzariya.backend.services.OrderService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/orders")
public class OrderController {
    
    @Autowired
    private OrderService orderService;

    @PostMapping
    public ResponseEntity<?> createOrder(@RequestBody OrderRequest orderRequest) {
        String email = ((UserDetails) SecurityContextHolder.getContext().getAuthentication().getPrincipal()).getUsername();
        orderService.createOrder(email, orderRequest);
        return ResponseEntity.ok("Order placed successfully");
    }

    @GetMapping("/purchased")
    public List<OrderItem> getPurchasedItems() {
        String email = ((UserDetails) SecurityContextHolder.getContext().getAuthentication().getPrincipal()).getUsername();
        return orderService.getPurchasedItems(email);
    }
}
