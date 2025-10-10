package com.example.controller;

import java.util.List;
import java.util.Map;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
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
    
    @GetMapping
    public ResponseEntity<?> getAllUsers(@RequestHeader("Authorization") String authHeader){
    		try {
    			String token = authHeader.substring(7);
    			if (!jwtUtil.validateToken(token)) {
                    return ResponseEntity.status(401).body(java.util.Map.of("error", "Invalid or expired token"));
             }
    			String role = jwtUtil.extractRole(token);
    			if(!"ADMIN".equalsIgnoreCase(role) && !"MANAGER".equalsIgnoreCase(role)) {
    				return ResponseEntity.status(403).body(java.util.Map.of("error", "Unauthorized."));    				
    			}
    			List<User> users = userService.findAllUsers();
    			
    			return ResponseEntity.ok().body(java.util.Map.of("users", users));
    		} catch (Exception e) {
    			return ResponseEntity.badRequest().body(
    					java.util.Map.of("error", e.getMessage()));
    		}
    }

    @PostMapping("/register")
    public ResponseEntity<?> register(@RequestBody User user) {
        try {
            User registeredUser = userService.registerUser(user);
            String token = jwtUtil.generateToken(registeredUser.getEmail(), registeredUser.getRole(), registeredUser.getUser_id(), registeredUser.getUsername() );
            return ResponseEntity.ok().body(
                    java.util.Map.of("message", "User registered successfully", "token", token));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(
                    java.util.Map.of("error", e.getMessage()));
        }
    }

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody LoginRequest loginRequest) {
        try {
            User authenticatedUser = userService.loginUser(loginRequest.getEmail(), loginRequest.getPassword());

            String token = jwtUtil.generateToken(authenticatedUser.getEmail(), authenticatedUser.getRole(), authenticatedUser.getUser_id(), authenticatedUser.getUsername() );

            return ResponseEntity.ok().body(
                    java.util.Map.of("message", "User logged in successfully", "token", token));
        } catch (Exception e) {
            return ResponseEntity.status(401).body(
                    java.util.Map.of("error", e.getMessage()));
        }
    }

    @GetMapping("/profile")
    public ResponseEntity<?> profile(@RequestHeader("Authorization") String authHeader) {
        try {
            String token = authHeader.substring(7);
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

    @PutMapping("/{id}")
    public ResponseEntity<?> updateUser(
        @PathVariable Long id, @RequestBody User updates, @RequestHeader("Authorization") String authHeader
    ) {
        if (!jwtUtil.isAuthenticated(authHeader)) {
            return ResponseEntity.status(401).body(java.util.Map.of("error", "Invalid or expired token"));
        }
        try {
            String token = authHeader.substring(7);
            String requesterEmail = jwtUtil.extractEmail(token);
            String requesterRole = jwtUtil.extractRole(token);

            if (!"admin".equalsIgnoreCase(requesterRole) ) {
                User target = userService.getUserById(id);
                if (!target.getEmail().equalsIgnoreCase(requesterEmail)) return ResponseEntity.status(403).body(Map.of("error", "Not authorized to update other users"));

                if (updates.getRole() != null) return ResponseEntity.status(403).body(java.util.Map.of("error", "Not authorized to change role"));
                
                if (updates.getEmail() != null && !updates.getEmail().equalsIgnoreCase(requesterEmail)) return ResponseEntity.status(403).body(java.util.Map.of("error", "Not authorized to update another user"));
            }

            User updated = userService.updateUser(id, updates);
            return ResponseEntity.ok(updated);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(java.util.Map.of("error", e.getMessage()));
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteUser(
        @PathVariable Long id, @RequestHeader("Authorization") String authHeader
    ) {
        if (!jwtUtil.isAuthenticated(authHeader)) {
            return ResponseEntity.status(401).body(java.util.Map.of("error", "Invalid or expired token"));
        }
        try {
            String token = authHeader.substring(7);
            String role = jwtUtil.extractRole(token);

            if (!"admin".equalsIgnoreCase(role) ) return ResponseEntity.status(403).body(java.util.Map.of("error", "Not authorized to delete user"));

            userService.deleteUser(id);
            return ResponseEntity.ok(java.util.Map.of("message", "User deleted successfully"));
        } catch (Exception e) {
            return ResponseEntity.status(404).body(java.util.Map.of("error", e.getMessage()));
        }
    }
}