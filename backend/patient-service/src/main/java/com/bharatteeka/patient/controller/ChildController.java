package com.bharatteeka.patient.controller;

import com.bharatteeka.patient.dto.ChildRequestDto;
import com.bharatteeka.patient.dto.ChildResponseDto;
import com.bharatteeka.patient.entity.Patient;
import com.bharatteeka.patient.service.ChildService;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/parent")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class ChildController {

	private final ChildService childService;

	@PostMapping("/children")
	public ResponseEntity<?> addChild(@RequestParam Integer parentUserId, @Valid @RequestBody ChildRequestDto dto) {
		try {
			Patient saved = childService.addChild(parentUserId, dto);
			return ResponseEntity.ok(saved);
		} catch (Exception e) {
			return ResponseEntity.badRequest().body(e.getMessage());
		}
	}

	@GetMapping("/children")
	public ResponseEntity<?> getChildrenDetails(@RequestParam Integer parentUserId) {
		try {
			List<ChildResponseDto> list = childService.getChildrenDetails(parentUserId);
			return ResponseEntity.ok(list);
		} catch (Exception e) {
			return ResponseEntity.badRequest().body(e.getMessage());
		}
	}

	@DeleteMapping("/children/{patientId}")
	public ResponseEntity<?> deleteChild(@PathVariable Integer patientId, @RequestParam Integer parentUserId) {
		try {
			childService.deleteChild(parentUserId, patientId);
			return ResponseEntity.ok("Deleted");
		} catch (Exception e) {
			return ResponseEntity.badRequest().body(e.getMessage());
		}
	}

}
