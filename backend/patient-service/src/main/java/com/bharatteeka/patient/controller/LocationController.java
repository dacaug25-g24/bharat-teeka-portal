package com.bharatteeka.patient.controller;

import com.bharatteeka.patient.service.LookupService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/locations")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class LocationController {

    private final LookupService lookupService;

    @GetMapping("/states")
    public ResponseEntity<?> states() {
        return ResponseEntity.ok(lookupService.getStates());
    }

    @GetMapping("/cities")
    public ResponseEntity<?> cities(@RequestParam Integer stateId) {
        return ResponseEntity.ok(lookupService.getCitiesByState(stateId));
    }

    @GetMapping("/hospitals")
    public ResponseEntity<?> hospitals(@RequestParam Integer cityId) {
        return ResponseEntity.ok(lookupService.getHospitalsByCity(cityId));
    }
}
