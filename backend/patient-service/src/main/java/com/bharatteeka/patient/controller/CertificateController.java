package com.bharatteeka.patient.controller;

import com.bharatteeka.patient.dto.CertificateDetailsDto;
import com.bharatteeka.patient.service.CertificateService;
import com.bharatteeka.patient.util.CertificatePdfGenerator;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/certificates")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class CertificateController {

    private final CertificateService certificateService;

    /**
     * Download vaccination certificate as PDF.
     *
     * You can pass either:
     *  - appointmentId (preferred) OR
     *  - patientId
     *
     * Authorization header will be forwarded to hospital-service.
     */
    @GetMapping("/download")
    public ResponseEntity<byte[]> downloadCertificate(
            @RequestParam(required = false) Integer appointmentId,
            @RequestParam(required = false) Integer patientId,
            @RequestHeader(value = "Authorization", required = false) String authHeader
    ) {
        try {
            // ✅ basic validation
            if (appointmentId == null && patientId == null) {
                return ResponseEntity.badRequest()
                        .contentType(MediaType.TEXT_PLAIN)
                        .body("Please provide either appointmentId or patientId".getBytes());
            }

            CertificateDetailsDto dto =
                    certificateService.getCertificateData(appointmentId, patientId, authHeader);

            byte[] pdfBytes = CertificatePdfGenerator.generate(dto);

            return ResponseEntity.ok()
                    .contentType(MediaType.APPLICATION_PDF)
                    .header(HttpHeaders.CONTENT_DISPOSITION,
                            "attachment; filename=vaccination-certificate.pdf")
                    .body(pdfBytes);

        } catch (IllegalArgumentException ex) {
            // ✅ known business validation issues
            return ResponseEntity.badRequest()
                    .contentType(MediaType.TEXT_PLAIN)
                    .body(("Bad Request: " + ex.getMessage()).getBytes());

        } catch (Exception ex) {
            // ✅ avoid breaking download with raw stacktrace
            return ResponseEntity.internalServerError()
                    .contentType(MediaType.TEXT_PLAIN)
                    .body(("Failed to generate certificate: " + ex.getMessage()).getBytes());
        }
    }
}
