package com.bharatteeka.patient.service;

import com.bharatteeka.patient.dto.ProfileResponseDto;
import com.bharatteeka.patient.dto.UpdateProfileRequestDto;
import com.bharatteeka.patient.entity.Patient;
import com.bharatteeka.patient.entity.User;
import com.bharatteeka.patient.repository.PatientRepository;
import com.bharatteeka.patient.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class ProfileService {

	private final UserRepository userRepository;
	private final PatientRepository patientRepository;

	@Transactional(readOnly = true)
	public ProfileResponseDto getProfile(Integer userId) {
		if (userId == null)
			throw new IllegalArgumentException("userId is required");

		User user = userRepository.findById(userId)
				.orElseThrow(() -> new IllegalArgumentException("User not found: " + userId));

		Patient patient = patientRepository.findByUserId(userId).orElse(null);

		return ProfileResponseDto.builder().userId(user.getUserId())
				.patientId(patient != null ? patient.getPatientId() : null).username(user.getUsername())
				.email(user.getEmail()).phone(user.getPhone()).address(user.getAddress())
				.remarks(patient != null ? patient.getRemarks() : null).build();
	}

	@Transactional
	public ProfileResponseDto updateProfile(UpdateProfileRequestDto dto) {
		if (dto.getUserId() == null)
			throw new IllegalArgumentException("userId is required");

		String phone = dto.getPhone() == null ? "" : dto.getPhone().trim();
		String address = dto.getAddress() == null ? "" : dto.getAddress().trim();
		String remarks = dto.getRemarks() == null ? null : dto.getRemarks().trim();

		if (phone.isEmpty())
			throw new IllegalArgumentException("Phone is required");
		if (!phone.matches("^[6-9]\\d{9}$"))
			throw new IllegalArgumentException("Invalid phone number");
		if (address.isEmpty())
			throw new IllegalArgumentException("Address is required");

		User user = userRepository.findById(dto.getUserId())
				.orElseThrow(() -> new IllegalArgumentException("User not found: " + dto.getUserId()));

		user.setPhone(phone);
		user.setAddress(address);
		userRepository.save(user);

		Patient patient = patientRepository.findByUserId(dto.getUserId()).orElse(null);
		if (patient != null) {
			patient.setRemarks((remarks == null || remarks.isEmpty()) ? null : remarks);
			patientRepository.save(patient);
		}

		return getProfile(dto.getUserId());
	}
}
