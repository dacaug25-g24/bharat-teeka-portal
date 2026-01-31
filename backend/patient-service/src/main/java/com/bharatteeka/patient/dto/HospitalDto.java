package com.bharatteeka.patient.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class HospitalDto {
	private Integer hospitalId;
	private String hospitalName;
	private String hospitalType;
	private Integer cityId;
}
