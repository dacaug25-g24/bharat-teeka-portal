package com.bharatteeka.patient.entity;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "parent_child")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ParentChild {

	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	@Column(name = "parent_child_id")
	private Integer parentChildId;

	@Column(name = "parent_user_id", nullable = false)
	private Integer parentUserId;

	@Column(name = "child_patient_id", nullable = false)
	private Integer childPatientId;

	@Column(name = "relation_id", nullable = false)
	private Integer relationId;
}
