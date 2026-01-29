package com.bharatteeka.patient.repository;

import com.bharatteeka.patient.entity.Appointment;
import org.springframework.data.jpa.repository.JpaRepository;

import java.time.LocalDate;
import java.util.List;

public interface AppointmentRepository extends JpaRepository<Appointment, Integer> {

	List<Appointment> findByPatientId(Integer patientId);

	List<Appointment> findByPatientIdAndStatus(Integer patientId, String status);

	List<Appointment> findByHospitalId(Integer hospitalId);

	List<Appointment> findByBookingDate(LocalDate bookingDate);

	boolean existsByPatientIdAndSlotId(Integer patientId, Integer slotId);
}
