package com.bharatteeka.hospital.repository;

import com.bharatteeka.hospital.entity.Slot;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.time.LocalTime;
import java.util.List;

@Repository
public interface SlotRepository extends JpaRepository<Slot, Integer> {

    // Get slots by hospital + date
    List<Slot> findByHospital_HospitalIdAndDate(Integer hospitalId, LocalDate date);

    // Get slots by hospital + date + time
    List<Slot> findByHospital_HospitalIdAndDateAndStartTimeLessThanEqualAndEndTimeGreaterThanEqual(
            Integer hospitalId,
            LocalDate date,
            LocalTime start,
            LocalTime end
    );

    @Query("""
    	    SELECT s FROM Slot s
    	    WHERE s.hospital.hospitalId = :hospitalId
    	      AND s.date = :date
    	      AND s.isActive = true
    	      AND s.bookedCount < s.capacity
    	""")
    	List<Slot> findAvailableSlots(
    	        @Param("hospitalId") Integer hospitalId,
    	        @Param("date") LocalDate date
    	);


    // Get slots by hospital + vaccine + date
    @Query("SELECT s FROM Slot s WHERE s.hospital.hospitalId = :hospitalId AND s.vaccine.vaccineId = :vaccineId AND s.date = :date AND s.isActive = true")
    List<Slot> findByHospitalIdAndVaccineIdAndDate(
            @Param("hospitalId") Integer hospitalId,
            @Param("vaccineId") Integer vaccineId,
            @Param("date") LocalDate date
    );

    
    List<Slot> findByHospitalHospitalIdAndDateAndIsActiveTrue(
    	    Integer hospitalId,
    	    LocalDate date
    	);

    @Modifying
    @Query("UPDATE Slot s SET s.isActive = false WHERE s.slotId = :slotId")
    void softDeleteSlot(@Param("slotId") Integer slotId);


}
