package com.bharatteeka.hospital.service.impl;

import com.bharatteeka.hospital.entity.Slot;
import com.bharatteeka.hospital.repository.SlotRepository;
import com.bharatteeka.hospital.service.SlotService;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.LocalTime;
import java.util.List;

@Service
public class SlotServiceImpl implements SlotService {

    private final SlotRepository repo;

    public SlotServiceImpl(SlotRepository repo) {
        this.repo = repo;
    }

    @Override
    public List<Slot> getSlotsByDateAndHospital(LocalDate date, Integer hospitalId) {
        return repo.findByHospital_HospitalIdAndDate(hospitalId, date);
    }

    @Override
    public List<Slot> getSlotsByDateAndTime(Integer hospitalId, LocalDate date, LocalTime time) {
        return repo.findByHospital_HospitalIdAndDateAndStartTimeLessThanEqualAndEndTimeGreaterThanEqual(
                hospitalId, date, time, time
        );
    }
}
