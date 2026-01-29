//package com.bharatteeka.hospital.controller;
//
//import com.bharatteeka.hospital.dto.CompleteAppointmentRequest;
//import com.bharatteeka.hospital.entity.Appointment;
//import com.bharatteeka.hospital.service.AppointmentService;
//import org.springframework.format.annotation.DateTimeFormat;
//import org.springframework.web.bind.annotation.*;
//
//import java.time.LocalDate;
//import java.util.List;
//
//@RestController
//@RequestMapping("/hospital/appointments")
//@CrossOrigin
//public class AppointmentController {
//
//    private final AppointmentService service;
//
//    public AppointmentController(AppointmentService service) {
//        this.service = service;
//    }
//
//    @GetMapping
//    public List<Appointment> allAppointments() {
//        return service.getAllAppointments();
//    }
//
//    @GetMapping("/patient/{patientId}")
//    public List<Appointment> patientHistory(@PathVariable Integer patientId) {
//        return service.getPatientHistory(patientId);
//    }
//
//    @GetMapping("/hospital/{hospitalId}")
//    public List<Appointment> hospitalAppointments(
//            @PathVariable Integer hospitalId,
//            @RequestParam(required = false)
//            @DateTimeFormat(iso = DateTimeFormat.ISO.DATE)
//            LocalDate date
//    ) {
//        if (date != null) return service.getAppointmentsByHospitalAndDate(hospitalId, date);
//        return service.getAppointmentsByHospital(hospitalId);
//    }
//
//    @GetMapping("/hospital/{hospitalId}/today")
//    public List<Appointment> todayAppointments(@PathVariable Integer hospitalId) {
//        return service.getTodayAppointments(hospitalId);
//    }
//
//    @PutMapping("/{id}/complete")
//    public Appointment completeAppointment(
//            @PathVariable Integer id,
//            @RequestParam String remarks
//    ) {
//        return service.markCompleted(id, remarks);
//    }
//
//    @PutMapping("/{id}/complete-details")
//    public Appointment completeWithDetails(
//            @PathVariable Integer id,
//            @RequestBody CompleteAppointmentRequest req
//    ) {
//        return service.markCompletedWithBatch(id, req.getRemarks(), req.getBatchNumber());
//    }
//
//    @PutMapping("/{id}/cancel")
//    public Appointment cancelAppointment(
//            @PathVariable Integer id,
//            @RequestParam String reason
//    ) {
//        return service.cancelAppointment(id, reason);
//    }
//}

package com.bharatteeka.hospital.controller;

import com.bharatteeka.hospital.dto.CompleteAppointmentRequest;
import com.bharatteeka.hospital.entity.Appointment;
import com.bharatteeka.hospital.service.AppointmentService;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;

@RestController
@RequestMapping("/hospital/appointments")
@CrossOrigin
public class AppointmentController {

    private final AppointmentService service;

    public AppointmentController(AppointmentService service) {
        this.service = service;
    }

    @GetMapping
    public List<Appointment> allAppointments() {
        return service.getAllAppointments();
    }

    @GetMapping("/patient/{patientId}")
    public List<Appointment> patientHistory(@PathVariable Integer patientId) {
        return service.getPatientHistory(patientId);
    }

    @GetMapping("/hospital/{hospitalId}")
    public List<Appointment> hospitalAppointments(
            @PathVariable Integer hospitalId,
            @RequestParam(required = false)
            @DateTimeFormat(iso = DateTimeFormat.ISO.DATE)
            LocalDate date
    ) {
        if (date != null) return service.getAppointmentsByHospitalAndDate(hospitalId, date);
        return service.getAppointmentsByHospital(hospitalId);
    }

    @GetMapping("/hospital/{hospitalId}/today")
    public List<Appointment> todayAppointments(@PathVariable Integer hospitalId) {
        return service.getTodayAppointments(hospitalId);
    }

    @PutMapping("/{id}/complete-details")
    public Appointment completeWithDetails(
            @PathVariable Integer id,
            @RequestBody CompleteAppointmentRequest req
    ) {
        return service.markCompletedWithBatch(id, req.getRemarks(), req.getBatchNumber());
    }

    @PutMapping("/{id}/complete")
    public Appointment completeAppointment(
            @PathVariable Integer id,
            @RequestParam String remarks
    ) {
        return service.markCompleted(id, remarks);
    }

    @PutMapping("/{id}/cancel")
    public Appointment cancelAppointment(
            @PathVariable Integer id,
            @RequestParam String reason
    ) {
        return service.cancelAppointment(id, reason);
    }
}

