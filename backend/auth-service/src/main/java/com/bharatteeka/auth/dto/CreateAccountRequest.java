package com.bharatteeka.auth.dto;

import lombok.Data;

@Data
public class CreateAccountRequest {
    private String username;
    private String password;
    private String email;
    private String phone;
    private String address;
}