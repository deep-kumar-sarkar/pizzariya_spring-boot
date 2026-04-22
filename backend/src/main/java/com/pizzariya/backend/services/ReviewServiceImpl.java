package com.pizzariya.backend.services;

import com.pizzariya.backend.dto.ReviewRequest;
import com.pizzariya.backend.entity.*;
import com.pizzariya.backend.exception.BadRequestException;
import com.pizzariya.backend.exception.ResourceNotFoundException;
import com.pizzariya.backend.repository.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.List;

@Service
public class ReviewServiceImpl implements ReviewService {

    @Autowired
    private ReviewRepository reviewRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private MenuItemRepository menuItemRepository;

    @Override
    public Review createReview(String email, ReviewRequest reviewRequest) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        if (reviewRepository.findByUserIdAndMenuItemId(user.getId(), reviewRequest.getMenuItemId()).isPresent()) {
            throw new BadRequestException("You have already reviewed this item.");
        }

        MenuItem menuItem = menuItemRepository.findById(reviewRequest.getMenuItemId())
                .orElseThrow(() -> new ResourceNotFoundException("Menu Item not found"));

        Review review = Review.builder()
                .user(user)
                .menuItem(menuItem)
                .rating(reviewRequest.getRating())
                .comment(reviewRequest.getComment())
                .build();
        return reviewRepository.save(review);
    }

    @Override
    public List<Review> getReviewsByMenuItem(Long menuItemId) {
        return reviewRepository.findByMenuItemId(menuItemId);
    }
}
