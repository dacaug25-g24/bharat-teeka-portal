package com.bharatteeka.hospital.repository;

import com.bharatteeka.hospital.entity.Slot;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.time.LocalTime;
import java.util.List;

@Repository
public interface SlotRepository extends JpaRepository<Slot, Integer> {

    // ✅ Get slots by hospital + date
    List<Slot> findByHospital_HospitalIdAndDate(Integer hospitalId, LocalDate date);

    // ✅ Get slots by hospital + date + time
    List<Slot> findByHospital_HospitalIdAndDateAndStartTimeLessThanEqualAndEndTimeGreaterThanEqual(
            Integer hospitalId,
            LocalDate date,
            LocalTime start,
            LocalTime end
    );

    // ✅ Get available slots directly from DB
    @Query("SELECT s FROM Slot s WHERE s.hospital.hospitalId = :hospitalId " +
           "AND s.date = :date AND s.capacity - s.bookedCount > 0")
    List<Slot> findAvailableSlots(@Param("hospitalId") Integer hospitalId,
                                  @Param("date") LocalDate date);

    // ✅ Get slots by hospital + vaccine + date
    List<Slot> findByHospital_HospitalIdAndVaccine_VaccineIdAndDate(
            Integer hospitalId,
            Integer vaccineId,
            LocalDate date
    );
}
