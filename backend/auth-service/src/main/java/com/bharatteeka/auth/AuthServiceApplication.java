package com.bharatteeka.auth;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

@SpringBootApplication
public class AuthServiceApplication {
    public static void main(String[] args) {
        SpringApplication.run(AuthServiceApplication.class, args);
        System.out.println("==============================================");
        System.out.println(" Bharat Teeka Portal - Auth Service Started");
        System.out.println("==============================================");
        System.out.println("API Endpoints:");
        System.out.println("1. Test Connection: http://localhost:8080/api/auth/test");
        System.out.println("2. Login: POST http://localhost:8080/api/auth/login");
        System.out.println("3. Get all test users: http://localhost:8080/api/auth/test-users");
        System.out.println("==============================================");
        System.out.println("Frontend URL: http://localhost:5173/login");
        System.out.println("==============================================");
    }
}