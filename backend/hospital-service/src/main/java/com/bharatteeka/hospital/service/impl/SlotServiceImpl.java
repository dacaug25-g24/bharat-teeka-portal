package com.bharatteeka.hospital.service.impl;

import com.bharatteeka.hospital.dto.SlotRequest;
import com.bharatteeka.hospital.entity.Hospital;
import com.bharatteeka.hospital.entity.Slot;
import com.bharatteeka.hospital.entity.Vaccine;
import com.bharatteeka.hospital.repository.HospitalRepository;
import com.bharatteeka.hospital.repository.SlotRepository;
import com.bharatteeka.hospital.repository.VaccineRepository;
import com.bharatteeka.hospital.service.SlotService;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.time.LocalTime;
import java.util.List;

@Service
public class SlotServiceImpl implements SlotService {

    private final SlotRepository repo;
    private final HospitalRepository hospitalRepo;
    private final VaccineRepository vaccineRepo;

    public SlotServiceImpl(
            SlotRepository repo,
            HospitalRepository hospitalRepo,
            VaccineRepository vaccineRepo
    ) {
        this.repo = repo;
        this.hospitalRepo = hospitalRepo;
        this.vaccineRepo = vaccineRepo;
    }

    // ================= READ =================

    public List<Slot> getSlotsByDateAndHospital(LocalDate date, Integer hospitalId) {
        return repo.findByHospitalHospitalIdAndDateAndIsActiveTrue(hospitalId, date);
    }


    @Override
    public List<Slot> getSlotsByDateAndTime(Integer hospitalId, LocalDate date, LocalTime time) {
        return repo.findByHospital_HospitalIdAndDateAndStartTimeLessThanEqualAndEndTimeGreaterThanEqual(
                hospitalId, date, time, time
        );
    }

    @Override
    public List<Slot> getAvailableSlots(Integer hospitalId, LocalDate date) {
        return repo.findAvailableSlots(hospitalId, date);
    }

    @Override
    public List<Slot> getSlotsByVaccine(Integer hospitalId, Integer vaccineId, LocalDate date) {
        return repo.findByHospitalIdAndVaccineIdAndDate(hospitalId, vaccineId, date);
    }


    // ================= CREATE =================

    @Override
    public Slot createSlot(SlotRequest request) {

        Hospital hospital = hospitalRepo.findById(request.getHospitalId())
                .orElseThrow(() -> new RuntimeException("Hospital not found"));

        Vaccine vaccine = vaccineRepo.findById(request.getVaccineId())
                .orElseThrow(() -> new RuntimeException("Vaccine not found"));

        Slot slot = new Slot();
        slot.setHospital(hospital);
        slot.setVaccine(vaccine);
        slot.setDate(request.getDate());
        slot.setStartTime(request.getStartTime());
        slot.setEndTime(request.getEndTime());
        slot.setCapacity(request.getCapacity());
        slot.setBookedCount(0);
        slot.setIsBooked(false);

        return repo.save(slot);
    }

    // ================= UPDATE =================

    @Override
    public Slot updateSlot(Integer slotId, SlotRequest request) {

        Slot slot = repo.findById(slotId)
                .orElseThrow(() -> new RuntimeException("Slot not found"));

        Vaccine vaccine = vaccineRepo.findById(request.getVaccineId())
                .orElseThrow(() -> new RuntimeException("Vaccine not found"));

        slot.setDate(request.getDate());
        slot.setStartTime(request.getStartTime());
        slot.setEndTime(request.getEndTime());
        slot.setCapacity(request.getCapacity());
        slot.setVaccine(vaccine);

        return repo.save(slot);
    }

    // ================= DELETE =================

    @Transactional
    @Override
    public void deleteSlot(Integer slotId) {
        Slot slot = repo.findById(slotId)
                .orElseThrow(() -> new RuntimeException("Slot not found"));

        repo.softDeleteSlot(slotId);
    }


}
