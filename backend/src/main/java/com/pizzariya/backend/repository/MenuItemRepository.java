package com.pizzariya.backend.repository;

import com.pizzariya.backend.entity.MenuItem;
import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface MenuItemRepository extends JpaRepository<MenuItem, Long> {
    
    @EntityGraph(attributePaths = {"outlet"})
    List<MenuItem> findByOutletId(Long outletId);

    @EntityGraph(attributePaths = {"outlet"})
    List<MenuItem> findAll();
}
