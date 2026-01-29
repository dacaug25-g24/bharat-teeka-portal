package com.bharatteeka.patient.entity;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDate;
import java.time.LocalTime;

@Entity
@Table(name = "appointment")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Appointment {

	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	@Column(name = "appointment_id")
	private Integer appointmentId;

	@Column(name = "patient_id", nullable = false)
	private Integer patientId;

	@Column(name = "hospital_id", nullable = false)
	private Integer hospitalId;

	@Column(name = "slot_id", nullable = false)
	private Integer slotId;

	@Column(name = "dose_number", nullable = false)
	private Integer doseNumber;

	@Column(name = "booking_date", nullable = false)
	private LocalDate bookingDate;

	@Column(name = "booking_time", nullable = false)
	private LocalTime bookingTime;

	@Column(name = "status", length = 255)
	private String status;

	@Lob
	@Column(name = "remarks")
	private String remarks;
}
