package com.bharatteeka.auth.dto;

import jakarta.validation.constraints.*;
import lombok.Data;

@Data
public class CompleteRegistrationRequest {
    @NotNull(message = "User ID is required")
    private Integer userId;
    
    @NotBlank(message = "Full name is required")
    @Size(min = 3, max = 100, message = "Full name must be between 3 and 100 characters")
    private String fullName;
    
    @NotBlank(message = "Date of birth is required")
    @Pattern(regexp = "^\\d{4}-\\d{2}-\\d{2}$", message = "Date must be in YYYY-MM-DD format")
    private String dateOfBirth;
    
    @NotBlank(message = "Gender is required")
    private String gender;
    
    // Make Aadhaar truly optional - remove @Size and use custom validation
    private String aadhaarNumber;
    
    @Size(max = 500, message = "Remarks cannot exceed 500 characters")
    private String remarks;
}