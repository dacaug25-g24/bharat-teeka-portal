package com.bharatteeka.hospital.controller;

import com.bharatteeka.hospital.entity.Slot;
import com.bharatteeka.hospital.service.SlotService;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.time.LocalTime;
import java.util.List;

@RestController
@RequestMapping("/hospital/slots")
@CrossOrigin
public class SlotController {

    private final SlotService service;

    public SlotController(SlotService service) {
        this.service = service;
    }

    // Search slots by date and hospital
    @GetMapping("/date/{date}/hospital/{hospitalId}")
    public List<Slot> slotsByDateAndHospital(@PathVariable String date, @PathVariable Integer hospitalId) {
        LocalDate d = LocalDate.parse(date);
        List<Slot> slots = service.getSlotsByDateAndHospital(d, hospitalId);
        if (slots.isEmpty()) {
            throw new RuntimeException("No slots available for this hospital on this date");
        }
        return slots;
    }

    // Search slot by date, time, and hospital
    @GetMapping("/search")
    public List<Slot> slotsByDateAndTime(
            @RequestParam Integer hospitalId,
            @RequestParam String date,
            @RequestParam String time
    ) {
        LocalDate d = LocalDate.parse(date);
        LocalTime t = LocalTime.parse(time);
        List<Slot> slots = service.getSlotsByDateAndTime(hospitalId, d, t);
        if (slots.isEmpty()) {
            throw new RuntimeException("No slot available at this date and time");
        }
        return slots;
    }
}
