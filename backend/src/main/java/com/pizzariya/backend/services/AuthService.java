package com.pizzariya.backend.services;

import com.pizzariya.backend.dto.GoogleLoginRequest;
import com.pizzariya.backend.dto.JwtResponse;
import com.pizzariya.backend.dto.LoginRequest;
import com.pizzariya.backend.entity.User;

public interface AuthService {
    JwtResponse authenticateUser(LoginRequest loginRequest);
    JwtResponse authenticateGoogleUser(GoogleLoginRequest googleLoginRequest);
    void registerUser(User signUpRequest);
}
