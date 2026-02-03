package com.bharatteeka.patient.service;

import com.bharatteeka.patient.entity.Patient;
import com.bharatteeka.patient.repository.ParentChildRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class BeneficiaryAccessService {

    private final ParentChildRepository parentChildRepository;

    public void validateAccess(Patient patient, Integer parentUserId, String action) {

        if (patient == null) return;

        // Adult -> always allowed
        if (Boolean.TRUE.equals(patient.getIsAdult())) return;

        // Child -> parent required
        if (parentUserId == null) {
            throw new IllegalArgumentException("parentUserId is required for " + action);
        }

        boolean allowed = parentChildRepository.existsByParentUserIdAndChildPatientId(
                parentUserId,
                patient.getPatientId()
        );

        if (!allowed) {
            throw new IllegalArgumentException("Beneficiary does not belong to this parent");
        }
    }

    /**
     * Helper used in delete child
     */
    public void validateChildLinkedToParent(Integer parentUserId, Integer childPatientId) {
        boolean allowed = parentChildRepository.existsByParentUserIdAndChildPatientId(parentUserId, childPatientId);
        if (!allowed) {
            throw new IllegalArgumentException("Beneficiary not linked to this parent");
        }
    }
}
