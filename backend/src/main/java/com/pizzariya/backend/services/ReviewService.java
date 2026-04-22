package com.pizzariya.backend.services;

import com.pizzariya.backend.dto.ReviewRequest;
import com.pizzariya.backend.entity.Review;
import java.util.List;

public interface ReviewService {
    Review createReview(String email, ReviewRequest reviewRequest);
    List<Review> getReviewsByMenuItem(Long menuItemId);
}
