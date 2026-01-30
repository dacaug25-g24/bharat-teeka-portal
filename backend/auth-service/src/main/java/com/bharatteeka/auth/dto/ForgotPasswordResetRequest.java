package com.bharatteeka.auth.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public class ForgotPasswordResetRequest extends ForgotPasswordVerifyRequest {

    @NotBlank
    @Size(min = 6, message = "Password must be at least 6 characters")
    private String newPassword;

    @NotBlank
    private String confirmPassword;

    public String getNewPassword() { return newPassword; }
    public void setNewPassword(String newPassword) { this.newPassword = newPassword; }

    public String getConfirmPassword() { return confirmPassword; }
    public void setConfirmPassword(String confirmPassword) { this.confirmPassword = confirmPassword; }
}
