package com.bharatteeka.patient.service.external;

import com.bharatteeka.patient.dto.VaccinationRecordDto;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.*;
import org.springframework.stereotype.Component;
import org.springframework.web.client.HttpClientErrorException;
import org.springframework.web.client.RestTemplate;

import java.util.Arrays;
import java.util.List;

@Component
@RequiredArgsConstructor
public class HospitalApiClient {

    private final RestTemplate restTemplate;

    @Value("${hospital.service.base-url:http://localhost:8081}")
    private String hospitalBaseUrl;

    /**
     * Default endpoint path (your current one).
     * If your hospital-service uses /api prefix, set:
     * hospital.service.vaccinations-path=/api/hospital/vaccinations/patient/{patientId}
     */
    @Value("${hospital.service.vaccinations-path:/hospital/vaccinations/patient/{patientId}}")
    private String vaccinationsPath;

    public List<VaccinationRecordDto> getVaccinationsByPatient(Integer patientId, String authHeader) {

        if (patientId == null) {
            throw new IllegalArgumentException("patientId is required");
        }

        // Build primary URL from config
        String url = hospitalBaseUrl + vaccinationsPath.replace("{patientId}", String.valueOf(patientId));

        HttpHeaders headers = new HttpHeaders();
        headers.setAccept(List.of(MediaType.APPLICATION_JSON));

        // ✅ forward token safely as "Bearer <token>"
        headers.set(HttpHeaders.AUTHORIZATION, normalizeBearer(authHeader));

        HttpEntity<Void> entity = new HttpEntity<>(headers);

        try {
            ResponseEntity<VaccinationRecordDto[]> res = restTemplate.exchange(
                    url,
                    HttpMethod.GET,
                    entity,
                    VaccinationRecordDto[].class
            );

            VaccinationRecordDto[] arr = res.getBody();
            return arr == null ? List.of() : Arrays.asList(arr);

        } catch (HttpClientErrorException.NotFound ex) {
            // ✅ optional fallback: if hospital-service is actually under /api and config not set
            String fallbackUrl = hospitalBaseUrl + "/api/hospital/vaccinations/patient/" + patientId;

            try {
                ResponseEntity<VaccinationRecordDto[]> res2 = restTemplate.exchange(
                        fallbackUrl,
                        HttpMethod.GET,
                        entity,
                        VaccinationRecordDto[].class
                );
                VaccinationRecordDto[] arr2 = res2.getBody();
                return arr2 == null ? List.of() : Arrays.asList(arr2);
            } catch (HttpClientErrorException ex2) {
                throw ex2; // handled below
            }

        } catch (HttpClientErrorException.Forbidden ex) {
            // This is your current problem
            throw new IllegalArgumentException(
                    "403 Forbidden from hospital-service for GET " + url + ". " +
                    "Meaning: token is invalid/expired OR hospital-service SecurityConfig does not allow this endpoint for PATIENT token. " +
                    "Fix required in hospital-service security (permit this endpoint for patient-service calls)."
            );

        } catch (HttpClientErrorException ex) {
            throw new IllegalArgumentException(
                    "Hospital-service error: " + ex.getStatusCode() + " " + ex.getStatusText() +
                    " for GET " + url
            );
        }
    }

    /**
     * Accepts:
     *  - "Bearer abc"
     *  - "abc"
     * Returns always: "Bearer abc"
     */
    private String normalizeBearer(String authHeader) {
        if (authHeader == null || authHeader.trim().isEmpty()) {
            throw new IllegalArgumentException("Authorization token is required to call hospital-service");
        }

        String t = authHeader.trim();
        if (t.startsWith("Bearer ")) return t;
        return "Bearer " + t;
    }
}
