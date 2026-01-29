package com.bharatteeka.hospital.dto;

public class PatientBasicResponse {
    private Integer patientId;
    private String fullName;
    private String aadhaarNumber;

    public PatientBasicResponse() {}

    public PatientBasicResponse(Integer patientId, String fullName, String aadhaarNumber) {
        this.patientId = patientId;
        this.fullName = fullName;
        this.aadhaarNumber = aadhaarNumber;
    }

    public Integer getPatientId() {
        return patientId;
    }

    public void setPatientId(Integer patientId) {
        this.patientId = patientId;
    }

    public String getFullName() {
        return fullName;
    }

    public void setFullName(String fullName) {
        this.fullName = fullName;
    }

    public String getAadhaarNumber() {
        return aadhaarNumber;
    }

    public void setAadhaarNumber(String aadhaarNumber) {
        this.aadhaarNumber = aadhaarNumber;
    }
}
