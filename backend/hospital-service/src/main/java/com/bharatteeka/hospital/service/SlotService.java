package com.bharatteeka.hospital.service;

import com.bharatteeka.hospital.dto.SlotRequest;
import com.bharatteeka.hospital.entity.Slot;

import java.time.LocalDate;
import java.time.LocalTime;
import java.util.List;

public interface SlotService {

    List<Slot> getSlotsByDateAndHospital(LocalDate date, Integer hospitalId);

    List<Slot> getSlotsByDateAndTime(Integer hospitalId, LocalDate date, LocalTime time);

    List<Slot> getAvailableSlots(Integer hospitalId, LocalDate date);

    List<Slot> getSlotsByVaccine(Integer hospitalId, Integer vaccineId, LocalDate date);
    
    Slot createSlot(SlotRequest request);

    Slot updateSlot(Integer slotId, SlotRequest request);

    void deleteSlot(Integer slotId);

}
