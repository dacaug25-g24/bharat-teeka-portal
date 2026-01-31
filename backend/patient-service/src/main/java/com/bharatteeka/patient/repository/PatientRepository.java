package com.bharatteeka.patient.repository;

import com.bharatteeka.patient.entity.Patient;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface PatientRepository extends JpaRepository<Patient, Integer> {

	Optional<Patient> findByUserId(Integer userId);

	boolean existsByAadharNumber(String aadharNumber);

	List<Patient> findByIsAdult(Boolean isAdult);

}
