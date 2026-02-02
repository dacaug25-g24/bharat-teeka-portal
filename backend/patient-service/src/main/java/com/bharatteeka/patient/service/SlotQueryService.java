package com.bharatteeka.patient.service;

import com.bharatteeka.patient.dto.SlotDto;
import com.bharatteeka.patient.dto.VaccineDto;
import lombok.RequiredArgsConstructor;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.jdbc.core.RowMapper;
import org.springframework.stereotype.Service;

import java.sql.Date;
import java.sql.Time;
import java.time.LocalDate;
import java.util.List;

@Service
@RequiredArgsConstructor
public class SlotQueryService {

	private final JdbcTemplate jdbcTemplate;

	private final RowMapper<SlotDto> rowMapper = (rs, rowNum) -> {
		SlotDto dto = new SlotDto();
		dto.setSlotId(rs.getInt("slot_id"));

		Date slotDate = rs.getDate("slot_date");
		dto.setDate(slotDate != null ? slotDate.toLocalDate() : null);

		Time st = rs.getTime("start_time");
		Time et = rs.getTime("end_time");
		dto.setStartTime(st != null ? st.toLocalTime() : null);
		dto.setEndTime(et != null ? et.toLocalTime() : null);

		dto.setCapacity(rs.getInt("capacity"));
		dto.setBookedCount(rs.getInt("booked_count"));

		SlotDto.HospitalMiniDto hmini = new SlotDto.HospitalMiniDto();
		hmini.setHospitalId(rs.getInt("hospital_id"));
		hmini.setHospitalName(rs.getString("hospital_name"));
		dto.setHospital(hmini);

		VaccineDto vdto = new VaccineDto();
		vdto.setVaccineId(rs.getInt("vaccine_id"));
		vdto.setVaccineName(rs.getString("vaccine_name"));
		vdto.setManufacturer(rs.getString("manufacturer"));
		vdto.setVaccineType(rs.getString("vaccine_type"));
		dto.setVaccine(vdto);

		return dto;
	};

	public List<SlotDto> getAvailableSlots(Integer hospitalId, LocalDate date, Integer vaccineId) {

		boolean filterVaccine = vaccineId != null;

		String sql = """
				    SELECT
				        s.slot_id,
				        s.slot_date,
				        s.start_time,
				        s.end_time,
				        s.capacity,
				        s.booked_count,
				        h.hospital_id,
				        h.hospital_name,
				        v.vaccine_id,
				        v.vaccine_name,
				        v.manufacturer,
				        v.vaccine_type
				    FROM slot s
				    JOIN hospital h ON h.hospital_id = s.hospital_id
				    JOIN vaccine v ON v.vaccine_id = s.vaccine_id
				    WHERE s.hospital_id = ?
				      AND s.slot_date = ?
				      AND s.booked_count < s.capacity
				""" + (filterVaccine ? " AND s.vaccine_id = ? " : "") + " ORDER BY s.start_time";

		if (filterVaccine) {
			return jdbcTemplate.query(sql, rowMapper, hospitalId, Date.valueOf(date), vaccineId);
		}

		return jdbcTemplate.query(sql, rowMapper, hospitalId, Date.valueOf(date));
	}

	public SlotDto getSlotById(Integer slotId) {
		String sql = """
				SELECT
				    s.slot_id,
				    s.slot_date,
				    s.start_time,
				    s.end_time,
				    s.capacity,
				    s.booked_count,
				    h.hospital_id,
				    h.hospital_name,
				    v.vaccine_id,
				    v.vaccine_name,
				    v.manufacturer,
				    v.vaccine_type
				FROM slot s
				JOIN hospital h ON h.hospital_id = s.hospital_id
				JOIN vaccine v ON v.vaccine_id = s.vaccine_id
				WHERE s.slot_id = ?
				""";

		List<SlotDto> list = jdbcTemplate.query(sql, rowMapper, slotId);
		return list.isEmpty() ? null : list.get(0);
	}
}
