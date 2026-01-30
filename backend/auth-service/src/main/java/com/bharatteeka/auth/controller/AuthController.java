package com.bharatteeka.auth.controller;

import com.bharatteeka.auth.dto.AuthResponse;
import com.bharatteeka.auth.dto.LoginRequest;
import com.bharatteeka.auth.dto.RegisterRequest;
import com.bharatteeka.auth.entity.Hospital;
import com.bharatteeka.auth.entity.User;
import com.bharatteeka.auth.repository.HospitalRepository;
import com.bharatteeka.auth.security.JwtUtil;
import com.bharatteeka.auth.service.AuthService;

import jakarta.validation.Valid;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.HashMap;
import java.util.Map;

import com.bharatteeka.auth.dto.ForgotPasswordVerifyRequest;
import com.bharatteeka.auth.dto.ForgotPasswordResetRequest;
import com.bharatteeka.auth.dto.SimpleResponse;


@RestController
@RequestMapping("/api/auth")
public class AuthController {

    @Autowired
    private AuthService authService;

    @Autowired
    private HospitalRepository hospitalRepository;

    @Autowired
    private JwtUtil jwtUtil;
    @PostMapping("/register")
    public ResponseEntity<AuthResponse> register(@Valid @RequestBody RegisterRequest request) {
        try {
            User user = authService.registerPatient(
                    request.getUsername(),
                    request.getPassword(),
                    request.getEmail(),
                    request.getPhone(),
                    request.getAddress(),
                    request.getFirstName(),
                    request.getLastName(),
                    LocalDate.parse(request.getDateOfBirth()),
                    request.getGender(),
                    request.getAadhaarNumber(),
                    request.getBloodGroup(),
                    request.getRemarks()
            );

            String roleName = getRoleName(user.getRoleId());

            AuthResponse.UserData userData = new AuthResponse.UserData(
                    user.getUserId(),
                    user.getUsername(),
                    user.getRoleId(),
                    roleName,
                    user.getEmail(),
                    user.getPhone(),
                    user.getAddress(),
                    null
            );

            return ResponseEntity.status(HttpStatus.OK)
                    .body(new AuthResponse(
                            true,
                            "Registration successful! Please login.",
                            userData,
                            null
                    ));

        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(new AuthResponse(false, e.getMessage(), null, null));
        }
    }

    @PostMapping("/login")
    public ResponseEntity<AuthResponse> login(@Valid @RequestBody LoginRequest request) {
        try {
            System.out.println("🔥 LOGIN API HIT - JWT SHOULD BE GENERATED");

            Integer hospitalId = null;

            Map<String, Object> result =
                    authService.loginWithToken(
                            request.getUsername(),
                            request.getPassword(),
                            null
                    );

            User user = (User) result.get("user");
            String token = (String) result.get("token");

            System.out.println("🔥 JWT TOKEN = " + token);

            String roleName = getRoleName(user.getRoleId());

            if (user.getRoleId() != null && user.getRoleId() == 2) {
                Hospital hospital = hospitalRepository.findByUserUserId(user.getUserId());
                if (hospital != null) {
                    hospitalId = hospital.getHospitalId();
                }
            }

            AuthResponse.UserData userData = new AuthResponse.UserData(
                    user.getUserId(),
                    user.getUsername(),
                    user.getRoleId(),
                    roleName,
                    user.getEmail(),
                    user.getPhone(),
                    user.getAddress(),
                    hospitalId
            );

            AuthResponse response = new AuthResponse();
            response.setSuccess(true);
            response.setMessage("Login successful!");
            response.setUser(userData);
            response.setToken(token);

            return ResponseEntity.status(HttpStatus.OK).body(response);

        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(new AuthResponse(false, e.getMessage(), null, null));
        }
    }

    private String getRoleName(Integer roleId) {
        if (roleId == null) return "Unknown";

        return switch (roleId) {
            case 1 -> "Admin";
            case 2 -> "Hospital";
            case 3 -> "Patient";
            case 4 -> "Parent";
            case 0 -> "Pending";
            default -> "Unknown";
        };
    }
    
    @PostMapping("/forgot-password/verify")
    public ResponseEntity<SimpleResponse> verifyForgotPassword(@Valid @RequestBody ForgotPasswordVerifyRequest req) {
        try {
            boolean verified = authService.verifyForgotPassword(
                    req.getUsername(),
                    req.getEmail(),
                    req.getAadhaar(),
                    req.getDob()
            );

            if (!verified) {
                return ResponseEntity.status(HttpStatus.OK)
                        .body(new SimpleResponse(false, "Details not matched", false));
            }

            return ResponseEntity.status(HttpStatus.OK)
                    .body(new SimpleResponse(true, "Verified successfully. You can set a new password.", true));

        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(new SimpleResponse(false, e.getMessage(), false));
        }
    }

    @PostMapping("/forgot-password/reset")
    public ResponseEntity<SimpleResponse> resetPassword(@Valid @RequestBody ForgotPasswordResetRequest req) {
        try {
            authService.resetPassword(
                    req.getUsername(),
                    req.getEmail(),
                    req.getAadhaar(),
                    req.getDob(),
                    req.getNewPassword(),
                    req.getConfirmPassword()
            );

            return ResponseEntity.status(HttpStatus.OK)
                    .body(new SimpleResponse(true, "Password updated successfully! Please login.", null));

        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(new SimpleResponse(false, e.getMessage(), null));
        }
    }

    
}

