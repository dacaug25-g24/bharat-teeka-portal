package com.bharatteeka.patient.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class AppointmentResponseDto {
	private boolean success;
	private String message;
	private Integer appointmentId;
	private String status;
}
