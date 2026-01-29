package com.bharatteeka.patient.entity;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDate;
import java.time.LocalTime;

@Entity
@Table(name = "slot")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Slot {

	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	@Column(name = "slot_id")
	private Integer slotId;

	@Column(name = "hospital_id", nullable = false)
	private Integer hospitalId;

	@Column(name = "slot_date", nullable = false)
	private LocalDate slotDate;

	@Column(name = "start_time", nullable = false)
	private LocalTime startTime;

	@Column(name = "end_time", nullable = false)
	private LocalTime endTime;

	@Column(name = "capacity", nullable = false)
	private Integer capacity;

	@Column(name = "booked_count")
	private Integer bookedCount;

	@Column(name = "vaccine_id", nullable = false)
	private Integer vaccineId;
}
