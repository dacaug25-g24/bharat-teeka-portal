package com.bharatteeka.patient.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ChildResponseDto {

	private Integer parentChildId;

	private Integer parentUserId;

	private Integer patientId;

	private Integer relationId;

	private String firstName;
	private String lastName;
	private LocalDate dateOfBirth;
	private String gender;

	private String aadharNumber;
	private String bloodGroup;

	private Boolean isActive;
	private String remarks;
}
