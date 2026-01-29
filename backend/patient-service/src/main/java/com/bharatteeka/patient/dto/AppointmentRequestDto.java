package com.bharatteeka.patient.dto;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class AppointmentRequestDto {

	@NotNull(message = "patientId is required")
	private Integer patientId;

	private Integer parentUserId;

	@NotNull(message = "slotId is required")
	private Integer slotId;

	@NotNull(message = "doseNumber is required")
	@Min(value = 1, message = "doseNumber must be >= 1")
	private Integer doseNumber;

	private String remarks;

	private Integer vaccineId;

}
