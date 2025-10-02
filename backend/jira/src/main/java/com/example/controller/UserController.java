package com.example.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.example.demo.payload.LoginRequest;
import com.example.model.entity.User;
import com.example.security.JwtUtil;
import com.example.service.UserService;

@RestController
@RequestMapping("/api/user")
@CrossOrigin(origins = "http://localhost:4200")
public class UserController {
    private final UserService userService;
    private final JwtUtil jwtUtil;

    public UserController(UserService userService, JwtUtil jwtUtil) {
        this.userService = userService;
        this.jwtUtil = jwtUtil;
    }

    // Register
    @PostMapping("/register")
    public ResponseEntity<?> register(@RequestBody User user) {
        try {
            User registeredUser = userService.registerUser(user);
            String token = jwtUtil.generateToken(registeredUser.getEmail(), registeredUser.getRole());
            return ResponseEntity.ok().body(
                    java.util.Map.of("message", "User registered successfully", "token", token));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(
                    java.util.Map.of("error", e.getMessage()));
        }
    }

    // Login
    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody LoginRequest loginRequest) {
        try {
            User authenticatedUser = userService.loginUser(loginRequest.getEmail(), loginRequest.getPassword());

            String token = jwtUtil.generateToken(authenticatedUser.getEmail(), authenticatedUser.getRole());

            return ResponseEntity.ok().body(
                    java.util.Map.of("message", "User logged in successfully", "token", token));
        } catch (Exception e) {
            return ResponseEntity.status(401).body(
                    java.util.Map.of("error", e.getMessage()));
        }
    }

    @GetMapping("/profile")
    public ResponseEntity<?> profile(@RequestHeader("JWTAuthorization") String authHeader) {
        try {
            String token = authHeader.substring(7);
            System.out.println(authHeader);
            if (!jwtUtil.validateToken(token)) {
                return ResponseEntity.status(401).body(
                        java.util.Map.of("error", "Invalid or expired token"));
            }

            String email = jwtUtil.extractEmail(token);
            return ResponseEntity.ok(
                    java.util.Map.of("email", email, "message", "Welcome to your profile"));

        } catch (Exception e) {
            return ResponseEntity.status(400).body(
                    java.util.Map.of("error", "Invalid request"));
        }
    }
}