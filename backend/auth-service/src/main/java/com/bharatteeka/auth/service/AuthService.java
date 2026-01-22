package com.bharatteeka.auth.service;

import com.bharatteeka.auth.entity.User;
import com.bharatteeka.auth.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class AuthService {
    
    @Autowired
    private UserRepository userRepository;
    
    public User authenticate(String username, String password) {
        // First try to find user by username and password (plain text match)
        var userOpt = userRepository.findByUsernameAndPassword(username, password);
        
        if (userOpt.isPresent()) {
            User user = userOpt.get();
            
            // Check if user is active
            if (user.getIsActive() == null || user.getIsActive()) {
                return user;
            } else {
                throw new RuntimeException("Account is inactive. Please contact administrator.");
            }
        }
        
        // If not found, check if username exists (for better error message)
        if (userRepository.findByUsername(username).isPresent()) {
            throw new RuntimeException("Incorrect password");
        }
        
        throw new RuntimeException("User not found");
    }
    
    // Get all users for testing
    public java.util.List<User> getAllUsers() {
        return userRepository.findAll();
    }
}