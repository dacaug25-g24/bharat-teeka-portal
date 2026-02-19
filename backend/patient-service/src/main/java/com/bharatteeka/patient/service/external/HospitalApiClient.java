package com.bharatteeka.patient.service.external;

import com.bharatteeka.patient.dto.VaccinationRecordDto;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Component;
import org.springframework.web.reactive.function.client.WebClient;
import org.springframework.web.reactive.function.client.WebClientResponseException;
import reactor.core.publisher.Mono;

import java.time.Duration;
import java.util.List;

@Component
@RequiredArgsConstructor
public class HospitalApiClient {

    private final WebClient webClient;

    @Value("${hospital.service.base-url:http://localhost:9090}")
    private String hospitalBaseUrl;

    @Value("${hospital.service.vaccinations-path:/hospital/vaccinations/patient/{patientId}}")
    private String vaccinationsPath;

    @Value("${hospital.service.timeout-ms:2000}")
    private long timeoutMs;

    /**
     * If your Appointment/Certificate service layer is non-reactive and expects List,
     * keep this method blocking to minimize refactor.
     * (Interview line: "Internally WebClient is reactive, but we block at boundary.")
     */
    public List<VaccinationRecordDto> getVaccinationsByPatient(Integer patientId, String authHeader) {

        if (patientId == null) throw new IllegalArgumentException("patientId is required");

        String token = normalizeBearer(authHeader);

        String url = hospitalBaseUrl + vaccinationsPath.replace("{patientId}", String.valueOf(patientId));

        return webClient.get()
                .uri(url)
                .accept(MediaType.APPLICATION_JSON)
                .header(HttpHeaders.AUTHORIZATION, token)
                .retrieve()
                .bodyToFlux(VaccinationRecordDto.class)
                .collectList()
                .timeout(Duration.ofMillis(timeoutMs))
                // fallback for any error (timeout / 5xx / 4xx). Keep it simple.
                .onErrorResume(ex -> fallback(ex, url))
                .block();
    }

    private Mono<List<VaccinationRecordDto>> fallback(Throwable ex, String url) {

        // Clean interview-friendly logs/messages
        if (ex instanceof WebClientResponseException wex) {

            // If 403 -> almost always security mismatch or token issue
            if (wex.getStatusCode().value() == 403) {
                return Mono.error(new IllegalArgumentException(
                        "403 Forbidden from hospital-service for GET " + url +
                        ". Token invalid/expired OR hospital-service SecurityConfig blocks this endpoint."
                ));
            }

            // If 404 -> route/path mismatch (common when moving through gateway)
            if (wex.getStatusCode().value() == 404) {
                // Simple fallback: return empty list instead of failing whole flow
                return Mono.just(List.of());
            }

            // For other 4xx, bubble up clean error
            if (wex.getStatusCode().is4xxClientError()) {
                return Mono.error(new IllegalArgumentException(
                        "Hospital-service client error: " + wex.getStatusCode().value() +
                        " for GET " + url
                ));
            }

            // For 5xx, return empty list (degrade gracefully)
            if (wex.getStatusCode().is5xxServerError()) {
                return Mono.just(List.of());
            }
        }

        // timeout or network error -> degrade
        return Mono.just(List.of());
    }

    private String normalizeBearer(String authHeader) {
        if (authHeader == null || authHeader.trim().isEmpty()) {
            throw new IllegalArgumentException("Authorization token is required to call hospital-service");
        }
        String t = authHeader.trim();
        return t.startsWith("Bearer ") ? t : "Bearer " + t;
    }
}
