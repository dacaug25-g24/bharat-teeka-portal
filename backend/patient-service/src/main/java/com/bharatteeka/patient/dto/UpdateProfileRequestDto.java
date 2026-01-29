package com.bharatteeka.patient.dto;

import lombok.*;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class UpdateProfileRequestDto {
	private Integer userId;
	private String phone;
	private String address;
	private String remarks;
}
