package com.bharatteeka.auth.dto;

import jakarta.validation.constraints.*;
import lombok.Data;

@Data
public class RegisterRequest {

	@NotBlank(message = "Username is required")
	@Size(min = 3, max = 50, message = "Username must be between 3 and 50 characters")
	private String username;

	@NotBlank(message = "Password is required")
	@Size(min = 6, max = 255, message = "Password must be at least 6 characters")
	private String password;

	@NotBlank(message = "Email is required")
	@Email(message = "Invalid email format")
	@Size(max = 100, message = "Email max 100 characters")
	private String email;

	@NotBlank(message = "Phone is required")
	@Pattern(regexp = "^[6-9]\\d{9}$", message = "Invalid Indian phone number")
	private String phone;

	@NotBlank(message = "Address is required")
	@Size(min = 5, max = 500, message = "Address must be between 5 and 500 characters")
	private String address;

	@NotBlank(message = "First name is required")
	@Size(max = 50, message = "First name max 50 characters")
	private String firstName;

	@NotBlank(message = "Last name is required")
	@Size(max = 50, message = "Last name max 50 characters")
	private String lastName;

	@NotBlank(message = "Date of birth is required")
	@Pattern(regexp = "^\\d{4}-\\d{2}-\\d{2}$", message = "Date must be in YYYY-MM-DD format")
	private String dateOfBirth;

	@NotBlank(message = "Gender is required")
	@Pattern(regexp = "^(Male|Female|Other)$", message = "Gender must be Male, Female, or Other")
	private String gender;

	@NotBlank(message = "Aadhaar number is required")
	@Pattern(regexp = "^\\d{12}$", message = "Aadhaar must be exactly 12 digits")
	private String aadhaarNumber;

	@NotBlank(message = "Blood group is required")
	@Size(max = 5, message = "Blood group max 5 characters")
	private String bloodGroup;

	@Size(max = 500, message = "Remarks cannot exceed 500 characters")
	private String remarks;
}
