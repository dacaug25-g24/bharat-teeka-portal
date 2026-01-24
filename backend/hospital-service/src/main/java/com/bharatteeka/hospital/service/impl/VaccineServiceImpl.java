package com.bharatteeka.hospital.service.impl;

import com.bharatteeka.hospital.entity.Vaccine;
import com.bharatteeka.hospital.repository.VaccineRepository;
import com.bharatteeka.hospital.service.VaccineService;
import org.springframework.stereotype.Service;

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
}

