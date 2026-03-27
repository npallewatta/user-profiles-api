package com.project.userapi.controller;

import com.project.userapi.dto.AuthResponse;
import com.project.userapi.dto.LoginRequest;
import com.project.userapi.dto.RegisterRequest;
import com.project.userapi.model.User;
import com.project.userapi.service.JwtService;
import com.project.userapi.service.UserService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import jakarta.validation.Valid;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    private final UserService userService;
    private final JwtService jwtService;

    public AuthController(UserService userService, JwtService jwtService) {
        this.userService = userService;
        this.jwtService = jwtService;
    }

    @PostMapping("/register")
    public ResponseEntity<AuthResponse> register(@Valid @RequestBody RegisterRequest request) {
        if (userService.findByEmail(request.getEmail()).isPresent()) {
            return ResponseEntity.badRequest().build();
        }

        User user = userService.createUser(request.getEmail(), request.getPassword(), request.getName());
        String token = jwtService.generateToken(user.getEmail());
        return ResponseEntity.ok(new AuthResponse(token, ""));
    }

    @PostMapping("/login")
    public ResponseEntity<AuthResponse> login(@Valid @RequestBody LoginRequest request) {
        User user = userService.findByEmail(request.getEmail()).orElse(null);
        if (user == null || !userService.matchesPassword(request.getPassword(), user.getPasswordHash())) {
            return ResponseEntity.status(401).build();
        }

        String accessToken = jwtService.generateToken(user.getEmail());
        return ResponseEntity.ok(new AuthResponse(accessToken, ""));
    }

    @GetMapping("/refresh")
    public ResponseEntity<AuthResponse> refresh(@RequestHeader("Authorization") String authHeader) {
        if (authHeader == null || !authHeader.startsWith("Bearer ")) {
            return ResponseEntity.badRequest().build();
        }

        String token = authHeader.substring(7);
        if (!jwtService.validateToken(token)) {
            return ResponseEntity.status(401).build();
        }

        String email = jwtService.getEmailFromToken(token);
        String newToken = jwtService.generateToken(email);
        return ResponseEntity.ok(new AuthResponse(newToken, ""));
    }
}
