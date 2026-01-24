package com.bharatteeka.hospital.controller;

import com.bharatteeka.hospital.entity.Appointment;
import com.bharatteeka.hospital.service.AppointmentService;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/hospital/appointments")
@CrossOrigin
public class AppointmentController {

    private final AppointmentService service;

    public AppointmentController(AppointmentService service) {
        this.service = service;
    }

    @GetMapping("/today")
    public List<Appointment> todayAppointments() {
        List<Appointment> appts = service.getTodayAppointments();
        if (appts.isEmpty()) {
            throw new RuntimeException("No appointments today");
        }
        return appts;
    }

    @GetMapping
    public List<Appointment> allAppointments() {
        return service.getAllAppointments();
    }

    @GetMapping("/patient/{patientId}")
    public List<Appointment> patientHistory(@PathVariable Integer patientId) {
        return service.getPatientHistory(patientId);
    }

    @PutMapping("/{id}/complete")
    public Appointment completeAppointment(
            @PathVariable Integer id,
            @RequestParam String remarks
    ) {
        return service.markCompleted(id, remarks);
    }

//    @PostMapping("/book")
//    public Appointment bookAppointment(@RequestBody Appointment appointment) {
//        return service.bookAppointment(appointment);
//    }
}
