package com.bharatteeka.auth.controller;

import com.bharatteeka.auth.dto.LoginRequest;
import com.bharatteeka.auth.dto.LoginResponse;
import com.bharatteeka.auth.entity.User;
import com.bharatteeka.auth.service.AuthService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;

@RestController
@CrossOrigin(origins = "http://localhost:5174")
@RequestMapping("/api/auth")
public class AuthController {
    
    @Autowired
    private AuthService authService;
    
    // Login endpoint
    @PostMapping("/login")
    public ResponseEntity<LoginResponse> login(@RequestBody LoginRequest request) {
        try {
            System.out.println("Login attempt for user: " + request.getUsername());
            
            User user = authService.authenticate(request.getUsername(), request.getPassword());
            
            String roleName = getRoleName(user.getRoleId());
            
            LoginResponse.UserData userData = new LoginResponse.UserData(
                user.getUserId(),
                user.getUsername(),
                user.getRoleId(),
                user.getEmail(),
                user.getPhone(),
                user.getAddress(),
                roleName
            );
            
            LoginResponse response = new LoginResponse(true, "Login successful!", userData);
            
            System.out.println("Login successful for user: " + user.getUsername() + " (Role: " + roleName + ")");
            return ResponseEntity.ok(response);
            
        } catch (Exception e) {
            System.out.println("Login failed: " + e.getMessage());
            LoginResponse response = new LoginResponse(false, e.getMessage(), null);
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(response);
        }
    }
    
    // Simple test endpoint
    @GetMapping("/test")
    public Map<String, String> test() {
        Map<String, String> response = new HashMap<>();
        response.put("status", "success");
        response.put("message", "Auth Service is running!");
        response.put("timestamp", new java.util.Date().toString());
        response.put("database", "p24_bharat_teeka_portal");
        return response;
    }
    
    // Get all users (for testing)
    @GetMapping("/all-users")
    public ResponseEntity<?> getAllUsers() {
        try {
            var users = authService.getAllUsers();
            return ResponseEntity.ok(users);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Error fetching users: " + e.getMessage());
        }
    }
    
    // Test users info
    @GetMapping("/test-users")
    public Map<String, Object> getTestUsers() {
        Map<String, Object> response = new HashMap<>();
        
        Map<String, String> testUsers = new HashMap<>();
        testUsers.put("admin", "admin123 (Role: Admin)");
        testUsers.put("aiims", "hospital123 (Role: Hospital)");
        testUsers.put("kims", "hospital123 (Role: Hospital)");
        testUsers.put("apollo", "hospital123 (Role: Hospital)");
        testUsers.put("civil", "hospital123 (Role: Hospital)");
        testUsers.put("raj", "patient123 (Role: Patient)");
        testUsers.put("priya", "patient123 (Role: Patient)");
        testUsers.put("arun", "patient123 (Role: Patient)");
        testUsers.put("meera", "patient123 (Role: Patient)");
        testUsers.put("parent1", "parent123 (Role: Parent)");
        testUsers.put("parent2", "parent123 (Role: Parent)");
        
        response.put("available_test_users", testUsers);
        response.put("instruction", "Use these credentials to test login");
        response.put("login_endpoint", "POST http://localhost:8080/api/auth/login");
        
        return response;
    }
    
    // Helper method to get role name
    private String getRoleName(Integer roleId) {
        switch(roleId) {
            case 1: return "Admin";
            case 2: return "Hospital";
            case 3: return "Patient";
            case 4: return "Parent";
            default: return "Unknown";
        }
    }
}