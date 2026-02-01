package com.bharatteeka.patient.service;

import com.bharatteeka.patient.dto.ChildRequestDto;
import com.bharatteeka.patient.dto.ChildResponseDto;
import com.bharatteeka.patient.entity.ParentChild;
import com.bharatteeka.patient.entity.Patient;
import com.bharatteeka.patient.repository.ParentChildRepository;
import com.bharatteeka.patient.repository.PatientRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.time.Period;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class ChildService {

    private final PatientRepository patientRepository;
    private final ParentChildRepository parentChildRepository;
    private final BeneficiaryAccessService beneficiaryAccessService;

    @Transactional
    public Patient addChild(Integer parentUserId, ChildRequestDto dto) {

        require(parentUserId != null, "parentUserId is required");
        require(dto != null, "Request body is required");

        requireText(dto.getFirstName(), "First name is required");
        requireText(dto.getLastName(), "Last name is required");
        require(dto.getDateOfBirth() != null, "Date of birth is required");
        requireText(dto.getBloodGroup(), "Blood group is required");
        require(dto.getRelationId() != null, "Relation is required");
        requireText(dto.getAadharNumber(), "Aadhaar is required");

        int age = Period.between(dto.getDateOfBirth(), LocalDate.now()).getYears();
        if (age >= 18) throw new IllegalArgumentException("Beneficiary must be below 18 years");

        String aadhaar = dto.getAadharNumber().trim();
        if (!aadhaar.matches("^\\d{12}$")) {
            throw new IllegalArgumentException("Aadhaar must be exactly 12 digits");
        }
        if (patientRepository.existsByAadharNumber(aadhaar)) {
            throw new IllegalArgumentException("Aadhaar already exists");
        }

        String gender = normalizeGender(dto.getGender());

        Patient child = Patient.builder()
                .userId(null)
                .firstName(dto.getFirstName().trim())
                .lastName(dto.getLastName().trim())
                .dateOfBirth(dto.getDateOfBirth())
                .gender(gender)
                .aadharNumber(aadhaar)
                .bloodGroup(dto.getBloodGroup().trim())
                .isAdult(false)
                .isActive(true)
                .remarks(textOrNull(dto.getRemarks()))
                .build();

        Patient savedChild = patientRepository.save(child);

        ParentChild mapping = ParentChild.builder()
                .parentUserId(parentUserId)
                .childPatientId(savedChild.getPatientId())
                .relationId(dto.getRelationId())
                .build();

        parentChildRepository.save(mapping);

        return savedChild;
    }

    public List<ChildResponseDto> getChildrenDetails(Integer parentUserId) {

        require(parentUserId != null, "parentUserId is required");

        List<ParentChild> mappings = parentChildRepository.findByParentUserId(parentUserId);

        return mappings.stream()
                .map(mapping -> {
                    Patient child = patientRepository.findById(mapping.getChildPatientId())
                            .orElseThrow(() -> new IllegalArgumentException(
                                    "Child not found: " + mapping.getChildPatientId()
                            ));
                    return new Object[]{mapping, child};
                })
                .filter(arr -> Boolean.TRUE.equals(((Patient) arr[1]).getIsActive()))
                .map(arr -> {
                    ParentChild mapping = (ParentChild) arr[0];
                    Patient child = (Patient) arr[1];

                    return ChildResponseDto.builder()
                            .parentChildId(mapping.getParentChildId())
                            .parentUserId(mapping.getParentUserId())
                            .patientId(child.getPatientId())
                            .relationId(mapping.getRelationId())
                            .firstName(child.getFirstName())
                            .lastName(child.getLastName())
                            .dateOfBirth(child.getDateOfBirth())
                            .gender(child.getGender())
                            .aadharNumber(child.getAadharNumber())
                            .bloodGroup(child.getBloodGroup())
                            .isActive(child.getIsActive())
                            .remarks(child.getRemarks())
                            .build();
                })
                .collect(Collectors.toList());
    }

    @Transactional
    public void deleteChild(Integer parentUserId, Integer patientId) {

        require(parentUserId != null, "parentUserId is required");
        require(patientId != null, "patientId is required");

        // ✅ reuse access check (simple)
        beneficiaryAccessService.validateChildLinkedToParent(parentUserId, patientId);

        ParentChild link = parentChildRepository.findByParentUserIdAndChildPatientId(parentUserId, patientId)
                .orElseThrow(() -> new IllegalArgumentException("Beneficiary not linked to this parent"));

        Patient child = patientRepository.findById(patientId)
                .orElseThrow(() -> new IllegalArgumentException("Child patient not found"));

        if (child.getUserId() != null || Boolean.TRUE.equals(child.getIsAdult())) {
            throw new IllegalArgumentException("Cannot delete: patient is not a beneficiary");
        }

        parentChildRepository.delete(link);

        child.setIsActive(false);
        patientRepository.save(child);
    }

    // -------------------------
    // Helpers
    // -------------------------
    private String normalizeGender(String gender) {
        requireText(gender, "Gender is required");
        String g = gender.trim();
        if (g.equalsIgnoreCase("male")) return "Male";
        if (g.equalsIgnoreCase("female")) return "Female";
        if (g.equalsIgnoreCase("other")) return "Other";
        throw new IllegalArgumentException("Gender must be Male, Female, or Other");
    }

    private void require(boolean condition, String message) {
        if (!condition) throw new IllegalArgumentException(message);
    }

    private void requireText(String value, String message) {
        if (value == null || value.trim().isEmpty()) throw new IllegalArgumentException(message);
    }

    private String textOrNull(String value) {
        if (value == null) return null;
        String v = value.trim();
        return v.isEmpty() ? null : v;
    }
}
