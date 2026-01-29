package com.bharatteeka.auth.entity;

import java.time.LocalDate;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;
import lombok.Data;

@Entity
@Table(name = "patient")
@Data
public class Patient {

	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	@Column(name = "patient_id")
	private Integer patientId;

	@ManyToOne(optional = true, fetch = FetchType.LAZY)
	@JoinColumn(name = "user_id", nullable = true)
	private User user;

	@NotBlank(message = "First name is required")
	@Size(max = 50, message = "First name max 50 characters")
	@Column(name = "first_name", nullable = false, length = 50)
	private String firstName;

	@NotBlank(message = "Last name is required")
	@Size(max = 50, message = "Last name max 50 characters")
	@Column(name = "last_name", nullable = false, length = 50)
	private String lastName;

	@NotNull(message = "Date of birth is required")
	@Column(name = "date_of_birth", nullable = false)
	private LocalDate dateOfBirth;

	@NotBlank(message = "Gender is required")
	@Column(name = "gender", nullable = false)
	private String gender;

	@NotBlank(message = "Aadhaar number is required")
	@Pattern(regexp = "^\\d{12}$", message = "Aadhaar must be exactly 12 digits")
	@Column(name = "aadhar_number", nullable = false, unique = true, length = 12)
	private String aadhaarNumber;

	@NotBlank(message = "Blood group is required")
	@Size(max = 5, message = "Blood group max 5 characters")
	@Column(name = "blood_group", nullable = false, length = 5)
	private String bloodGroup;

	@Column(name = "is_adult")
	private Boolean isAdult = false;

	@Column(name = "is_active")
	private Boolean isActive = true;

	@Column(name = "remarks", columnDefinition = "TEXT")
	private String remarks;
}
