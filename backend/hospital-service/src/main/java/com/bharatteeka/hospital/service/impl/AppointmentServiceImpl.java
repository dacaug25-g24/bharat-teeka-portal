package com.bharatteeka.hospital.service.impl;

import com.bharatteeka.hospital.entity.Appointment;
import com.bharatteeka.hospital.repository.AppointmentRepository;
import com.bharatteeka.hospital.service.AppointmentService;
import org.springframework.stereotype.Service;
import java.time.LocalDate;
import java.util.List;

@Service
public class AppointmentServiceImpl implements AppointmentService {

    private final AppointmentRepository repo;

    public AppointmentServiceImpl(AppointmentRepository repo) {
        this.repo = repo;
    }

    @Override
    public List<Appointment> getTodayAppointments() {
        return repo.findByBookingDate(LocalDate.now());
    }

    @Override
    public List<Appointment> getAllAppointments() {
        return repo.findAll();
    }

    @Override
    public List<Appointment> getPatientHistory(Integer patientId) {
        return repo.findByPatientId(patientId);
    }

    @Override
    public Appointment markCompleted(Integer appointmentId, String remarks) {
        Appointment appt = repo.findById(appointmentId).orElseThrow();
        appt.setStatus("Completed");
        appt.setRemarks(remarks);
        return repo.save(appt);
    }

//    @Override
//    public Appointment bookAppointment(Appointment appointment) {
//        return repo.save(appointment);
//    }
}
