package com.bharatteeka.hospital.entity;

import jakarta.persistence.*;
import lombok.Data;

import java.time.LocalDate;
import java.time.LocalTime;

@Entity
@Table(name = "slot")
@Data
public class Slot {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "slot_id")
    private Integer slotId;

    private LocalDate date;

    @Column(name = "start_time")
    private LocalTime startTime;

    @Column(name = "end_time")
    private LocalTime endTime;

    @Column(name = "is_booked")
    private Boolean isBooked;

    @ManyToOne
    @JoinColumn(name = "hospital_id")
    private Hospital hospital;
}
