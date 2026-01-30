package com.bharatteeka.hospital.controller;

import com.bharatteeka.hospital.dto.PatientBasicResponse;
import com.bharatteeka.hospital.entity.VaccinationRecord;
import com.bharatteeka.hospital.repository.VaccinationRecordRepository;
import com.lowagie.text.Chunk;
import com.lowagie.text.Document;
import com.lowagie.text.Element;
import com.lowagie.text.Font;
import com.lowagie.text.PageSize;
import com.lowagie.text.Paragraph;
import com.lowagie.text.Phrase;

import com.lowagie.text.pdf.PdfPCell;
import com.lowagie.text.pdf.PdfPTable;
import com.lowagie.text.pdf.PdfWriter;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.client.RestTemplate;

import java.awt.Color;
import java.io.ByteArrayOutputStream;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.*;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/hospital/vaccinations/report")
@CrossOrigin
public class VaccinationReportController {

    private final VaccinationRecordRepository repo;
    private final RestTemplate restTemplate = new RestTemplate();

    @Value("${auth.service.url:http://localhost:8080}")
    private String authServiceUrl;

    public VaccinationReportController(VaccinationRecordRepository repo) {
        this.repo = repo;
    }

    @GetMapping("/pdf")
    public ResponseEntity<byte[]> pdf(
            @RequestParam Integer hospitalId,
            @RequestParam(required = false) String hospitalName,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate from,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate to
    ) {
        List<VaccinationRecord> rows =
                repo.findByHospitalHospitalIdAndVaccinationDateBetweenOrderByVaccinationDateDesc(hospitalId, from, to);

        // fetch patient basics so PDF matches dashboard
        Map<Integer, PatientBasicResponse> patientBasics = fetchPatientBasics(rows);

        String safeHospitalName = (hospitalName == null || hospitalName.isBlank())
                ? "Hospital " + hospitalId
                : hospitalName.trim();

        byte[] pdfBytes = buildPdf(rows, patientBasics, hospitalId, safeHospitalName, from, to);

        return ResponseEntity.ok()
                .header(HttpHeaders.CONTENT_DISPOSITION,
                        "attachment; filename=vaccination_report_" + from + "_to_" + to + ".pdf")
                .contentType(MediaType.APPLICATION_PDF)
                .body(pdfBytes);
    }

    // HELPERS 

    private Map<Integer, PatientBasicResponse> fetchPatientBasics(List<VaccinationRecord> rows) {
        Set<Integer> ids = rows.stream()
                .map(VaccinationRecord::getPatientId)
                .filter(Objects::nonNull)
                .collect(Collectors.toSet());

        Map<Integer, PatientBasicResponse> map = new HashMap<>();
        for (Integer id : ids) {
            try {
                String url = authServiceUrl + "/auth/patients/" + id + "/basic";
                PatientBasicResponse res = restTemplate.getForObject(url, PatientBasicResponse.class);
                if (res != null) map.put(id, res);
            } catch (Exception ignored) {
                // if auth service fails, still generate PDF (fallback used)
            }
        }
        return map;
    }

