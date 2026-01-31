package com.bharatteeka.hospital.dto;

import lombok.Data;

@Data
public class CompleteAppointmentRequest {
    private String remarks;
    private String batchNumber;
}
