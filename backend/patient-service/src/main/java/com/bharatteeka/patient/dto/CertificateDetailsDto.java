package com.bharatteeka.patient.dto;

import lombok.Builder;
import lombok.Data;

import java.time.LocalDate;

@Data
@Builder
public class CertificateDetailsDto {
    private Integer patientId;
    private String patientName;
    private String aadhaarOrGovId;
    private Integer appointmentId;

    private String vaccineName;
    private Integer doseNumber;
    private String batchNumber;
    private LocalDate vaccinationDate;

    private String hospitalName;
    private String hospitalAddress;

    private String remarks;
}
