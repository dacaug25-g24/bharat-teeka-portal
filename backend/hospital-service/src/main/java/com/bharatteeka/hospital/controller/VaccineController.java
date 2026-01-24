package com.bharatteeka.hospital.controller;

import com.bharatteeka.hospital.entity.Vaccine;
import com.bharatteeka.hospital.service.VaccineService;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/hospital/vaccines")
@CrossOrigin
public class VaccineController {

    private final VaccineService service;

    public VaccineController(VaccineService service) {
        this.service = service;
    }

    @GetMapping
    public List<Vaccine> getAllVaccines() {
        return service.getAllVaccines();
    }

    @GetMapping("/{id}")
    public Vaccine getVaccineById(@PathVariable Integer id) {
        return service.getVaccineById(id);
    }
}

