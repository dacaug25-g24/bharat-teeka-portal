package com.bharatteeka.auth.controller;

import com.bharatteeka.auth.entity.User;
import com.bharatteeka.auth.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/auth")
public class TestController {
    
    @Autowired
    private UserRepository userRepository;
    
    @GetMapping("/test")
    public ResponseEntity<Map<String, String>> testConnection() {
        Map<String, String> response = new HashMap<>();
        response.put("status", "OK");
        response.put("message", "Backend is running on port 8080");
        response.put("service", "Bharat Teeka Portal Auth Service");
        return ResponseEntity.ok(response);
    }
    
    @GetMapping("/test-users")
    public ResponseEntity<Map<String, Object>> getTestUsers() {
        Map<String, Object> response = new HashMap<>();
        
        // Static test users
        Map<String, Object> testUsers = new HashMap<>();
        
        // Admin user
        Map<String, String> admin = new HashMap<>();
        admin.put("username", "admin");
        admin.put("password", "admin123");
        admin.put("role", "Admin");
        
        // Hospital user
        Map<String, String> hospital = new HashMap<>();
        hospital.put("username", "aiims");
        hospital.put("password", "hospital123");
        hospital.put("role", "Hospital");
        
        // Patient user
        Map<String, String> patient = new HashMap<>();
        patient.put("username", "raj");
        patient.put("password", "patient123");
        patient.put("role", "Patient");
        
        // Parent user
        Map<String, String> parent = new HashMap<>();
        parent.put("username", "parent1");
        parent.put("password", "parent123");
        parent.put("role", "Parent");
        
        testUsers.put("admin", admin);
        testUsers.put("hospital", hospital);
        testUsers.put("patient", patient);
        testUsers.put("parent", parent);
        
        response.put("success", true);
        response.put("message", "Test users list");
        response.put("testUsers", testUsers);
        
        return ResponseEntity.ok(response);
    }
    
    @GetMapping("/all-users")
    public ResponseEntity<Map<String, Object>> getAllUsers() {
        Map<String, Object> response = new HashMap<>();
        
        try {
            List<User> users = userRepository.findAll();
            response.put("success", true);
            response.put("message", "Users retrieved successfully");
            response.put("count", users.size());
            response.put("users", users);
        } catch (Exception e) {
            response.put("success", false);
            response.put("message", "Error retrieving users: " + e.getMessage());
        }
        
        return ResponseEntity.ok(response);
    }
    
    @GetMapping("/check-db")
    public ResponseEntity<Map<String, Object>> checkDatabase() {
        Map<String, Object> response = new HashMap<>();
        
        try {
            long count = userRepository.count();
            response.put("success", true);
            response.put("message", "Database connection successful");
            response.put("userCount", count);
            response.put("database", "p24_bharat_teeka_portal");
        } catch (Exception e) {
            response.put("success", false);
            response.put("message", "Database connection failed");
            response.put("error", e.getMessage());
        }
        
        return ResponseEntity.ok(response);
    }
}