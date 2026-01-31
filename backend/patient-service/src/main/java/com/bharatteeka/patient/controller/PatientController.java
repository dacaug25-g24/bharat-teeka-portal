package com.bharatteeka.patient.controller;

import com.bharatteeka.patient.dto.PatientIdResponseDto;
import com.bharatteeka.patient.service.PatientLookupService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/patients")
@RequiredArgsConstructor
public class PatientController {

	private final PatientLookupService patientLookupService;

	@GetMapping("/by-user")
	public PatientIdResponseDto getPatientIdByUserId(@RequestParam Integer userId) {
		return patientLookupService.getPatientIdByUserId(userId);
	}
}
