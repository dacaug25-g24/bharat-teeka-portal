package com.bharatteeka.patient.service;

import com.bharatteeka.patient.dto.PatientIdResponseDto;
import com.bharatteeka.patient.entity.Patient;
import com.bharatteeka.patient.repository.PatientRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class PatientLookupService {

	private final PatientRepository patientRepository;

	public PatientIdResponseDto getPatientIdByUserId(Integer userId) {
		Patient p = patientRepository.findByUserId(userId)
				.orElseThrow(() -> new RuntimeException("Patient not found for userId: " + userId));

		return new PatientIdResponseDto(userId, p.getPatientId());
	}
}
