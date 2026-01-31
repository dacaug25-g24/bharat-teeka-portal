package com.bharatteeka.patient.service;

import com.bharatteeka.patient.client.HospitalServiceClient;
import com.bharatteeka.patient.dto.SlotDto;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.List;

@Service
@RequiredArgsConstructor
public class HospitalClientService {

	private final HospitalServiceClient hospitalServiceClient;

	public SlotDto getSlotById(Integer slotId) {
		return hospitalServiceClient.getSlotById(slotId);
	}

	public SlotDto findAvailableSlot(Integer hospitalId, LocalDate date, Integer slotId) {
		return hospitalServiceClient.findSlotByIdInAvailable(hospitalId, date, slotId);
	}

	public List<SlotDto> getAvailableSlots(Integer hospitalId, LocalDate date) {
		return hospitalServiceClient.getAvailableSlots(hospitalId, date);
	}
}
