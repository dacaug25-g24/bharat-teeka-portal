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
        System.out.println("1. Test Connection: GET http://localhost:8080/api/auth/test");
        System.out.println("2. Check DB: GET http://localhost:8080/api/auth/check-db");
        System.out.println("3. Test Users: GET http://localhost:8080/api/auth/test-users");
        System.out.println("4. All Users: GET http://localhost:8080/api/auth/all-users");
        System.out.println("5. Create Account: POST http://localhost:8080/api/auth/create-account");
        System.out.println("6. Login: POST http://localhost:8080/api/auth/login");
        System.out.println("7. Complete Reg: POST http://localhost:8080/api/auth/complete-registration");
        System.out.println("==============================================");
        System.out.println("Frontend URL: http://localhost:5173");
        System.out.println("Database: p24_bharat_teeka_portal");
        System.out.println("==============================================");
    }
}