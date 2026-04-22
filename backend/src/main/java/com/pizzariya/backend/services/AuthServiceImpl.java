package com.pizzariya.backend.services;

import com.google.api.client.googleapis.auth.oauth2.GoogleIdToken;
import com.google.api.client.googleapis.auth.oauth2.GoogleIdTokenVerifier;
import com.google.api.client.http.javanet.NetHttpTransport;
import com.google.api.client.json.gson.GsonFactory;
import com.pizzariya.backend.dto.GoogleLoginRequest;
import com.pizzariya.backend.dto.JwtResponse;
import com.pizzariya.backend.dto.LoginRequest;
import com.pizzariya.backend.entity.User;
import com.pizzariya.backend.exception.BadRequestException;
import com.pizzariya.backend.exception.ResourceNotFoundException;
import com.pizzariya.backend.repository.UserRepository;
import com.pizzariya.backend.security.jwt.JwtUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import java.util.Collections;
import java.util.UUID;

@Service
public class AuthServiceImpl implements AuthService {

    @Autowired
    private AuthenticationManager authenticationManager;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PasswordEncoder encoder;

    @Autowired
    private JwtUtils jwtUtils;

    @Value("${app.google.clientId}")
    private String googleClientId;

    @Override
    public JwtResponse authenticateUser(LoginRequest loginRequest) {
        Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(loginRequest.getEmail(), loginRequest.getPassword()));

        SecurityContextHolder.getContext().setAuthentication(authentication);
        String jwt = jwtUtils.generateJwtToken(authentication);

        User user = userRepository.findByEmail(loginRequest.getEmail())
                .orElseThrow(() -> new ResourceNotFoundException("User not found after authentication."));
        
        return new JwtResponse(jwt, user.getEmail(), user.getName());
    }

    @Override
    public JwtResponse authenticateGoogleUser(GoogleLoginRequest request) {
        try {
            GoogleIdTokenVerifier verifier = new GoogleIdTokenVerifier.Builder(new NetHttpTransport(), new GsonFactory())
                    .setAudience(Collections.singletonList(googleClientId))
                    .build();

            GoogleIdToken idToken = verifier.verify(request.getToken());
            if (idToken == null) {
                throw new BadRequestException("Invalid Google Token");
            }

            GoogleIdToken.Payload payload = idToken.getPayload();
            String email = payload.getEmail();
            String name = (String) payload.get("name");

            User user = userRepository.findByEmail(email).orElseGet(() -> {
                User newUser = User.builder()
                        .email(email)
                        .name(name)
                        .password(encoder.encode(UUID.randomUUID().toString()))
                        .build();
                return userRepository.save(newUser);
            });

            // Log the user in manually (bypass standard password check as Google verified them)
            Authentication authentication = new UsernamePasswordAuthenticationToken(
                    new org.springframework.security.core.userdetails.User(user.getEmail(), user.getPassword(), Collections.emptyList()), 
                    null, 
                    Collections.emptyList());

            SecurityContextHolder.getContext().setAuthentication(authentication);
            String jwt = jwtUtils.generateJwtToken(authentication);

            return new JwtResponse(jwt, user.getEmail(), user.getName());

        } catch (Exception e) {
            throw new BadRequestException("Google Authentication Failed: " + e.getMessage());
        }
    }

    @Override
    public void registerUser(User signUpRequest) {
        if (userRepository.findByEmail(signUpRequest.getEmail()).isPresent()) {
            throw new BadRequestException("Error: Email is already in use!");
        }

        User user = User.builder()
                .name(signUpRequest.getName())
                .email(signUpRequest.getEmail())
                .password(encoder.encode(signUpRequest.getPassword()))
                .build();

        userRepository.save(user);
    }
}
