package com.pizzariya.backend.repository;

import com.pizzariya.backend.entity.Review;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;
import java.util.Optional;

@Repository
public interface ReviewRepository extends JpaRepository<Review, Long> {
    List<Review> findByMenuItemId(Long menuItemId);
    Optional<Review> findByUserIdAndMenuItemId(Long userId, Long menuItemId);
}
