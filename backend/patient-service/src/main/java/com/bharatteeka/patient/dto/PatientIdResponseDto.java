package com.bharatteeka.patient.dto;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class PatientIdResponseDto {
	private Integer userId;
	private Integer patientId;
}
