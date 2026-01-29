package com.bharatteeka.patient.service;

import com.bharatteeka.patient.dto.VaccineDto;
import lombok.RequiredArgsConstructor;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Service;

import java.sql.Date;
import java.time.LocalDate;
import java.util.List;

@Service
@RequiredArgsConstructor
public class VaccineQueryService {

	private final JdbcTemplate jdbcTemplate;

	public List<VaccineDto> getVaccinesByHospital(Integer hospitalId, LocalDate date) {
		boolean filterDate = date != null;

		String sql = """
				    SELECT DISTINCT
				        v.vaccine_id,
				        v.vaccine_name,
				        v.manufacturer,
				        v.vaccine_type
				    FROM slot s
				    JOIN vaccine v ON v.vaccine_id = s.vaccine_id
				    WHERE s.hospital_id = ?
				      AND s.booked_count < s.capacity
				""" + (filterDate ? " AND s.slot_date = ? " : "") + " ORDER BY v.vaccine_name";

		if (filterDate) {
			return jdbcTemplate.query(sql, (rs, rowNum) -> {
				VaccineDto v = new VaccineDto();
				v.setVaccineId(rs.getInt("vaccine_id"));
				v.setVaccineName(rs.getString("vaccine_name"));
				v.setManufacturer(rs.getString("manufacturer"));
				v.setVaccineType(rs.getString("vaccine_type"));
				return v;
			}, hospitalId, Date.valueOf(date));
		}

		return jdbcTemplate.query(sql, (rs, rowNum) -> {
			VaccineDto v = new VaccineDto();
			v.setVaccineId(rs.getInt("vaccine_id"));
			v.setVaccineName(rs.getString("vaccine_name"));
			v.setManufacturer(rs.getString("manufacturer"));
			v.setVaccineType(rs.getString("vaccine_type"));
			return v;
		}, hospitalId);
	}
}
