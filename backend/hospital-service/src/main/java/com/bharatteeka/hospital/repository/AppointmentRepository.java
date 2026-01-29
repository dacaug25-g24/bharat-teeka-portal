package com.bharatteeka.hospital.repository;

import com.bharatteeka.hospital.entity.Appointment;
import com.bharatteeka.hospital.entity.AppointmentStatus;

import org.springframework.data.jpa.repository.JpaRepository;
import java.time.LocalDate;
import java.util.List;

public interface AppointmentRepository extends JpaRepository<Appointment, Integer> {
    List<Appointment> findByBookingDate(LocalDate date);
    List<Appointment> findByPatientId(Integer patientId);
    
    List<Appointment> findByHospitalHospitalId(Integer hospitalId);

    List<Appointment> findByHospitalHospitalIdAndBookingDate(
            Integer hospitalId,
            LocalDate bookingDate
    );


    List<Appointment> findByHospitalHospitalIdAndStatus(
            Integer hospitalId,
            AppointmentStatus status
    );
    
}

