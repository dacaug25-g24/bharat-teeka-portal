package com.bharatteeka.hospital;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

@SpringBootApplication
public class HospitalServiceApplication {

    public static void main(String[] args) {

        SpringApplication.run(HospitalServiceApplication.class, args);

        String baseUrl = "http://localhost:8081";

        System.out.println("\n========= HOSPITAL SERVICE ENDPOINTS =========\n");

        // ================= APPOINTMENT APIs =================
        System.out.println("APPOINTMENT APIs:");
        System.out.println("GET   " + baseUrl + "/hospital/appointments");
        System.out.println("GET   " + baseUrl + "/hospital/appointments/patient/{patientId}");
        System.out.println("GET   " + baseUrl + "/hospital/appointments/hospital/{hospitalId}");
        System.out.println("GET   " + baseUrl + "/hospital/appointments/hospital/{hospitalId}?date=YYYY-MM-DD");
        System.out.println("GET   " + baseUrl + "/hospital/appointments/hospital/{hospitalId}/today");
        System.out.println("PUT   " + baseUrl + "/hospital/appointments/{id}/complete?remarks=YourRemarksHere");
        System.out.println("PUT   " + baseUrl + "/hospital/appointments/{id}/complete-details   (JSON body: { remarks, batchNumber })");
        System.out.println("PUT   " + baseUrl + "/hospital/appointments/{id}/cancel?reason=CancelReasonHere");

        System.out.println();

        // ================= SLOT APIs =================
        System.out.println("SLOT APIs:");
        System.out.println("GET   " + baseUrl + "/hospital/slots?hospitalId={hospitalId}&date=YYYY-MM-DD");
        System.out.println("GET   " + baseUrl + "/hospital/slots/by-time?hospitalId={hospitalId}&date=YYYY-MM-DD&time=HH:mm");
        System.out.println("GET   " + baseUrl + "/hospital/slots/available?hospitalId={hospitalId}&date=YYYY-MM-DD");
        System.out.println("GET   " + baseUrl + "/hospital/slots/by-vaccine?hospitalId={hospitalId}&vaccineId={vaccineId}&date=YYYY-MM-DD");
        System.out.println("POST  " + baseUrl + "/hospital/slots   (JSON body: SlotRequest)");
        System.out.println("PUT   " + baseUrl + "/hospital/slots/{slotId}   (JSON body: SlotRequest)");
        System.out.println("DELETE " + baseUrl + "/hospital/slots/{slotId}");

        System.out.println();

        // ================= VACCINATION APIs =================
        System.out.println("VACCINATION APIs:");
        System.out.println("GET   " + baseUrl + "/hospital/vaccinations/patient/{patientId}");
        System.out.println("GET   " + baseUrl + "/hospital/vaccinations/hospital/{hospitalId}?from=YYYY-MM-DD&to=YYYY-MM-DD");

        System.out.println();

        // ================= VACCINATION REPORT APIs =================
        System.out.println("VACCINATION REPORT APIs:");
        System.out.println("GET   " + baseUrl
                + "/hospital/vaccinations/report/pdf"
                + "?hospitalId={hospitalId}"
                + "&from=YYYY-MM-DD"
                + "&to=YYYY-MM-DD"
                + "&hospitalName=YourHospitalName(optional)");

        System.out.println();

        // ================= VACCINE APIs =================
        System.out.println("VACCINE APIs:");
        System.out.println("GET   " + baseUrl + "/hospital/vaccines");
        System.out.println("GET   " + baseUrl + "/hospital/vaccines/search?name=xyz");
        System.out.println("GET   " + baseUrl + "/hospital/vaccines/expiring?days=30");
        System.out.println("GET   " + baseUrl + "/hospital/vaccines/hospital/{hospitalId}");
        System.out.println("GET   " + baseUrl + "/hospital/vaccines/{id}");

        System.out.println();

        // ================= INFO =================
        System.out.println("SERVICE INFO:");
        System.out.println("Hospital Service Running on : " + baseUrl);

        System.out.println("\n=============================================\n");
    }
}
