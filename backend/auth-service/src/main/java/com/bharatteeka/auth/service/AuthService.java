package com.bharatteeka.auth.service;

import com.bharatteeka.auth.entity.Patient;
import com.bharatteeka.auth.entity.User;
import com.bharatteeka.auth.repository.PatientRepository;
import com.bharatteeka.auth.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;

@Service
public class AuthService {

	@Autowired
	private UserRepository userRepository;

	@Autowired
	private PatientRepository patientRepository;

	@Transactional
	public User registerPatient(String username, String password, String email, String phone, String address,
			String firstName, String lastName, LocalDate dateOfBirth, String gender, String aadhaarNumber,
			String bloodGroup, String remarks) {

		if (isBlank(username) || username.trim().length() < 3) {
			throw new RuntimeException("Username must be at least 3 characters");
		}
		if (isBlank(password) || password.length() < 6) {
			throw new RuntimeException("Password must be at least 6 characters");
		}
		if (isBlank(email)) {
			throw new RuntimeException("Email is required");
		}
		if (isBlank(phone)) {
			throw new RuntimeException("Phone is required");
		}
		if (isBlank(address)) {
			throw new RuntimeException("Address is required");
		}
		if (isBlank(firstName)) {
			throw new RuntimeException("First name is required");
		}
		if (isBlank(lastName)) {
			throw new RuntimeException("Last name is required");
		}
		if (dateOfBirth == null) {
			throw new RuntimeException("Date of birth is required");
		}
		if (isBlank(gender)) {
			throw new RuntimeException("Gender is required");
		}

		if (isBlank(aadhaarNumber) || !aadhaarNumber.matches("^\\d{12}$")) {
			throw new RuntimeException("Aadhaar must be exactly 12 digits");
		}
		if (isBlank(bloodGroup)) {
			throw new RuntimeException("Blood group is required");
		}

		if (userRepository.existsByUsername(username.trim())) {
			throw new RuntimeException("Username already exists");
		}
		if (userRepository.existsByEmail(email.trim())) {
			throw new RuntimeException("Email already exists");
		}
		if (userRepository.existsByPhone(phone.trim())) {
			throw new RuntimeException("Phone number already exists");
		}

		User user = new User();

		user.setRoleId(4);

		user.setUsername(username.trim());
		user.setPassword(password);
		user.setEmail(email.trim());
		user.setPhone(phone.trim());
		user.setAddress(address.trim());
		user.setIsActive(true);

		User savedUser = userRepository.save(user);

		Patient patient = new Patient();
		patient.setUser(savedUser);
		patient.setFirstName(firstName.trim());
		patient.setLastName(lastName.trim());
		patient.setDateOfBirth(dateOfBirth);
		patient.setGender(gender);
		patient.setAadhaarNumber(aadhaarNumber.trim());
		patient.setBloodGroup(bloodGroup);
		patient.setIsAdult(true);
		patient.setIsActive(true);
		patient.setRemarks(isBlank(remarks) ? null : remarks.trim());

		patientRepository.save(patient);

		return savedUser;
	}

	public User login(String username, String password) {
		if (isBlank(username) || isBlank(password)) {
			throw new RuntimeException("Username and password are required");
		}

		User user = userRepository.findByUsername(username.trim())
				.orElseThrow(() -> new RuntimeException("User not found"));

		if (Boolean.FALSE.equals(user.getIsActive())) {
			throw new RuntimeException("Account is inactive");
		}

		if (!user.getPassword().equals(password)) {
			throw new RuntimeException("Incorrect password");
		}

		return user;
	}

	private boolean isBlank(String s) {
		return s == null || s.trim().isEmpty();
	}
}
