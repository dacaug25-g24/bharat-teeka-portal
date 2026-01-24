package com.bharatteeka.hospital.entity;

import jakarta.persistence.*;
import lombok.Data;

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

    @Column(name = "dose_count")
    private Integer doseCount;
}
