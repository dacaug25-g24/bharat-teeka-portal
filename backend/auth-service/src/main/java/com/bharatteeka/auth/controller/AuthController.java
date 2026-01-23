package com.bharatteeka.auth.controller;

import com.bharatteeka.auth.dto.*;
import com.bharatteeka.auth.entity.User;
import com.bharatteeka.auth.service.AuthService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.time.format.DateTimeParseException;
import java.util.HashMap;
import java.util.Map;

@RestController
@CrossOrigin(origins = "http://localhost:5174")
@RequestMapping("/api/auth")
public class AuthController {
    
    @Autowired
    private AuthService authService;
    
    // Step 1: Create account
    @PostMapping("/create-account")
    public ResponseEntity<Map<String, Object>> createAccount(@RequestBody CreateAccountRequest request) {
        try {
            System.out.println("Creating account for: " + request.getUsername());
            
            // Validate required fields
            if (request.getUsername() == null || request.getUsername().trim().isEmpty()) {
                throw new RuntimeException("Username is required");
            }
            if (request.getPassword() == null || request.getPassword().trim().isEmpty()) {
                throw new RuntimeException("Password is required");
            }
            if (request.getEmail() == null || request.getEmail().trim().isEmpty()) {
                throw new RuntimeException("Email is required");
            }
            if (request.getPhone() == null || request.getPhone().trim().isEmpty()) {
                throw new RuntimeException("Phone is required");
            }
            if (request.getAddress() == null || request.getAddress().trim().isEmpty()) {
                throw new RuntimeException("Address is required");
            }
            
            // Validate phone format (simple validation)
            if (!request.getPhone().matches("\\d{10}")) {
                throw new RuntimeException("Phone must be 10 digits");
            }
            
            User user = authService.createAccount(
                request.getUsername().trim(),
                request.getPassword().trim(),
                request.getEmail().trim(),
                request.getPhone().trim(),
                request.getAddress().trim()
            );
            
            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("message", "Account created successfully. Please complete registration.");
            response.put("userId", user.getUserId());
            response.put("username", user.getUsername());
            
            System.out.println("Account created with ID: " + user.getUserId());
            return ResponseEntity.ok(response);
            
        } catch (Exception e) {
            System.out.println("Account creation error: " + e.getMessage());
            
            Map<String, Object> response = new HashMap<>();
            response.put("success", false);
            response.put("message", e.getMessage());
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(response);
        }
    }
    
    // Step 2: Complete registration
    @PostMapping("/complete-registration")
    public ResponseEntity<Map<String, Object>> completeRegistration(@RequestBody CompleteRegistrationRequest request) {
        try {
            System.out.println("Completing registration for user ID: " + request.getUserId());
            
            // Validate required fields
            if (request.getUserId() == null) {
                throw new RuntimeException("User ID is required");
            }
            if (request.getFullName() == null || request.getFullName().trim().isEmpty()) {
                throw new RuntimeException("Full name is required");
            }
            if (request.getDateOfBirth() == null) {
                throw new RuntimeException("Date of birth is required");
            }
            if (request.getGender() == null || request.getGender().trim().isEmpty()) {
                throw new RuntimeException("Gender is required");
            }
            
            // Parse date string to LocalDate
            LocalDate dob;
            try {
                dob = LocalDate.parse(request.getDateOfBirth());
            } catch (DateTimeParseException e) {
                throw new RuntimeException("Invalid date format. Use YYYY-MM-DD format");
            }
            
            User user = authService.completeRegistration(
                request.getUserId(),
                request.getFullName().trim(),
                dob,
                request.getGender().trim(),
                request.getAadhaarNumber() != null ? request.getAadhaarNumber().trim() : null,
                request.getRemarks() != null ? request.getRemarks().trim() : null
            );
            
            // Get role name
            String roleName = getRoleName(user.getRoleId());
            int age = calculateAge(dob);
            
            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("message", "Registration completed successfully!");
            response.put("userId", user.getUserId());
            response.put("username", user.getUsername());
            response.put("roleId", user.getRoleId());
            response.put("roleName", roleName);
            response.put("age", age);
            
            System.out.println("Registration completed. User ID: " + user.getUserId() + ", Role: " + roleName);
            return ResponseEntity.ok(response);
            
        } catch (Exception e) {
            System.out.println("Registration completion error: " + e.getMessage());
            
            Map<String, Object> response = new HashMap<>();
            response.put("success", false);
            response.put("message", e.getMessage());
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(response);
        }
    }
    
    // Login (existing)
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
    
    // Helper method to get role name
    private String getRoleName(Integer roleId) {
        if (roleId == null) {
            return "Unknown";
        }
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