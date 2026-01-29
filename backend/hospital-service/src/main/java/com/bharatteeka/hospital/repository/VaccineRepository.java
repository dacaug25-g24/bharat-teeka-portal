package com.bharatteeka.hospital.repository;

import com.bharatteeka.hospital.entity.Vaccine;
import org.springframework.data.jpa.repository.JpaRepository;

import java.time.LocalDate;
import java.util.List;

public interface VaccineRepository extends JpaRepository<Vaccine, Integer> {

    List<Vaccine> findByVaccineNameContainingIgnoreCase(String name);

    List<Vaccine> findByExpiryDateLessThanEqual(LocalDate date);

    List<Vaccine> findByHospitalId(Integer hospitalId);
}
