package com.bharatteeka.auth.dto;

public class SimpleResponse {
    private boolean success;
    private String message;
    private Boolean verified; // optional

    public SimpleResponse() {}

    public SimpleResponse(boolean success, String message) {
        this.success = success;
        this.message = message;
    }

    public SimpleResponse(boolean success, String message, Boolean verified) {
        this.success = success;
        this.message = message;
        this.verified = verified;
    }

    public boolean isSuccess() { return success; }
    public void setSuccess(boolean success) { this.success = success; }

    public String getMessage() { return message; }
    public void setMessage(String message) { this.message = message; }

    public Boolean getVerified() { return verified; }
    public void setVerified(Boolean verified) { this.verified = verified; }
}
