package com.bharatteeka.patient.controller;

import com.bharatteeka.patient.dto.ProfileResponseDto;
import com.bharatteeka.patient.dto.UpdateProfileRequestDto;
import com.bharatteeka.patient.service.ProfileService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/profile")
@RequiredArgsConstructor
public class ProfileController {

	private final ProfileService profileService;

	@GetMapping
	public ProfileResponseDto get(@RequestParam Integer userId) {
		return profileService.getProfile(userId);
	}

	@PutMapping
	public ProfileResponseDto update(@RequestBody UpdateProfileRequestDto dto) {
		return profileService.updateProfile(dto);
	}
}
