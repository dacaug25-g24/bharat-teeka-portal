package com.bharatteeka.auth.repository;

import com.bharatteeka.auth.entity.Hospital;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface HospitalRepository extends JpaRepository<Hospital, Integer> {
    Hospital findByUserUserId(Integer userId);
}
