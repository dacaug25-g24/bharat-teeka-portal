package com.bharatteeka.patient.service;

import com.bharatteeka.patient.dto.CertificateDetailsDto;
import com.bharatteeka.patient.dto.VaccinationRecordDto;
import com.bharatteeka.patient.entity.Appointment;
import com.bharatteeka.patient.entity.Patient;
import com.bharatteeka.patient.repository.AppointmentRepository;
import com.bharatteeka.patient.repository.PatientRepository;
import com.bharatteeka.patient.service.external.HospitalApiClient;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.web.client.HttpClientErrorException;

import java.util.Comparator;
import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class CertificateService {

    private final AppointmentRepository appointmentRepository;
    private final PatientRepository patientRepository;
    private final HospitalApiClient hospitalApiClient;

    public CertificateDetailsDto getCertificateData(
            Integer appointmentId,
            Integer patientId,
            String authHeader
    ) {
        // ✅ Token required because hospital-service is protected (your logs show 403)
        String bearer = normalizeBearer(authHeader);

        Integer finalPatientId = resolvePatientId(appointmentId, patientId);

        // ✅ patient-service responsibility
        Patient patient = patientRepository.findById(finalPatientId)
                .orElseThrow(() -> new IllegalArgumentException("Patient not found for patientId=" + finalPatientId));

        String patientName = safe(patient.getFirstName()) + " " + safe(patient.getLastName());

        // ✅ hospital-service responsibility
        List<VaccinationRecordDto> records;
        try {
            records = hospitalApiClient.getVaccinationsByPatient(finalPatientId, bearer);
        } catch (HttpClientErrorException.Forbidden ex) {
            // This is exactly what your console shows (403)
            throw new IllegalArgumentException(
                    "Hospital-service returned 403 Forbidden. " +
                    "Check: (1) token is valid, (2) patient-service is sending Authorization header, " +
                    "(3) hospital-service SecurityConfig allows this role/API."
            );
        } catch (HttpClientErrorException ex) {
            throw new IllegalArgumentException(
                    "Hospital-service error: " + ex.getStatusCode() + " " + ex.getStatusText()
            );
        } catch (Exception ex) {
            throw new IllegalArgumentException("Failed to fetch vaccination records from hospital-service: " + ex.getMessage());
        }

        if (records == null || records.isEmpty()) {
            throw new IllegalArgumentException("No vaccination record found for certificate");
        }

        // ✅ pick "latest/best" record: highest doseNumber (simple + stable)
        VaccinationRecordDto record = records.stream()
                .max(Comparator.comparingInt(r -> Optional.ofNullable(r.getDoseNumber()).orElse(0)))
                .orElse(records.get(0));

        return CertificateDetailsDto.builder()
                .patientName(patientName.trim())

                .vaccineName(
                        record.getVaccine() != null
                                ? record.getVaccine().getVaccineName()
                                : null
                )

                .doseNumber(record.getDoseNumber())
                .vaccinationDate(record.getVaccinationDate())

                .hospitalName(
                        record.getHospital() != null
                                ? record.getHospital().getHospitalName()
                                : null
                )
                .build();
    }

    private Integer resolvePatientId(Integer appointmentId, Integer patientId) {

        if (appointmentId != null) {
            Appointment appt = appointmentRepository.findById(appointmentId)
                    .orElseThrow(() -> new IllegalArgumentException("Appointment not found for appointmentId=" + appointmentId));

            if (appt.getPatientId() == null) {
                throw new IllegalArgumentException("Appointment has no patientId (appointmentId=" + appointmentId + ")");
            }
            return appt.getPatientId();
        }

        if (patientId == null) {
            throw new IllegalArgumentException("patientId or appointmentId is required");
        }

        return patientId;
    }

    /**
     * Ensures we always send "Bearer <token>" to hospital-service.
     * Accepts:
     *  - "Bearer abc"
     *  - "abc"
     */
    private String normalizeBearer(String authHeader) {
        if (authHeader == null || authHeader.trim().isEmpty()) {
            throw new IllegalArgumentException("Authorization token is required to download certificate");
        }

        String t = authHeader.trim();
        if (t.startsWith("Bearer ")) return t;

        // if token comes without Bearer prefix
        return "Bearer " + t;
    }

    private String safe(String s) {
        return s == null ? "" : s;
    }
}
