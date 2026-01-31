package com.bharatteeka.patient.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;
import java.time.LocalTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class AppointmentDetailsDto {

	private Integer appointmentId;
	private Integer patientId;

	private Integer hospitalId;
	private String hospitalName;

	private Integer slotId;
	private Integer doseNumber;

	private LocalDate bookingDate;
	private LocalTime bookingTime;

	private String status;
	private String remarks;

	private LocalDate slotDate;
	private LocalTime startTime;
	private LocalTime endTime;
	private Integer capacity;
	private Integer bookedCount;

	private Integer vaccineId;
	private String vaccineName;
}
