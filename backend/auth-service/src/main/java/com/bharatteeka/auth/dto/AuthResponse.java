package com.bharatteeka.auth.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class AuthResponse {
    private boolean success;
    private String message;
    private UserData user;
    private String token;

    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    public static class UserData {
        private Integer userId;
        private String username;
        private Integer roleId;
        private String roleName;
        private String email;
        private String phone;
        private String address;

        private Integer hospitalId;
    }
}
