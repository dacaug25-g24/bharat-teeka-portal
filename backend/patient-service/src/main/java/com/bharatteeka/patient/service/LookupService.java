package com.bharatteeka.patient.service;

import com.bharatteeka.patient.dto.CityDto;
import com.bharatteeka.patient.dto.HospitalDto;
import com.bharatteeka.patient.dto.StateDto;
import lombok.RequiredArgsConstructor;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.jdbc.core.RowMapper;
import org.springframework.stereotype.Service;

import java.sql.ResultSet;
import java.sql.SQLException;
import java.util.List;

@Service
@RequiredArgsConstructor
public class LookupService {

    private final JdbcTemplate jdbcTemplate;

    
    // Public APIs
    
    public List<StateDto> getStates() {
        String sql = """
            SELECT state_id, state_name
            FROM state
            ORDER BY state_name
        """;
        return jdbcTemplate.query(sql, stateRowMapper());
    }

    public List<CityDto> getCitiesByState(Integer stateId) {
        String sql = """
            SELECT city_id, city_name, state_id
            FROM city
            WHERE state_id = ?
            ORDER BY city_name
        """;
        return jdbcTemplate.query(sql, cityRowMapper(), stateId);
    }

    public List<HospitalDto> getHospitalsByCity(Integer cityId) {
        String sql = """
            SELECT hospital_id, hospital_name, hospital_type, city_id
            FROM hospital
            WHERE city_id = ?
            ORDER BY hospital_name
        """;
        return jdbcTemplate.query(sql, hospitalRowMapper(), cityId);
    }

    
    // RowMappers
    

    private RowMapper<StateDto> stateRowMapper() {
        return new RowMapper<>() {
            @Override
            public StateDto mapRow(ResultSet rs, int rowNum) throws SQLException {
                return new StateDto(
                        rs.getInt("state_id"),
                        rs.getString("state_name")
                );
            }
        };
    }

    private RowMapper<CityDto> cityRowMapper() {
        return new RowMapper<>() {
            @Override
            public CityDto mapRow(ResultSet rs, int rowNum) throws SQLException {
                CityDto dto = new CityDto();
                dto.setCityId(rs.getInt("city_id"));
                dto.setCityName(rs.getString("city_name"));
                dto.setStateId(rs.getInt("state_id"));
                return dto;
            }
        };
    }

    private RowMapper<HospitalDto> hospitalRowMapper() {
        return new RowMapper<>() {
            @Override
            public HospitalDto mapRow(ResultSet rs, int rowNum) throws SQLException {
                HospitalDto dto = new HospitalDto();
                dto.setHospitalId(rs.getInt("hospital_id"));
                dto.setHospitalName(rs.getString("hospital_name"));
                dto.setHospitalType(rs.getString("hospital_type"));
                dto.setCityId(rs.getInt("city_id"));
                return dto;
            }
        };
    }
}
