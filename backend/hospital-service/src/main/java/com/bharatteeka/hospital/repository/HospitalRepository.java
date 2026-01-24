package com.bharatteeka.hospital.repository;

import com.bharatteeka.hospital.entity.Hospital;
import org.springframework.data.jpa.repository.JpaRepository;

public interface HospitalRepository extends JpaRepository<Hospital, Integer> {}
