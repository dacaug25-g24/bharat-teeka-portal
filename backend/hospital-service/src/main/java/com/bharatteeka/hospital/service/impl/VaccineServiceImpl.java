package com.bharatteeka.hospital.service.impl;

import com.bharatteeka.hospital.entity.Vaccine;
import com.bharatteeka.hospital.repository.VaccineRepository;
import com.bharatteeka.hospital.service.VaccineService;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.List;

@Service
public class VaccineServiceImpl implements VaccineService {

    private final VaccineRepository repo;

    public VaccineServiceImpl(VaccineRepository repo) {
        this.repo = repo;
    }

    @Override
    public List<Vaccine> getAllVaccines() {
        return repo.findAll();
    }

    @Override
    public Vaccine getVaccineById(Integer id) {
        return repo.findById(id)
                .orElseThrow(() -> new RuntimeException("Vaccine not found with id " + id));
    }

    @Override
    public List<Vaccine> searchByName(String name) {
        if (name == null || name.trim().isEmpty()) return repo.findAll();
        return repo.findByVaccineNameContainingIgnoreCase(name.trim());
    }

    @Override
    public List<Vaccine> getExpiring(int days) {
        if (days <= 0) days = 30;
        LocalDate cutoff = LocalDate.now().plusDays(days);
        return repo.findByExpiryDateLessThanEqual(cutoff);
    }

    @Override
    public List<Vaccine> getByHospital(Integer hospitalId) {
        if (hospitalId == null) return List.of();
        return repo.findByHospitalId(hospitalId);
    }
}
