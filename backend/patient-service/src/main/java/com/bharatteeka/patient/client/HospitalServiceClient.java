package com.bharatteeka.patient.client;

import com.bharatteeka.patient.dto.SlotDto;
import com.bharatteeka.patient.dto.VaccineDto;

import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Component;
import org.springframework.web.client.RestTemplate;
import org.springframework.web.util.UriComponentsBuilder;

import java.time.LocalDate;
import java.util.Arrays;
import java.util.List;

@Component
@RequiredArgsConstructor
public class HospitalServiceClient {

	private final RestTemplate restTemplate;

	@Value("${hospital.service.base-url}")
	private String baseUrl;

	public List<SlotDto> getAvailableSlots(Integer hospitalId, LocalDate date) {
		String url = UriComponentsBuilder.fromUriString(baseUrl + "/hospital/slots/available")
				.queryParam("hospitalId", hospitalId).queryParam("date", date).toUriString();

		ResponseEntity<SlotDto[]> response = restTemplate.getForEntity(url, SlotDto[].class);

		SlotDto[] body = response.getBody();
		return body == null ? List.of() : Arrays.asList(body);
	}

	public SlotDto findSlotByIdInAvailable(Integer hospitalId, LocalDate date, Integer slotId) {
		return getAvailableSlots(hospitalId, date).stream().filter(s -> s.getSlotId().equals(slotId)).findFirst()
				.orElse(null);
	}

	public VaccineDto getVaccineById(Integer vaccineId) {
		String url = UriComponentsBuilder.fromUriString(baseUrl + "/hospital/vaccines/{id}").buildAndExpand(vaccineId)
				.toUriString();

		return restTemplate.getForObject(url, VaccineDto.class);
	}

	public SlotDto getSlotById(Integer slotId) {
		String url = UriComponentsBuilder.fromUriString(baseUrl + "/hospital/slots/{slotId}").buildAndExpand(slotId)
				.toUriString();

		return restTemplate.getForObject(url, SlotDto.class);
	}
}
