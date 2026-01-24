package com.bharatteeka.hospital.repository;

import com.bharatteeka.hospital.entity.Appointment;
import org.springframework.data.jpa.repository.JpaRepository;
import java.time.LocalDate;
import java.util.List;

public interface AppointmentRepository extends JpaRepository<Appointment, Integer> {
    List<Appointment> findByBookingDate(LocalDate date);
    List<Appointment> findByPatientId(Integer patientId);
}

