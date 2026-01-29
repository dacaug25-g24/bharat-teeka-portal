package com.bharatteeka.patient.entity;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "user")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class User {

	@Id
	@Column(name = "user_id")
	private Integer userId;

	private String username;
	private String email;
	private String phone;
	private String address;
}
