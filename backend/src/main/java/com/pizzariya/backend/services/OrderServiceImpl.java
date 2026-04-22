package com.pizzariya.backend.services;

import com.pizzariya.backend.dto.OrderRequest;
import com.pizzariya.backend.entity.*;
import com.pizzariya.backend.exception.ResourceNotFoundException;
import com.pizzariya.backend.repository.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.util.List;
import java.util.Map;

@Service
public class OrderServiceImpl implements OrderService {

    @Autowired private OrderRepository orderRepository;
    @Autowired private OrderItemRepository orderItemRepository;
    @Autowired private UserRepository userRepository;
    @Autowired private MenuItemRepository menuItemRepository;
    @Autowired private OutletRepository outletRepository;

    @Override
    @Transactional
    public void createOrder(String email, OrderRequest orderRequest) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        for (Map.Entry<Long, List<OrderRequest.OrderItemDto>> entry : orderRequest.getItemsByOutlet().entrySet()) {
            Long outletId = entry.getKey();
            List<OrderRequest.OrderItemDto> items = entry.getValue();
            
            Double total = items.stream().mapToDouble(i -> i.getPrice() * i.getQuantity()).sum();
            
            Order order = Order.builder()
                    .user(user)
                    .totalAmount(total)
                    .status(OrderStatus.PENDING)
                    .build();
            order = orderRepository.save(order);
            
            Outlet outlet = outletRepository.findById(outletId)
                    .orElseThrow(() -> new ResourceNotFoundException("Outlet not found with id: " + outletId));

            for (OrderRequest.OrderItemDto itemDto : items) {
                MenuItem menuItem = menuItemRepository.findById(itemDto.getMenuItemId())
                        .orElseThrow(() -> new ResourceNotFoundException("Menu Item not found with id: " + itemDto.getMenuItemId()));
                
                OrderItem orderItem = OrderItem.builder()
                        .order(order)
                        .menuItem(menuItem)
                        .outlet(outlet)
                        .quantity(itemDto.getQuantity())
                        .price(itemDto.getPrice())
                        .build();
                orderItemRepository.save(orderItem);
            }
        }
    }

    @Override
    public List<OrderItem> getPurchasedItems(String email) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));
        return orderItemRepository.findAllByUserId(user.getId());
    }
}
