package com.bharatteeka.patient.controller;

import com.bharatteeka.patient.dto.SlotDto;
import com.bharatteeka.patient.service.SlotService;
import lombok.RequiredArgsConstructor;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;

@RestController
@RequestMapping("/api/slots")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class SlotController {

    private final SlotService slotService;

    @GetMapping("/available")
    public ResponseEntity<?> available(
            @RequestParam Integer hospitalId,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate date,
            @RequestParam(required = false) Integer vaccineId
    ) {
        List<SlotDto> list = slotService.getAvailableSlots(hospitalId, date, vaccineId);
        return ResponseEntity.ok(list);
    }

    // optional endpoint (handy for appointment details UI)
    @GetMapping("/{slotId}")
    public ResponseEntity<?> getSlot(@PathVariable Integer slotId) {
        SlotDto dto = slotService.getSlotDetails(slotId);
        if (dto == null) return ResponseEntity.notFound().build();
        return ResponseEntity.ok(dto);
    }
}
