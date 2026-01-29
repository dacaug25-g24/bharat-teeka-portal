package com.bharatteeka.auth.entity;

import jakarta.persistence.*;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;
import lombok.Data;

@Entity
@Table(name = "user")
@Data
public class User {

	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	@Column(name = "user_id")
	private Integer userId;

	// FK to role.role_id in DB (keep as Integer, simple)
	@Column(name = "role_id", nullable = false)
	private Integer roleId;

	@NotBlank(message = "Username is required")
	@Size(min = 3, max = 50, message = "Username must be 3 to 50 characters")
	@Column(name = "username", unique = true, nullable = false, length = 50)
	private String username;

	@NotBlank(message = "Password is required")
	@Size(min = 4, max = 255, message = "Password must be at least 4 characters")
	@Column(name = "password", nullable = false, length = 255)
	private String password;

	@NotBlank(message = "Email is required")
	@Email(message = "Invalid email format")
	@Column(name = "email", nullable = false, length = 100)
	private String email;

	@NotBlank(message = "Phone is required")
	@Pattern(regexp = "^[6-9]\\d{9}$", message = "Phone must be a valid 10-digit Indian number")
	@Column(name = "phone", unique = true, nullable = false, length = 15)
	private String phone;

	@NotBlank(message = "Address is required")
	@Column(name = "address", nullable = false, columnDefinition = "TEXT")
	private String address;

	@Column(name = "is_active")
	private Boolean isActive = true;
}
