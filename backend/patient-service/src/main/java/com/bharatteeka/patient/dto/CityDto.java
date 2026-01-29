package com.bharatteeka.patient.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class CityDto {
	private Integer cityId;
	private String cityName;
	private Integer stateId;
}
