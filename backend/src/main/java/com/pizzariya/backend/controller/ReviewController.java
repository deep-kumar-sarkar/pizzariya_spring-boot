package com.pizzariya.backend.controller;

import com.pizzariya.backend.dto.ReviewRequest;
import com.pizzariya.backend.entity.Review;
import com.pizzariya.backend.services.ReviewService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/reviews")
public class ReviewController {
    
    @Autowired
    private ReviewService reviewService;

    @PostMapping
    public ResponseEntity<?> createReview(@RequestBody ReviewRequest reviewRequest) {
        String email = ((UserDetails) SecurityContextHolder.getContext().getAuthentication().getPrincipal()).getUsername();
        return ResponseEntity.ok(reviewService.createReview(email, reviewRequest));
    }

    @GetMapping
    public List<Review> getReviewsByMenuItem(@RequestParam Long menuItemId) {
        return reviewService.getReviewsByMenuItem(menuItemId);
    }
}
