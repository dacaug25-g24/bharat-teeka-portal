package com.bharatteeka.hospital.controller;

import com.bharatteeka.hospital.entity.Slot;
import com.bharatteeka.hospital.dto.SlotRequest;


import com.bharatteeka.hospital.service.SlotService;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.time.LocalTime;
import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/hospital/slots")
@CrossOrigin
public class SlotController {

    private final SlotService service;

    public SlotController(SlotService service) {
        this.service = service;
    }

    @GetMapping
    public List<Slot> getSlotsByDate(
            @RequestParam Integer hospitalId,
            @RequestParam String date
    ) {
        return service.getSlotsByDateAndHospital(
                LocalDate.parse(date),
                hospitalId
        );
    }

    @GetMapping("/by-time")
    public List<Slot> getSlotsByDateAndTime(
            @RequestParam Integer hospitalId,
            @RequestParam String date,
            @RequestParam String time
    ) {
        return service.getSlotsByDateAndTime(
                hospitalId,
                LocalDate.parse(date),
                LocalTime.parse(time)
        );
    }

    @GetMapping("/available")
    public List<Slot> getAvailableSlots(
            @RequestParam Integer hospitalId,
            @RequestParam String date
    ) {
        return service.getAvailableSlots(hospitalId, LocalDate.parse(date));
    }

    @GetMapping("/by-vaccine")
    public List<Slot> getSlotsByVaccine(
            @RequestParam Integer hospitalId,
            @RequestParam Integer vaccineId,
            @RequestParam String date
    ) {
        return service.getSlotsByVaccine(hospitalId, vaccineId, LocalDate.parse(date));
    }

    
    @PostMapping
    public Slot createSlot(@RequestBody SlotRequest request) {
        return service.createSlot(request);
    }
    
    @PutMapping("/{slotId}")
    public Slot updateSlot(
            @PathVariable Integer slotId,
            @RequestBody SlotRequest request
    ) {
        return service.updateSlot(slotId, request);
    }
   
    @DeleteMapping("/{slotId}")
    public ResponseEntity<String> deleteSlot(@PathVariable Integer slotId) {
        service.deleteSlot(slotId);
        return ResponseEntity.ok("Slot deactivated successfully");
    }



}
