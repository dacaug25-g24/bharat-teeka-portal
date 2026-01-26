package com.bharatteeka.auth.controller;

import com.bharatteeka.auth.dto.*;
import com.bharatteeka.auth.entity.User;
import com.bharatteeka.auth.service.AuthService;

import jakarta.validation.Valid;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/auth")
public class AuthController {
    
    @Autowired
    private AuthService authService;
    
    // --------------------------
    // Create account
    // --------------------------
    @PostMapping("/create-account")
    public ResponseEntity<Map<String, Object>> createAccount(@Validated @RequestBody CreateAccountRequest request) {
        try {
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
            
            return ResponseEntity.ok(response);
            
        } catch (Exception e) {
            Map<String, Object> response = new HashMap<>();
            response.put("success", false);
            response.put("message", e.getMessage());
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(response);
        }
    }

    // --------------------------
    // Complete registration
    // --------------------------
    @PostMapping("/complete-registration")
    public ResponseEntity<Map<String, Object>> completeRegistration(@Valid @RequestBody CompleteRegistrationRequest request) {
        try {
            User user = authService.completeRegistration(
                request.getUserId(),
                request.getFullName(),
                LocalDate.parse(request.getDateOfBirth()),
                request.getGender(),
                request.getAadhaarNumber(),
                request.getBloodGroup(),
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
            response.put("hospitalId", user.getRoleId() == 2 ? user.getUserId() : null); // hospitalId if role = Hospital
            response.put("age", age);

            return ResponseEntity.ok(response);
        } catch (Exception e) {
            Map<String, Object> response = new HashMap<>();
            response.put("success", false);
            response.put("message", e.getMessage());
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(response);
        }
    }

    // --------------------------
    // Login
    // --------------------------
    @PostMapping("/login")
    public ResponseEntity<Map<String, Object>> login(@Valid @RequestBody LoginRequest request) {
        try {
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
            // ✅ Add hospitalId for hospital users
            userData.put("hospitalId", user.getRoleId() == 2 ? user.getUserId() : null);
            
            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("message", "Login successful!");
            response.put("user", userData);
            
            return ResponseEntity.ok(response);
            
        } catch (Exception e) {
            Map<String, Object> response = new HashMap<>();
            response.put("success", false);
            response.put("message", e.getMessage());
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(response);
        }
    }

    // --------------------------
    // Helper: Get role name
    // --------------------------
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

    // --------------------------
    // Helper: Calculate age
    // --------------------------
    private int calculateAge(LocalDate dob) {
        return java.time.Period.between(dob, LocalDate.now()).getYears();
    }
}