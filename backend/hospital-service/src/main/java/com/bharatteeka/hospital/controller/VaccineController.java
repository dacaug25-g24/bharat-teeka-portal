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

    @GetMapping("/search")
    public List<Vaccine> searchByName(@RequestParam String name) {
        return service.searchByName(name);
    }

    @GetMapping("/expiring")
    public List<Vaccine> expiringSoon(@RequestParam(defaultValue = "30") int days) {
        return service.getExpiring(days);
    }

    @GetMapping("/hospital/{hospitalId}")
    public List<Vaccine> getByHospital(@PathVariable Integer hospitalId) {
        return service.getByHospital(hospitalId);
    }

    @GetMapping("/{id:\\d+}")
    public Vaccine getVaccineById(@PathVariable Integer id) {
        return service.getVaccineById(id);
    }
}
