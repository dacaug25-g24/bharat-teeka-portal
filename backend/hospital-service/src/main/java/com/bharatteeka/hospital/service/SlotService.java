package com.bharatteeka.hospital.service;

import com.bharatteeka.hospital.entity.Slot;

import java.time.LocalDate;
import java.time.LocalTime;
import java.util.List;

public interface SlotService {

    List<Slot> getSlotsByDateAndHospital(LocalDate date, Integer hospitalId);

    List<Slot> getSlotsByDateAndTime(Integer hospitalId, LocalDate date, LocalTime time);
}
