package com.bharatteeka.patient.controller;

import com.bharatteeka.patient.dto.AppointmentDetailsDto;
import com.bharatteeka.patient.dto.AppointmentRequestDto;
import com.bharatteeka.patient.dto.AppointmentResponseDto;
import com.bharatteeka.patient.entity.Appointment;
import com.bharatteeka.patient.service.AppointmentService;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/appointments")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class AppointmentController {

	private final AppointmentService appointmentService;

	@PostMapping
	public ResponseEntity<?> book(@Valid @RequestBody AppointmentRequestDto dto) {
		try {
			Appointment appt = appointmentService.bookAppointment(dto);

			AppointmentResponseDto resp = new AppointmentResponseDto(true, "Appointment booked successfully",
					appt.getAppointmentId(), String.valueOf(appt.getStatus()));

			return ResponseEntity.ok(resp);

		} catch (Exception e) {
			return ResponseEntity.badRequest().body(new AppointmentResponseDto(false, e.getMessage(), null, null));
		}
	}

	@GetMapping("/details")
	public ResponseEntity<?> details(@RequestParam Integer patientId,
			@RequestParam(required = false) Integer parentUserId) {
		try {
			List<AppointmentDetailsDto> list = appointmentService.getAppointmentDetails(patientId, parentUserId);
			return ResponseEntity.ok(list);
		} catch (Exception e) {
			return ResponseEntity.badRequest().body(e.getMessage());
		}
	}

	@PutMapping("/{appointmentId}/cancel")
	public ResponseEntity<?> cancel(@PathVariable Integer appointmentId,
			@RequestParam(required = false) Integer parentUserId) {
		try {
			Appointment appt = appointmentService.cancelAppointment(appointmentId, parentUserId);

			AppointmentResponseDto resp = new AppointmentResponseDto(true, "Appointment cancelled",
					appt.getAppointmentId(), String.valueOf(appt.getStatus()));

			return ResponseEntity.ok(resp);

		} catch (Exception e) {
			return ResponseEntity.badRequest().body(new AppointmentResponseDto(false, e.getMessage(), null, null));
		}
	}

	@GetMapping
	public ResponseEntity<?> getAppointments(@RequestParam Integer patientId,
			@RequestParam(required = false) Integer parentUserId) {
		try {
			return ResponseEntity.ok(appointmentService.getAppointmentsByPatient(patientId, parentUserId));
		} catch (Exception e) {
			return ResponseEntity.badRequest().body(e.getMessage());
		}
	}

}
