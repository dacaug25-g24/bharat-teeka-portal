package com.bharatteeka.auth.controller;

import com.bharatteeka.auth.dto.AuthResponse;
import com.bharatteeka.auth.dto.LoginRequest;
import com.bharatteeka.auth.dto.RegisterRequest;
import com.bharatteeka.auth.entity.Hospital;
import com.bharatteeka.auth.entity.User;
import com.bharatteeka.auth.repository.HospitalRepository;
import com.bharatteeka.auth.service.AuthService;

import jakarta.validation.Valid;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/auth")
@CrossOrigin(origins = "*")
public class AuthController {

	@Autowired
	private AuthService authService;
	@Autowired
    private HospitalRepository hospitalRepository;

	@PostMapping("/register")
	public ResponseEntity<AuthResponse> register(@Valid @RequestBody RegisterRequest request) {
		try {
			User user = authService.registerPatient(request.getUsername(), request.getPassword(), request.getEmail(),
					request.getPhone(), request.getAddress(), request.getFirstName(), request.getLastName(),
					LocalDate.parse(request.getDateOfBirth()), request.getGender(), request.getAadhaarNumber(),
					request.getBloodGroup(), request.getRemarks());

			String roleName = getRoleName(user.getRoleId());

			AuthResponse.UserData userData = new AuthResponse.UserData(user.getUserId(), user.getUsername(),
					user.getRoleId(), roleName, user.getEmail(), user.getPhone(), user.getAddress(),null);

			return ResponseEntity.ok(new AuthResponse(true, "Registration successful! Please login.", userData));

		} catch (Exception e) {
			return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(new AuthResponse(false, e.getMessage(), null));
		}
	}

//	@PostMapping("/login")
//	public ResponseEntity<AuthResponse> login(@Valid @RequestBody LoginRequest request) {
//		try {
//			User user = authService.login(request.getUsername(), request.getPassword());
//
//			String roleName = getRoleName(user.getRoleId());
//
//			AuthResponse.UserData userData = new AuthResponse.UserData(user.getUserId(), user.getUsername(),
//					user.getRoleId(), roleName, user.getEmail(), user.getPhone(), user.getAddress());
//
//			return ResponseEntity.ok(new AuthResponse(true, "Login successful!", userData));
//
//		} catch (Exception e) {
//			return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(new AuthResponse(false, e.getMessage(), null));
//		}
//	}
	
	@PostMapping("/login")
	public ResponseEntity<AuthResponse> login(@Valid @RequestBody LoginRequest request) {
	    try {
	        User user = authService.login(request.getUsername(), request.getPassword());

	        String roleName = getRoleName(user.getRoleId());

	        Integer hospitalId = null;
	        if (user.getRoleId() != null && user.getRoleId() == 2) { // Hospital
	            Hospital hospital = hospitalRepository.findByUserUserId(user.getUserId());
	            if (hospital != null) hospitalId = hospital.getHospitalId();
	        }

	        AuthResponse.UserData userData = new AuthResponse.UserData(
	                user.getUserId(),
	                user.getUsername(),
	                user.getRoleId(),
	                roleName,
	                user.getEmail(),
	                user.getPhone(),
	                user.getAddress(),
	                hospitalId // ✅ now goes inside user
	        );

	        return ResponseEntity.ok(new AuthResponse(true, "Login successful!", userData));

	    } catch (Exception e) {
	        return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
	                .body(new AuthResponse(false, e.getMessage(), null));
	    }
	}



	private String getRoleName(Integer roleId) {
		if (roleId == null)
			return "Unknown";
		return switch (roleId) {
		case 1 -> "Admin";
		case 2 -> "Hospital";
		case 3 -> "Patient";
		case 4 -> "Parent";
		case 0 -> "Pending";
		default -> "Unknown";
		};
	}
}
