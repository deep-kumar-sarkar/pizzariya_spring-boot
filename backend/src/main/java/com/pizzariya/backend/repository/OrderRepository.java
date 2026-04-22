package com.pizzariya.backend.repository;

import com.pizzariya.backend.entity.Order;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface OrderRepository extends JpaRepository<Order, Long> {
    java.util.List<Order> findByUserId(Long userId);
}
