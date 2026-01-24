package com.bharatteeka.hospital;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

@SpringBootApplication
public class HospitalServiceApplication {

    public static void main(String[] args) {

        SpringApplication.run(HospitalServiceApplication.class, args);

        String baseUrl = "http://localhost:8082";

        System.out.println("\n========= HOSPITAL SERVICE ENDPOINTS =========\n");

        // ================= APPOINTMENT APIs =================
        System.out.println("APPOINTMENT APIs:");
        System.out.println("GET  " + baseUrl + "/hospital/appointments");
        System.out.println("GET  " + baseUrl + "/hospital/appointments/today");
        System.out.println("GET  " + baseUrl + "/hospital/appointments/patient/{patientId}");
        System.out.println("PUT  " + baseUrl + "/hospital/appointments/{id}/complete?remarks=...");

        System.out.println();

        // ================= SLOT APIs =================
        System.out.println("SLOT APIs:");
        System.out.println("GET  " + baseUrl + "/hospital/slots/date/{date}/hospital/{hospitalId}");
        System.out.println("GET  " + baseUrl + "/hospital/slots/search?hospitalId=1&date=YYYY-MM-DD&time=HH:mm");

        System.out.println();

        // ================= VACCINE APIs =================
        System.out.println("VACCINE APIs:");
        System.out.println("GET  " + baseUrl + "/hospital/vaccines");
        System.out.println("GET  " + baseUrl + "/hospital/vaccines/{id}");

        System.out.println("\n=============================================\n");
    }
}
