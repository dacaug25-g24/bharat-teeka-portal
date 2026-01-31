package com.bharatteeka.auth.entity;

import jakarta.persistence.*;
import lombok.Data;

@Entity
@Table(name = "hospital")
@Data
public class Hospital {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "hospital_id")
    private Integer hospitalId;

    @Column(name = "hospital_name")
    private String hospitalName;

    private String address;

    @OneToOne
    @JoinColumn(name = "user_id") 
    private User user;
}
