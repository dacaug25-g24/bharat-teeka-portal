package com.bharatteeka.auth.service;

import com.bharatteeka.auth.entity.User;
import com.bharatteeka.auth.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.time.LocalDate;
import java.time.Period;
import java.util.Optional;

@Service
public class AuthService {
    
    @Autowired
    private UserRepository userRepository;
    
    // Step 1: Create account (basic info)
    public User createAccount(String username, String password, String email, String phone, String address) {
        // Check if username exists
        Optional<User> existingUser = userRepository.findByUsername(username);
        if (existingUser.isPresent()) {
            throw new RuntimeException("Username already exists");
        }
        
        // Check if email exists
        existingUser = userRepository.findByEmail(email);
        if (existingUser.isPresent()) {
            throw new RuntimeException("Email already exists");
        }
        
        // Check if phone exists
        existingUser = userRepository.findByPhone(phone);
        if (existingUser.isPresent()) {
            throw new RuntimeException("Phone number already exists");
        }
        
        // Create user with role_id = 0 (pending) and is_active = false
        User user = new User();
        user.setUsername(username);
        user.setPassword(password); // In production, encrypt this!
        user.setEmail(email);
        user.setPhone(phone);
        user.setAddress(address); // Just address in step 1
        user.setRoleId(0); // 0 = pending registration
        user.setIsActive(false); // Not active until registration complete
        
        return userRepository.save(user);
    }
    
    // Step 2: Complete registration with personal info
    public User completeRegistration(Integer userId, String fullName, LocalDate dob, 
                                     String gender, String aadhaar, String remarks) {
        
        Optional<User> userOpt = userRepository.findById(userId);
        if (userOpt.isEmpty()) {
            throw new RuntimeException("User not found with ID: " + userId);
        }
        
        User user = userOpt.get();
        
        // Check if user is already active
        if (user.getIsActive() != null && user.getIsActive()) {
            throw new RuntimeException("User is already registered and active");
        }
        
        // Calculate age from DOB
        int age = calculateAge(dob);
        
        // Determine role based on age
        // If age < 18 → Parent (role_id=4), else Patient (role_id=3)
        Integer roleId = (age < 18) ? 4 : 3;
        
        // Format address with all info
        // Original address + personal info concatenated
        String formattedAddress = String.format(
            "%s | Personal Info: Full Name: %s, DOB: %s, Gender: %s, Aadhaar: %s, Remarks: %s",
            user.getAddress(), fullName, dob.toString(), gender, 
            (aadhaar != null ? aadhaar : "Not provided"), 
            (remarks != null ? remarks : "None")
        );
        
        // Update user
        user.setRoleId(roleId);
        user.setAddress(formattedAddress);
        user.setIsActive(true);
        
        return userRepository.save(user);
    }
    
    // Login (existing)
    public User authenticate(String username, String password) {
        Optional<User> userOpt = userRepository.findByUsernameAndPassword(username, password);
        
        if (userOpt.isPresent()) {
            User user = userOpt.get();
            
            // Check if user is active
            if (user.getIsActive() != null && !user.getIsActive()) {
                throw new RuntimeException("Account not activated. Please complete registration.");
            }
            
            // Update last login (if you had this field)
            // user.setLastLogin(new Date());
            // userRepository.save(user);
            
            return user;
        }
        
        // If not found by username and password, check if username exists
        if (userRepository.findByUsername(username).isPresent()) {
            throw new RuntimeException("Incorrect password");
        }
        
        throw new RuntimeException("User not found");
    }
    
    // Helper method to calculate age
    private int calculateAge(LocalDate dob) {
        if (dob == null) {
            throw new RuntimeException("Date of birth is required");
        }
        
        LocalDate currentDate = LocalDate.now();
        
        // Check if dob is in the future
        if (dob.isAfter(currentDate)) {
            throw new RuntimeException("Date of birth cannot be in the future");
        }
        
        return Period.between(dob, currentDate).getYears();
    }
    
    // Optional: Check if user exists by ID
    public boolean userExists(Integer userId) {
        return userRepository.existsById(userId);
    }
}