package com.bharatteeka.patient.entity;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDate;

@Entity
@Table(name = "patient", uniqueConstraints = @UniqueConstraint(name = "uk_patient_aadhar", columnNames = "aadhar_number"))
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Patient {

	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	@Column(name = "patient_id")
	private Integer patientId;

	@Column(name = "user_id")
	private Integer userId;

	@Column(name = "first_name", nullable = false, length = 50)
	private String firstName;

	@Column(name = "last_name", nullable = false, length = 50)
	private String lastName;

	@Column(name = "date_of_birth", nullable = false)
	private LocalDate dateOfBirth;

	@Column(name = "gender", nullable = false)
	private String gender;

	@Column(name = "aadhar_number", nullable = false, length = 12)
	private String aadharNumber;

	@Column(name = "blood_group", nullable = false, length = 5)
	private String bloodGroup;
	@Column(name = "is_adult")
	private Boolean isAdult = false;

	@Column(name = "is_active")
	private Boolean isActive = true;

	@Lob
	@Column(name = "remarks")
	private String remarks;
}
