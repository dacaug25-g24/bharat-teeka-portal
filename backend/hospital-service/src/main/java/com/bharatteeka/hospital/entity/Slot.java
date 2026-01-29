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

    @Column(name = "slot_date")
    private LocalDate date;

    @Column(name = "start_time")
    private LocalTime startTime;

    @Column(name = "end_time")
    private LocalTime endTime;

    @Column(name = "capacity")
    private Integer capacity;

    @Column(name = "booked_count")
    private Integer bookedCount;

    @ManyToOne
    @JoinColumn(name = "vaccine_id", nullable = false)
    private Vaccine vaccine;  // renamed from vaccineId → vaccine

    @Column(name = "is_booked")
    private Boolean isBooked;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "hospital_id", nullable = false)
    private Hospital hospital;

    // Convenience method to calculate available slots
    public Integer getAvailable() {
        if (capacity == null || bookedCount == null) return 0;
        return capacity - bookedCount;
    }
    
    @Column(name = "is_active",nullable = false)
    private Boolean isActive = true;

}
