package com.bharatteeka.auth;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

@SpringBootApplication
public class AuthServiceApplication {

    public static void main(String[] args) {

        SpringApplication.run(AuthServiceApplication.class, args);

        String baseUrl = "http://localhost:8080";

        System.out.println("\n========= AUTH SERVICE ENDPOINTS =========\n");

        // ================= AUTH APIs =================
        System.out.println("AUTH APIs:");
        System.out.println("POST " + baseUrl + "/api/auth/create-account");
        System.out.println("POST " + baseUrl + "/api/auth/complete-registration");
        System.out.println("POST " + baseUrl + "/api/auth/login");

        System.out.println();

        // ================= PATIENT APIs =================
        System.out.println("PATIENT APIs:");
        System.out.println("GET  " + baseUrl + "/auth/patients/{patientId}/basic");

        System.out.println();

        // ================= INFO =================
        System.out.println("SERVICE INFO:");
        System.out.println("Auth Service Running on : " + baseUrl);
        System.out.println("Frontend Login URL     : http://localhost:5173/login");

        System.out.println("\n=========================================\n");
    }
}
