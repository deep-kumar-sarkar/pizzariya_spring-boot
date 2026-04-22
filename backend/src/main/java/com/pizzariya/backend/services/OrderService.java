package com.pizzariya.backend.services;

import com.pizzariya.backend.dto.OrderRequest;
import com.pizzariya.backend.entity.OrderItem;
import java.util.List;

public interface OrderService {
    void createOrder(String email, OrderRequest orderRequest);
    List<OrderItem> getPurchasedItems(String email);
}
