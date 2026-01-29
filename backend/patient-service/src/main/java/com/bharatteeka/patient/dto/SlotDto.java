package com.bharatteeka.patient.dto;

import lombok.Data;

import java.time.LocalDate;
import java.time.LocalTime;

@Data
public class SlotDto {
	private Integer slotId;
	private LocalDate date;
	private LocalTime startTime;
	private LocalTime endTime;
	private Integer capacity;
	private Integer bookedCount;

	private HospitalMiniDto hospital;
	private VaccineDto vaccine;

	@Data
	public static class HospitalMiniDto {
		private Integer hospitalId;
		private String hospitalName;
	}
}
