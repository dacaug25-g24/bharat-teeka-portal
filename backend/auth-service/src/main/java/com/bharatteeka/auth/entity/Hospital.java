//package com.bharatteeka.auth.entity;
//
//import jakarta.persistence.*;
//
//@Entity
//@Table(name = "hospital")
//public class Hospital {
//
//    @Id
//    @GeneratedValue(strategy = GenerationType.IDENTITY)
//    @Column(name = "hospital_id")
//    private Integer hospitalId;
//
//    @ManyToOne
//    @JoinColumn(name = "user_id")
//    private User user;
//
//    // getters & setters
//    public Integer getHospitalId() {
//        return hospitalId;
//    }
//
//    public User getUser() {
//        return user;
//    }
//}

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

    // ✅ IMPORTANT: this is required for findByUserUserId(...)
    @OneToOne
    @JoinColumn(name = "user_id")  // hospital table must have user_id FK
    private User user;
}
