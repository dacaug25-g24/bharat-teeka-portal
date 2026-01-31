package com.bharatteeka.patient.dto;

import lombok.*;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ProfileResponseDto {
	private Integer userId;
	private Integer patientId;
	private String username;
	private String email;
	private String phone;
	private String address;
	private String remarks;
}
