//package com.bharatteeka.hospital.service;
//
//import com.bharatteeka.hospital.entity.Appointment;
//
//import java.time.LocalDate;
//import java.util.List;
//
//public interface AppointmentService {
//
//    List<Appointment> getAllAppointments();
//    List<Appointment> getPatientHistory(Integer patientId);
//
//    List<Appointment> getAppointmentsByHospital(Integer hospitalId);
//    List<Appointment> getTodayAppointments(Integer hospitalId);
//
//    Appointment markCompleted(Integer appointmentId, String remarks);
//    Appointment cancelAppointment(Integer appointmentId, String reason);
//
//    List<Appointment> getAppointmentsByHospitalAndDate(Integer hospitalId, LocalDate date);
//
//    Appointment markCompletedWithBatch(Integer appointmentId, String remarks, String batchNumber);
//}
package com.bharatteeka.hospital.service;

import com.bharatteeka.hospital.entity.Appointment;

import java.time.LocalDate;
import java.util.List;

public interface AppointmentService {

    List<Appointment> getAllAppointments();
    List<Appointment> getPatientHistory(Integer patientId);

    List<Appointment> getAppointmentsByHospital(Integer hospitalId);
    List<Appointment> getTodayAppointments(Integer hospitalId);

    List<Appointment> getAppointmentsByHospitalAndDate(Integer hospitalId, LocalDate date);

    Appointment markCompleted(Integer appointmentId, String remarks);

    Appointment markCompletedWithBatch(Integer appointmentId, String remarks, String batchNumber);

    Appointment cancelAppointment(Integer appointmentId, String reason);
}
