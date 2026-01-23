package com.bharatteeka.auth.controller;

import com.bharatteeka.auth.dto.*;
import com.bharatteeka.auth.entity.User;
import com.bharatteeka.auth.service.AuthService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.time.format.DateTimeParseException;
import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/auth")
public class AuthController {
    
    @Autowired
    private AuthService authService;
    
    // Step 1: Create account
    @PostMapping("/create-account")
    public ResponseEntity<Map<String, Object>> createAccount(@Valid @RequestBody CreateAccountRequest request) {
        try {
            System.out.println("📝 Creating account for: " + request.getUsername());
            
            User user = authService.createAccount(
                request.getUsername(),
                request.getPassword(),
                request.getEmail(),
                request.getPhone(),
                request.getAddress()
            );
            
            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("message", "Account created successfully. Please complete registration.");
            response.put("userId", user.getUserId());
            response.put("username", user.getUsername());
            
            System.out.println("✅ Account created with ID: " + user.getUserId());
            return ResponseEntity.ok(response);
            
        } catch (Exception e) {
            System.out.println("❌ Account creation error: " + e.getMessage());
            
            Map<String, Object> response = new HashMap<>();
            response.put("success", false);
            response.put("message", e.getMessage());
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(response);
        }
    }
    
    // Step 2: Complete registration
    @PostMapping("/complete-registration")
    public ResponseEntity<Map<String, Object>> completeRegistration(@Valid @RequestBody CompleteRegistrationRequest request) {
        try {
            System.out.println("📝 Completing registration for user ID: " + request.getUserId());
            
            User user = authService.completeRegistration(
                request.getUserId(),
                request.getFullName(),
                LocalDate.parse(request.getDateOfBirth()),
                request.getGender(),
                request.getAadhaarNumber(),
                request.getRemarks()
            );
            
            String roleName = getRoleName(user.getRoleId());
            int age = calculateAge(LocalDate.parse(request.getDateOfBirth()));
            
            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("message", "Registration completed successfully!");
            response.put("userId", user.getUserId());
            response.put("username", user.getUsername());
            response.put("roleId", user.getRoleId());
            response.put("roleName", roleName);
            response.put("age", age);
            
            System.out.println("✅ Registration completed. User ID: " + user.getUserId() + ", Role: " + roleName);
            return ResponseEntity.ok(response);
            
        } catch (Exception e) {
            System.out.println("❌ Registration completion error: " + e.getMessage());
            
            Map<String, Object> response = new HashMap<>();
            response.put("success", false);
            response.put("message", e.getMessage());
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(response);
        }
    }
    
    // Login
    @PostMapping("/login")
    public ResponseEntity<Map<String, Object>> login(@Valid @RequestBody LoginRequest request) {
        try {
            System.out.println("🔐 Login attempt for user: " + request.getUsername());
            
            User user = authService.authenticate(request.getUsername(), request.getPassword());
            
            String roleName = getRoleName(user.getRoleId());
            
            Map<String, Object> userData = new HashMap<>();
            userData.put("userId", user.getUserId());
            userData.put("username", user.getUsername());
            userData.put("roleId", user.getRoleId());
            userData.put("roleName", roleName);
            userData.put("email", user.getEmail());
            userData.put("phone", user.getPhone());
            userData.put("address", user.getAddress());
            userData.put("isActive", user.getIsActive());
            
            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("message", "Login successful!");
            response.put("user", userData);
            
            System.out.println("✅ Login successful for user: " + user.getUsername() + " (Role: " + roleName + ")");
            return ResponseEntity.ok(response);
            
        } catch (Exception e) {
            System.out.println("❌ Login failed: " + e.getMessage());
            
            Map<String, Object> response = new HashMap<>();
            response.put("success", false);
            response.put("message", e.getMessage());
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(response);
        }
    }
    
    // Helper method to get role name
    private String getRoleName(Integer roleId) {
        if (roleId == null) return "Unknown";
        switch(roleId) {
            case 1: return "Admin";
            case 2: return "Hospital";
            case 3: return "Patient";
            case 4: return "Parent";
            case 0: return "Pending Registration";
            default: return "Unknown";
        }
    }
    
    // Helper method to calculate age
    private int calculateAge(LocalDate dob) {
        return java.time.Period.between(dob, LocalDate.now()).getYears();
    }
}