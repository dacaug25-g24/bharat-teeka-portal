package com.bharatteeka.auth.controller;

import com.bharatteeka.auth.dto.PatientBasicResponse;
import com.bharatteeka.auth.entity.Patient;
import com.bharatteeka.auth.repository.PatientRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/auth/patients")

public class PatientController {

    private final PatientRepository repo;

    public PatientController(PatientRepository repo) {
        this.repo = repo;
    }

    @GetMapping("/{patientId}/basic")
    public ResponseEntity<PatientBasicResponse> getBasic(@PathVariable Integer patientId) {

        return repo.findById(patientId)
                .map(p -> {
                    String fullName =
                            ((p.getFirstName() == null ? "" : p.getFirstName()) + " " +
                             (p.getLastName() == null ? "" : p.getLastName())).trim();

                    return ResponseEntity.ok(
                            new PatientBasicResponse(
                                    p.getPatientId(),
                                    fullName.isBlank() ? "Patient #" + patientId : fullName,
                                    p.getAadhaarNumber() == null ? "-" : p.getAadhaarNumber()
                            )
                    );
                })
                //  FALLBACK — DO NOT CRASH REPORTS
                .orElseGet(() ->
                        ResponseEntity.ok(
                                new PatientBasicResponse(
                                        patientId,
                                        "Patient #" + patientId,
                                        "-"
                                )
                        )
                );
    }
}
