package com.bharatteeka.hospital.entity;

import jakarta.persistence.*;
import lombok.Data;

import java.time.LocalDate;

@Entity
@Table(name = "appointment")
@Data
public class Appointment {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "appointment_id")
    private Integer appointmentId;

    @Column(name = "patient_id")
    private Integer patientId;

    @Column(name = "booking_date")
    private LocalDate bookingDate;

    private String status;

    private String remarks;

    @ManyToOne
    @JoinColumn(name = "hospital_id")
    private Hospital hospital;
}
