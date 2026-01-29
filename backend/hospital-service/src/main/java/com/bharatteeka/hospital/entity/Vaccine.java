package com.bharatteeka.hospital.entity;

import jakarta.persistence.*;
import lombok.Data;

import java.time.LocalDate;

@Entity
@Table(name = "vaccine")
@Data
public class Vaccine {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "vaccine_id")
    private Integer vaccineId;

    @Column(name = "vaccine_name")
    private String vaccineName;

    @Column(name = "manufacturer")
    private String manufacturer;

    @Column(name = "vaccine_type")
    private String vaccineType;

    @Column(name = "description", columnDefinition = "text")
    private String description;

    @Column(name = "side_effects", columnDefinition = "text")
    private String sideEffects;

    @Column(name = "min_age")
    private Integer minAge;

    @Column(name = "max_age")
    private Integer maxAge;

    // NOTE: your DB shows both dose_required and doses_required and also dose_count.
    // We'll map all and later you can decide which one to use in UI.
    @Column(name = "dose_required")
    private Integer doseRequired;

    @Column(name = "doses_required")
    private Integer dosesRequired;

    @Column(name = "dose_gap_days")
    private Integer doseGapDays;

    @Column(name = "storage_temperature")
    private Integer storageTemperature;

    @Column(name = "manufacturing_date")
    private LocalDate manufacturingDate;

    @Column(name = "expiry_date")
    private LocalDate expiryDate;

    @Column(name = "hospital_id")
    private Integer hospitalId;

    @Column(name = "dose_count")
    private Integer doseCount;

    // DB also shows "name" column. If it exists in table, map it too.
    @Column(name = "name")
    private String name;
}
