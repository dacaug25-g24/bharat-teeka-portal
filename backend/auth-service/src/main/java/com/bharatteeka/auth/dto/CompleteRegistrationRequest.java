package com.bharatteeka.auth.dto;

import lombok.Data;

@Data
public class CompleteRegistrationRequest {
    private Integer userId;        // From step 1
    private String fullName;       // Will be stored in address field
    private String dateOfBirth;    // Format: YYYY-MM-DD
    private String gender;         // Will be stored in address field
    private String aadhaarNumber;  // Will be stored in address field
    private String remarks;        // Will be stored in address field
}