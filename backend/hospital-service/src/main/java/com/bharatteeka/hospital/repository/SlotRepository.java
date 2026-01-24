package com.bharatteeka.hospital.repository;

import com.bharatteeka.hospital.entity.Slot;
import org.springframework.data.jpa.repository.JpaRepository;

import java.time.LocalDate;
import java.time.LocalTime;
import java.util.List;

public interface SlotRepository extends JpaRepository<Slot, Integer> {

    // Slots by date + hospital
    List<Slot> findByHospital_HospitalIdAndDate(
            Integer hospitalId,
            LocalDate date
    );

    // Slot by date + time + hospital
    List<Slot> findByHospital_HospitalIdAndDateAndStartTimeLessThanEqualAndEndTimeGreaterThanEqual(
            Integer hospitalId,
            LocalDate date,
            LocalTime time1,
            LocalTime time2
    );
}
