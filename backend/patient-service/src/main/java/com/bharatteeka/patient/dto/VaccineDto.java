package com.bharatteeka.patient.dto;

import lombok.Data;

@Data
public class VaccineDto {
	private Integer vaccineId;
	private String vaccineName;
	private String manufacturer;
	private String vaccineType;
}
