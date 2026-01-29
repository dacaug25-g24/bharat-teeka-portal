package com.bharatteeka.patient.repository;

import com.bharatteeka.patient.entity.Slot;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

public interface SlotRepository extends JpaRepository<Slot, Integer> {

	@Modifying
	@Query("""
			    update Slot s
			       set s.bookedCount = s.bookedCount + 1
			     where s.slotId = :slotId
			       and s.bookedCount < s.capacity
			""")
	int incrementBookedCount(@Param("slotId") Integer slotId);

	@Modifying
	@Query("""
			    update Slot s
			       set s.bookedCount = case when s.bookedCount > 0 then s.bookedCount - 1 else 0 end
			     where s.slotId = :slotId
			""")
	int decrementBookedCount(@Param("slotId") Integer slotId);
}
