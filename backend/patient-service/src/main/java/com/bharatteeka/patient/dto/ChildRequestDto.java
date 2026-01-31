package com.bharatteeka.patient.dto;

import lombok.Data;

import java.time.LocalDate;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Pattern;

@Data
public class ChildRequestDto {

	@NotBlank(message = "firstName is required")
	private String firstName;

	@NotBlank(message = "lastName is required")
	private String lastName;

	@NotNull(message = "dateOfBirth is required")
	private LocalDate dateOfBirth;

	@NotBlank(message = "gender is required")
	private String gender;

	@NotBlank(message = "aadharNumber is required")
	@Pattern(regexp = "^\\d{12}$", message = "aadharNumber must be exactly 12 digits")
	private String aadharNumber;

	@NotBlank(message = "bloodGroup is required")
	private String bloodGroup;

	@NotNull(message = "relationId is required")
	private Integer relationId;

	private String remarks;
}
