package com.bharatteeka.patient.controller;

import com.bharatteeka.patient.dto.VaccineDto;
import com.bharatteeka.patient.service.SlotService;
import lombok.RequiredArgsConstructor;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;

@RestController
@RequestMapping("/api/vaccines")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class VaccineController {

    private final SlotService slotService;

    @GetMapping("/by-hospital")
    public ResponseEntity<?> byHospital(
            @RequestParam Integer hospitalId,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate date
    ) {
        List<VaccineDto> list = slotService.getVaccinesByHospital(hospitalId, date);
        return ResponseEntity.ok(list);
    }
}