    private byte[] buildPdf(
            List<VaccinationRecord> rows,
            Map<Integer, PatientBasicResponse> patientBasics,
            Integer hospitalId,
            String hospitalName,
            LocalDate from,
            LocalDate to
    ) {
        try {
            ByteArrayOutputStream out = new ByteArrayOutputStream();
            Document doc = new Document(PageSize.A4.rotate(), 24, 24, 22, 22);
            PdfWriter.getInstance(doc, out);
            doc.open();

            // Fonts
            Font titleFont = new Font(Font.HELVETICA, 18, Font.BOLD, new Color(0, 86, 179));
            Font subTitle = new Font(Font.HELVETICA, 11, Font.NORMAL, new Color(60, 60, 60));
            Font sectionTitle = new Font(Font.HELVETICA, 12, Font.BOLD, new Color(25, 25, 25));
            Font normal = new Font(Font.HELVETICA, 9, Font.NORMAL);
            Font bold = new Font(Font.HELVETICA, 9, Font.BOLD);

            // Header block (professional)
            Paragraph header = new Paragraph("BharatTeeka – Vaccination Report", titleFont);
            header.setAlignment(Element.ALIGN_CENTER);
            doc.add(header);

            doc.add(new Paragraph(hospitalName + " (Hospital ID: " + hospitalId + ")", subTitle));
            doc.add(new Paragraph("Date Range: " + from + " to " + to, subTitle));

            String generatedAt = LocalDateTime.now().format(DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm:ss"));
            doc.add(new Paragraph("Generated At: " + generatedAt, subTitle));

            doc.add(Chunk.NEWLINE);

            // Summary section
            doc.add(new Paragraph("Summary", sectionTitle));
            doc.add(Chunk.NEWLINE);

            Map<Integer, Long> doseCounts = rows.stream()
                    .collect(Collectors.groupingBy(r -> (r.getDoseNumber() == null ? -1 : r.getDoseNumber()), Collectors.counting()));

            Map<String, Long> vaccineCounts = rows.stream()
                    .collect(Collectors.groupingBy(r -> {
                        if (r.getVaccine() == null || r.getVaccine().getVaccineName() == null) return "Unknown";
                        return r.getVaccine().getVaccineName();
                    }, Collectors.counting()));

            PdfPTable summary = new PdfPTable(3);
            summary.setWidthPercentage(60);
            summary.setSpacingAfter(10);
            summary.setWidths(new float[]{2f, 1.2f, 3f});

            summary.addCell(summaryCell("Total Records", bold, true));
            summary.addCell(summaryCell(String.valueOf(rows.size()), bold, false));
            summary.addCell(summaryCell(" ", bold, false));

            summary.addCell(summaryCell("Dose-1", normal, true));
            summary.addCell(summaryCell(String.valueOf(doseCounts.getOrDefault(1, 0L)), normal, false));
            summary.addCell(summaryCell("Dose-2: " + doseCounts.getOrDefault(2, 0L) +
                    " | Booster: " + doseCounts.getOrDefault(3, 0L), normal, false));

            String vaccinesLine = vaccineCounts.entrySet().stream()
                    .sorted((a, b) -> Long.compare(b.getValue(), a.getValue()))
                    .map(e -> e.getKey() + " (" + e.getValue() + ")")
                    .collect(Collectors.joining(" | "));

            summary.addCell(summaryCell("Vaccine Split", normal, true));
            summary.addCell(summaryCell("-", normal, false));
            summary.addCell(summaryCell(vaccinesLine.isBlank() ? "-" : vaccinesLine, normal, false));

            doc.add(summary);

            doc.add(Chunk.NEWLINE);

            // Table (matches dashboard columns)
            PdfPTable table = new PdfPTable(10);
            table.setWidthPercentage(100);
            table.setHeaderRows(1);

            table.setWidths(new float[]{
                    1.0f, 1.2f, 2.2f, 2.0f, 1.6f, 0.8f, 1.6f, 1.2f, 0.8f, 2.4f
            });

            addHeader(table, "RecordId");
            addHeader(table, "AppointmentId");
            addHeader(table, "Patient");
            addHeader(table, "Aadhaar");
            addHeader(table, "Vaccine");
            addHeader(table, "Dose");
            addHeader(table, "Batch");
            addHeader(table, "Date");
            addHeader(table, "Slot");
            addHeader(table, "Remarks");

            boolean alt = false;
            for (VaccinationRecord r : rows) {
                alt = !alt;

                Integer pid = r.getPatientId();
                PatientBasicResponse p = pid == null ? null : patientBasics.get(pid);

                String patientName = (p != null && p.getFullName() != null && !p.getFullName().isBlank())
                        ? p.getFullName()
                        : (pid == null ? "-" : "Patient #" + pid);

                String aadhaar = (p != null && p.getAadhaarNumber() != null && !p.getAadhaarNumber().isBlank())
                        ? p.getAadhaarNumber()
                        : "-";

                String appointmentId = (r.getAppointment() != null && r.getAppointment().getAppointmentId() != null)
                        ? String.valueOf(r.getAppointment().getAppointmentId())
                        : "-";

                String vaccineName = (r.getVaccine() != null && r.getVaccine().getVaccineName() != null)
                        ? r.getVaccine().getVaccineName()
                        : "-";

                addRow(table, safe(r.getRecordId()), normal, alt);
                addRow(table, appointmentId, normal, alt);
                addRow(table, patientName, normal, alt);
                addRow(table, aadhaar, normal, alt);
                addRow(table, vaccineName, normal, alt);
                addRow(table, safe(r.getDoseNumber()), normal, alt);
                addRow(table, safe(r.getBatchNumber()), normal, alt);
                addRow(table, safe(r.getVaccinationDate()), normal, alt);
                String slotValue = "-";
                if (r.getSlot() != null && r.getSlot().getSlotId() != null) {
                    slotValue = String.valueOf(r.getSlot().getSlotId());
                }
                addRow(table, slotValue, normal, alt);
                addRow(table, safe(r.getRemarks()), normal, alt);
            }

            doc.add(table);

            doc.add(Chunk.NEWLINE);
            Paragraph footer = new Paragraph(
                    "This report is generated by BharatTeeka Hospital Panel.",
                    new Font(Font.HELVETICA, 9, Font.ITALIC, new Color(120, 120, 120))
            );
            footer.setAlignment(Element.ALIGN_RIGHT);
            doc.add(footer);

            doc.close();
            return out.toByteArray();
        } catch (Exception e) {
            throw new RuntimeException("Failed to generate PDF report", e);
        }
    }

    private PdfPCell summaryCell(String text, Font font, boolean label) {
        PdfPCell c = new PdfPCell(new Phrase(text, font));
        c.setPadding(7);
        c.setBorderColor(new Color(220, 220, 220));
        c.setBackgroundColor(label ? new Color(245, 248, 252) : Color.WHITE);
        return c;
    }

    private void addHeader(PdfPTable table, String text) {
        Font font = new Font(Font.HELVETICA, 10, Font.BOLD, new Color(30, 30, 30));
        PdfPCell c = new PdfPCell(new Phrase(text, font));
        c.setBackgroundColor(new Color(235, 235, 235));
        c.setBorderColor(new Color(200, 200, 200));
        c.setPadding(7);
        table.addCell(c);
    }

    private void addRow(PdfPTable table, String text, Font font, boolean alt) {
        PdfPCell c = new PdfPCell(new Phrase(text == null ? "" : text, font));
        c.setPadding(6);
        c.setBorderColor(new Color(220, 220, 220));
        c.setBackgroundColor(alt ? new Color(250, 250, 250) : Color.WHITE);
        table.addCell(c);
    }

    private String safe(Object o) {
        return o == null ? "-" : String.valueOf(o);
    }
}
