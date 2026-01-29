package com.bharatteeka.patient.controller;

import com.bharatteeka.patient.dto.SlotDto;
import com.bharatteeka.patient.service.SlotQueryService;
import lombok.RequiredArgsConstructor;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;

@RestController
@RequestMapping("/api/slots")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class SlotController {

	private final SlotQueryService slotQueryService;

	@GetMapping("/available")
	public ResponseEntity<?> available(@RequestParam Integer hospitalId,
			@RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate date,
			@RequestParam(required = false) Integer vaccineId) {
		try {
			List<SlotDto> list = slotQueryService.getAvailableSlots(hospitalId, date, vaccineId);
			return ResponseEntity.ok(list);
		} catch (Exception e) {
			return ResponseEntity.badRequest().body(e.getMessage());
		}
	}

	@GetMapping("/{slotId}")
	public ResponseEntity<?> get(@PathVariable Integer slotId) {
		try {
			SlotDto dto = slotQueryService.getSlotById(slotId);
			if (dto == null)
				return ResponseEntity.notFound().build();
			return ResponseEntity.ok(dto);
		} catch (Exception e) {
			return ResponseEntity.badRequest().body(e.getMessage());
		}
	}
}
