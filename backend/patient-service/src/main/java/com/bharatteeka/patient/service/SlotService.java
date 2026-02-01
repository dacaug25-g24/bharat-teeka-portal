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
public class SlotService {

    private final JdbcTemplate jdbcTemplate;

    private final RowMapper<SlotDto> slotMapper = (rs, rowNum) -> {
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

        // nested hospital mini dto
        SlotDto.HospitalMiniDto h = new SlotDto.HospitalMiniDto();
        h.setHospitalId(rs.getInt("hospital_id"));
        h.setHospitalName(rs.getString("hospital_name"));
        dto.setHospital(h);

        // nested vaccine dto (keep only needed fields)
        VaccineDto v = new VaccineDto();
        v.setVaccineId(rs.getInt("vaccine_id"));
        v.setVaccineName(rs.getString("vaccine_name"));
        v.setManufacturer(rs.getString("manufacturer"));
        v.setVaccineType(rs.getString("vaccine_type"));
        dto.setVaccine(v);

        return dto;
    };

    public List<SlotDto> getAvailableSlots(Integer hospitalId, LocalDate date, Integer vaccineId) {
        boolean filterVaccine = (vaccineId != null);

        String sql = """
            SELECT
                s.slot_id, s.slot_date, s.start_time, s.end_time,
                s.capacity, s.booked_count,
                s.hospital_id, h.hospital_name,
                s.vaccine_id, v.vaccine_name, v.manufacturer, v.vaccine_type
            FROM slot s
            JOIN hospital h ON h.hospital_id = s.hospital_id
            JOIN vaccine v ON v.vaccine_id = s.vaccine_id
            WHERE s.is_active = 1
              AND s.hospital_id = ?
              AND s.slot_date = ?
              AND s.booked_count < s.capacity
        """;

        if (filterVaccine) {
            sql += " AND s.vaccine_id = ? ";
            return jdbcTemplate.query(sql, slotMapper, hospitalId, date, vaccineId);
        }
        return jdbcTemplate.query(sql, slotMapper, hospitalId, date);
    }

    public List<VaccineDto> getVaccinesByHospital(Integer hospitalId, LocalDate date) {
        boolean filterDate = (date != null);

        String sql = """
            SELECT DISTINCT
                v.vaccine_id, v.vaccine_name, v.manufacturer, v.vaccine_type
            FROM slot s
            JOIN vaccine v ON v.vaccine_id = s.vaccine_id
            WHERE s.is_active = 1
              AND s.hospital_id = ?
        """;

        if (filterDate) sql += " AND s.slot_date = ? ";
        sql += " ORDER BY v.vaccine_name ";

        RowMapper<VaccineDto> mapper = (rs, rowNum) -> {
            VaccineDto dto = new VaccineDto();
            dto.setVaccineId(rs.getInt("vaccine_id"));
            dto.setVaccineName(rs.getString("vaccine_name"));
            dto.setManufacturer(rs.getString("manufacturer"));
            dto.setVaccineType(rs.getString("vaccine_type"));
            return dto;
        };

        if (filterDate) return jdbcTemplate.query(sql, mapper, hospitalId, date);
        return jdbcTemplate.query(sql, mapper, hospitalId);
    }

    public SlotDto getSlotDetails(Integer slotId) {
        String sql = """
            SELECT
                s.slot_id, s.slot_date, s.start_time, s.end_time,
                s.capacity, s.booked_count,
                s.hospital_id, h.hospital_name,
                s.vaccine_id, v.vaccine_name, v.manufacturer, v.vaccine_type
            FROM slot s
            JOIN hospital h ON h.hospital_id = s.hospital_id
            JOIN vaccine v ON v.vaccine_id = s.vaccine_id
            WHERE s.slot_id = ?
        """;
        List<SlotDto> list = jdbcTemplate.query(sql, slotMapper, slotId);
        return list.isEmpty() ? null : list.get(0);
    }
}
