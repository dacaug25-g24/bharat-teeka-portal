package com.bharatteeka.hospital.service;

import com.bharatteeka.hospital.entity.Appointment;
import java.util.List;

public interface AppointmentService {
    List<Appointment> getTodayAppointments();
    List<Appointment> getAllAppointments();
    List<Appointment> getPatientHistory(Integer patientId);
    Appointment markCompleted(Integer appointmentId, String remarks);
//    Appointment bookAppointment(Appointment appointment);
}
