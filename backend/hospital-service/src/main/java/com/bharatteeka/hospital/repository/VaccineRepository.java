package com.bharatteeka.hospital.repository;

import com.bharatteeka.hospital.entity.Vaccine;
import org.springframework.data.jpa.repository.JpaRepository;

public interface VaccineRepository extends JpaRepository<Vaccine, Integer> {
    // NOTHING ELSE
}
