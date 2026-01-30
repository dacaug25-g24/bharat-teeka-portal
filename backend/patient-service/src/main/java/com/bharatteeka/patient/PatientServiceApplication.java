package com.bharatteeka.patient;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

@SpringBootApplication
public class PatientServiceApplication {

    public static void main(String[] args) {

        SpringApplication.run(PatientServiceApplication.class, args);

        String baseUrl = "http://localhost:8082";

        System.out.println("\n========= PATIENT SERVICE ENDPOINTS =========\n");

        // ================= APPOINTMENT APIs =================
        System.out.println("APPOINTMENT APIs:");
        System.out.println("POST " + baseUrl + "/api/appointments");
        System.out.println("GET  " + baseUrl + "/api/appointments/details?patientId={patientId}&parentUserId={parentUserId(optional)}");
        System.out.println("PUT  " + baseUrl + "/api/appointments/{appointmentId}/cancel?parentUserId={parentUserId(optional)}");
        System.out.println("GET  " + baseUrl + "/api/appointments?patientId={patientId}&parentUserId={parentUserId(optional)}");

        System.out.println();

        // ================= PARENT / CHILD APIs =================
        System.out.println("PARENT (CHILD) APIs:");
        System.out.println("POST   " + baseUrl + "/api/parent/children?parentUserId={parentUserId}");
        System.out.println("GET    " + baseUrl + "/api/parent/children?parentUserId={parentUserId}");
        System.out.println("DELETE " + baseUrl + "/api/parent/children/{patientId}?parentUserId={parentUserId}");

        System.out.println();

        // ================= LOCATION APIs =================
        System.out.println("LOCATION APIs:");
        System.out.println("GET " + baseUrl + "/api/locations/states");
        System.out.println("GET " + baseUrl + "/api/locations/cities?stateId={stateId}");
        System.out.println("GET " + baseUrl + "/api/locations/hospitals?cityId={cityId}&hospitalType={hospitalType(optional)}");

        System.out.println();

        // ================= PATIENT LOOKUP APIs =================
        System.out.println("PATIENT APIs:");
        System.out.println("GET " + baseUrl + "/api/patients/by-user?userId={userId}");

        System.out.println();

        // ================= PROFILE APIs =================
        System.out.println("PROFILE APIs:");
        System.out.println("GET " + baseUrl + "/api/profile?userId={userId}");
        System.out.println("PUT " + baseUrl + "/api/profile");

        System.out.println();

        // ================= SLOT APIs =================
        System.out.println("SLOT APIs:");
        System.out.println("GET " + baseUrl + "/api/slots/available?hospitalId={hospitalId}&date={yyyy-MM-dd}&vaccineId={vaccineId(optional)}");
        System.out.println("GET " + baseUrl + "/api/slots/{slotId}");

        System.out.println();

        // ================= VACCINE APIs =================
        System.out.println("VACCINE APIs:");
        System.out.println("GET " + baseUrl + "/api/vaccines/by-hospital?hospitalId={hospitalId}&date={yyyy-MM-dd(optional)}");

        System.out.println();

        // ================= INFO =================
        System.out.println("SERVICE INFO:");
        System.out.println("Patient Service Running on : " + baseUrl);

        System.out.println("\n===========================================\n");
    }
}
