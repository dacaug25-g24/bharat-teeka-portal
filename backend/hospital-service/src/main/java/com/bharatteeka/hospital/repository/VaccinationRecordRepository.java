package com.bharatteeka.hospital.repository;

import com.bharatteeka.hospital.entity.VaccinationRecord;
import org.springframework.data.jpa.repository.JpaRepository;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

public interface VaccinationRecordRepository extends JpaRepository<VaccinationRecord, Integer> {

    Optional<VaccinationRecord> findByAppointmentAppointmentId(Integer appointmentId);

    long countByPatientIdAndVaccineVaccineId(Integer patientId, Integer vaccineId);

    List<VaccinationRecord> findByPatientIdOrderByVaccinationDateDesc(Integer patientId);

    List<VaccinationRecord> findByHospitalHospitalIdAndVaccinationDateBetweenOrderByVaccinationDateDesc(
            Integer hospitalId,
            LocalDate from,
            LocalDate to
    );
}
