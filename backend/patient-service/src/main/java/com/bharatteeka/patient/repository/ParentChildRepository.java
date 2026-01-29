package com.bharatteeka.patient.repository;

import com.bharatteeka.patient.entity.ParentChild;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface ParentChildRepository extends JpaRepository<ParentChild, Integer> {

	List<ParentChild> findByParentUserId(Integer parentUserId);

	Optional<ParentChild> findByParentUserIdAndChildPatientId(Integer parentUserId, Integer childPatientId);

	boolean existsByParentUserIdAndChildPatientId(Integer parentUserId, Integer childPatientId);

}
