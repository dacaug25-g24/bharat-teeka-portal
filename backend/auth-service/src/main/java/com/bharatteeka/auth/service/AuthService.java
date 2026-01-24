package com.bharatteeka.auth.service;

import com.bharatteeka.auth.entity.Patient;
import com.bharatteeka.auth.entity.User;
import com.bharatteeka.auth.repository.PatientRepository;
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

    @Autowired
    private PatientRepository patientRepository;

    // --------------------------
    // Step 1: Create account
    // --------------------------
    public User createAccount(String username, String password, String email, String phone, String address) {
        // Check if username exists
        if (userRepository.findByUsername(username).isPresent()) {
            throw new RuntimeException("Username already exists");
        }
        // Check if email exists
        if (userRepository.findByEmail(email).isPresent()) {
            throw new RuntimeException("Email already exists");
        }
        // Check if phone exists
        if (userRepository.findByPhone(phone).isPresent()) {
            throw new RuntimeException("Phone number already exists");
        }

        // Create user
        User user = new User();
        user.setUsername(username);
        user.setPassword(password); // TODO: encrypt password
        user.setEmail(email);
        user.setPhone(phone);
        user.setAddress(address);
        user.setRoleId(0); // pending registration
        user.setIsActive(false);

        return userRepository.save(user);
    }

    // --------------------------
    // Step 2: Complete registration
    // --------------------------
    public User completeRegistration(
            Integer userId,
            String fullName,
            LocalDate dob,
            String gender,
            String aadhaar,
            String bloodGroup,
            String remarks
    ) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        if (patientRepository.existsByUser_UserId(userId)) {
            throw new RuntimeException("Patient profile already exists");
        }

        // Split full name
        String[] nameParts = fullName.trim().split("\\s+", 2);
        String firstName = nameParts[0];
        String lastName = (nameParts.length > 1) ? nameParts[1] : "NA";

        // Calculate age & role
        int age = calculateAge(dob);
        boolean isAdult = age >= 18;
        int roleId = isAdult ? 3 : 4; // Patient / Parent

        // Create patient
        Patient patient = new Patient();
        patient.setUser(user);
        patient.setFirstName(firstName);
        patient.setLastName(lastName);
        patient.setDateOfBirth(dob);
        patient.setGender(gender);
        patient.setAadhaarNumber(aadhaar);
        patient.setBloodGroup(bloodGroup); // ✅ new field
        patient.setIsAdult(isAdult);
        patient.setIsActive(true);
        patient.setRemarks(remarks);

        patientRepository.save(patient);

        // Update user
        user.setRoleId(roleId);
        user.setIsActive(true);

        return userRepository.save(user);
    }

    // --------------------------
    // Authenticate user
    // --------------------------
    public User authenticate(String username, String password) {
        Optional<User> userOpt = userRepository.findByUsernameAndPassword(username, password);

        if (userOpt.isPresent()) {
            User user = userOpt.get();
            if (!user.getIsActive()) {
                throw new RuntimeException("Account not activated. Please complete registration.");
            }
            return user;
        }

        if (userRepository.findByUsername(username).isPresent()) {
            throw new RuntimeException("Incorrect password");
        }

        throw new RuntimeException("User not found");
    }

    // --------------------------
    // Helper: calculate age
    // --------------------------
    private int calculateAge(LocalDate dob) {
        if (dob == null) throw new RuntimeException("Date of birth is required");

        LocalDate today = LocalDate.now();
        if (dob.isAfter(today)) throw new RuntimeException("Date of birth cannot be in the future");

        return Period.between(dob, today).getYears();
    }

    // --------------------------
    // Optional: check if user exists
    // --------------------------
    public boolean userExists(Integer userId) {
        return userRepository.existsById(userId);
    }
}
