package com.pizzariya.backend.repository;

import com.pizzariya.backend.entity.OrderItem;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface OrderItemRepository extends JpaRepository<OrderItem, Long> {
    @Query("SELECT oi FROM OrderItem oi JOIN FETCH oi.menuItem JOIN FETCH oi.order o WHERE o.user.id = :userId ORDER BY o.orderedAt DESC")
    List<OrderItem> findAllByUserId(@Param("userId") Long userId);
}
