package com.bharatteeka.patient.service;

import com.bharatteeka.patient.dto.CityDto;
import com.bharatteeka.patient.dto.HospitalDto;
import com.bharatteeka.patient.dto.StateDto;
import lombok.RequiredArgsConstructor;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class LocationQueryService {

	private final JdbcTemplate jdbcTemplate;

	public List<StateDto> getStates() {
		String sql = "SELECT state_id, state_name FROM state ORDER BY state_name";
		return jdbcTemplate.query(sql, (rs, rowNum) -> new StateDto(rs.getInt("state_id"), rs.getString("state_name")));
	}

	public List<CityDto> getCitiesByState(Integer stateId) {
		String sql = "SELECT city_id, city_name, state_id FROM city WHERE state_id = ? ORDER BY city_name";
		return jdbcTemplate.query(sql,
				(rs, rowNum) -> new CityDto(rs.getInt("city_id"), rs.getString("city_name"), rs.getInt("state_id")),
				stateId);
	}

	public List<HospitalDto> getHospitalsByCity(Integer cityId, String hospitalType) {
		boolean filterType = hospitalType != null && !hospitalType.isBlank();

		String sql = """
				SELECT hospital_id, hospital_name, hospital_type, city_id
				FROM hospital
				WHERE city_id = ?
				""" + (filterType ? " AND hospital_type = ? " : "") + " ORDER BY hospital_name";

		if (filterType) {
			return jdbcTemplate.query(sql, (rs, rowNum) -> new HospitalDto(rs.getInt("hospital_id"),
					rs.getString("hospital_name"), rs.getString("hospital_type"), rs.getInt("city_id")), cityId,
					hospitalType);
		}

		return jdbcTemplate.query(sql, (rs, rowNum) -> new HospitalDto(rs.getInt("hospital_id"),
				rs.getString("hospital_name"), rs.getString("hospital_type"), rs.getInt("city_id")), cityId);
	}
}
