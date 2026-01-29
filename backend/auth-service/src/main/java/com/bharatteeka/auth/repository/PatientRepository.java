package com.bharatteeka.auth.repository;

import com.bharatteeka.auth.entity.Patient;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface PatientRepository extends JpaRepository<Patient, Integer> {

	boolean existsByUser_UserId(Integer userId);

	Optional<Patient> findByUser_UserId(Integer userId);

	List<Patient> findAllByUser_UserId(Integer userId);
}
