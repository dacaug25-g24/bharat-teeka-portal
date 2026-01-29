package com.bharatteeka.patient.controller;

import com.bharatteeka.patient.dto.CityDto;
import com.bharatteeka.patient.dto.HospitalDto;
import com.bharatteeka.patient.dto.StateDto;
import com.bharatteeka.patient.service.LocationQueryService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/locations")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class LocationController {

	private final LocationQueryService locationQueryService;

	@GetMapping("/states")
	public ResponseEntity<?> states() {
		try {
			List<StateDto> list = locationQueryService.getStates();
			return ResponseEntity.ok(list);
		} catch (Exception e) {
			return ResponseEntity.badRequest().body(e.getMessage());
		}
	}

	@GetMapping("/cities")
	public ResponseEntity<?> cities(@RequestParam Integer stateId) {
		try {
			List<CityDto> list = locationQueryService.getCitiesByState(stateId);
			return ResponseEntity.ok(list);
		} catch (Exception e) {
			return ResponseEntity.badRequest().body(e.getMessage());
		}
	}

	@GetMapping("/hospitals")
	public ResponseEntity<?> hospitals(@RequestParam Integer cityId,
			@RequestParam(required = false) String hospitalType) {
		try {
			List<HospitalDto> list = locationQueryService.getHospitalsByCity(cityId, hospitalType);
			return ResponseEntity.ok(list);
		} catch (Exception e) {
			return ResponseEntity.badRequest().body(e.getMessage());
		}
	}
}
