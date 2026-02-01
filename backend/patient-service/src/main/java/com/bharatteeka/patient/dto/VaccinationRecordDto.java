package com.bharatteeka.patient.dto;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import lombok.Data;

import java.time.LocalDate;

@Data
@JsonIgnoreProperties(ignoreUnknown = true)
public class VaccinationRecordDto {
    private Integer recordId;
    private AppointmentRef appointment; // hospital-service appointment object
    private Integer patientId;
    private HospitalRef hospital;
    private SlotRef slot;
    private VaccineRef vaccine;
    private Integer doseNumber;
    private String batchNumber;
    private LocalDate vaccinationDate;
    private String remarks;

    @Data
    @JsonIgnoreProperties(ignoreUnknown = true)
    public static class AppointmentRef {
        private Integer appointmentId;
    }

    @Data
    @JsonIgnoreProperties(ignoreUnknown = true)
    public static class HospitalRef {
        private Integer hospitalId;
        private String hospitalName;
        private String address;
    }

    @Data
    @JsonIgnoreProperties(ignoreUnknown = true)
    public static class SlotRef {
        private Integer slotId;
    }

    @Data
    @JsonIgnoreProperties(ignoreUnknown = true)
    public static class VaccineRef {
        private Integer vaccineId;
        private String vaccineName;
        private String manufacturer;
        private String vaccineType;
    }
}
