package com.bharatteeka.auth.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class LoginResponse {
    private boolean success;
    private String message;
    private UserData user;
    
    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    public static class UserData {
        private Integer userId;
        private String username;
        private Integer roleId;
        private String email;
        private String phone;
        private String address;
        private String roleName;
    }
}