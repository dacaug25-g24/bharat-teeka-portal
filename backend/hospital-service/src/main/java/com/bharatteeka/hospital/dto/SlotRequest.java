package com.bharatteeka.hospital.dto;

import lombok.Data;
import java.time.LocalDate;
import java.time.LocalTime;

@Data
public class SlotRequest {

    private Integer hospitalId;
    private Integer vaccineId;

    private LocalDate date;
    private LocalTime startTime;
    private LocalTime endTime;

    private Integer capacity;
}
