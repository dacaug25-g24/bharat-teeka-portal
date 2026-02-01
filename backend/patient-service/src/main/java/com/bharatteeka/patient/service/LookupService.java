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
public class LookupService {

    private final JdbcTemplate jdbcTemplate;

    public List<StateDto> getStates() {
        String sql = "SELECT state_id, state_name FROM state ORDER BY state_name";
        return jdbcTemplate.query(sql, (rs, i) ->
                new StateDto(rs.getInt("state_id"), rs.getString("state_name"))
        );
    }

    public List<CityDto> getCitiesByState(Integer stateId) {
        String sql = """
            SELECT city_id, city_name, state_id
            FROM city
            WHERE state_id = ?
            ORDER BY city_name
        """;
        return jdbcTemplate.query(sql, (rs, i) -> {
            CityDto dto = new CityDto();
            dto.setCityId(rs.getInt("city_id"));
            dto.setCityName(rs.getString("city_name"));
            dto.setStateId(rs.getInt("state_id"));
            return dto;
        }, stateId);
    }

    public List<HospitalDto> getHospitalsByCity(Integer cityId) {
        String sql = """
            SELECT hospital_id, hospital_name, hospital_type, city_id
            FROM hospital
            WHERE city_id = ?
            ORDER BY hospital_name
        """;

        return jdbcTemplate.query(sql, (rs, i) -> {
            HospitalDto dto = new HospitalDto();
            dto.setHospitalId(rs.getInt("hospital_id"));
            dto.setHospitalName(rs.getString("hospital_name"));
            dto.setHospitalType(rs.getString("hospital_type"));
            dto.setCityId(rs.getInt("city_id"));
            return dto;
        }, cityId);
    }

}
