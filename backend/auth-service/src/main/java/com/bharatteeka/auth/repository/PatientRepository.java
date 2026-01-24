package com.bharatteeka.auth.repository;

import com.bharatteeka.auth.entity.Patient;
import org.springframework.data.jpa.repository.JpaRepository;

public interface PatientRepository extends JpaRepository<Patient, Integer> {
    boolean existsByUser_UserId(Integer userId);
}
