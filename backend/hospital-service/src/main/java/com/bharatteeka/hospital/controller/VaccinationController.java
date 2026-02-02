package com.bharatteeka.hospital.controller;

import com.bharatteeka.hospital.entity.VaccinationRecord;
import com.bharatteeka.hospital.repository.VaccinationRecordRepository;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;

@RestController
@RequestMapping("/hospital/vaccinations")
@CrossOrigin
public class VaccinationController {

    private final VaccinationRecordRepository repo;

    public VaccinationController(VaccinationRecordRepository repo) {
        this.repo = repo;
    }

    @GetMapping("/patient/{patientId}")
    public List<VaccinationRecord> patientVaccinations(@PathVariable Integer patientId) {
        return repo.findByPatientIdOrderByVaccinationDateDesc(patientId);
    }

    @GetMapping("/hospital/{hospitalId}")
    public List<VaccinationRecord> hospitalVaccinations(
            @PathVariable Integer hospitalId,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate from,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate to
    ) {
        return repo.findByHospitalHospitalIdAndVaccinationDateBetweenOrderByVaccinationDateDesc(
                hospitalId, from, to
        );
    }
}
