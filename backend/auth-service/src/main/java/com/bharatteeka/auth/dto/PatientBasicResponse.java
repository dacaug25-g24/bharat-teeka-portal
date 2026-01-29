package com.bharatteeka.auth.dto;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class PatientBasicResponse {
    private Integer patientId;
    private String fullName;
    private String aadhaarNumber;
}
