package com.bharatteeka.patient.util;

import com.bharatteeka.patient.dto.CertificateDetailsDto;
import com.lowagie.text.*;
import com.lowagie.text.pdf.*;

import java.awt.Color;
import java.io.ByteArrayOutputStream;
import java.time.LocalDate;
import java.time.format.DateTimeFormatter;

public class CertificatePdfGenerator {

    private CertificatePdfGenerator() {
        // utility class
    }

    public static byte[] generate(CertificateDetailsDto dto) {
        try {
            Document document = new Document(PageSize.A4, 36, 36, 32, 36);
            ByteArrayOutputStream out = new ByteArrayOutputStream();

            PdfWriter writer = PdfWriter.getInstance(document, out);
            writer.setPageEvent(new WatermarkPageEvent());

            document.open();

            // ---------- Fonts ----------
            Font headerTitle = new Font(Font.HELVETICA, 14, Font.BOLD, Color.WHITE);
            Font certTitle = new Font(Font.HELVETICA, 18, Font.BOLD, new Color(18, 52, 105));
            Font subTitle = new Font(Font.HELVETICA, 10, Font.NORMAL, new Color(90, 90, 90));

            Font label = new Font(Font.HELVETICA, 10, Font.BOLD, new Color(40, 40, 40));
            Font value = new Font(Font.HELVETICA, 10, Font.NORMAL, new Color(30, 30, 30));

            Font tableHead = new Font(Font.HELVETICA, 10, Font.BOLD, Color.WHITE);
            Font tableCell = new Font(Font.HELVETICA, 10, Font.NORMAL, new Color(30, 30, 30));

            Font footNote = new Font(Font.HELVETICA, 9, Font.ITALIC, new Color(110, 110, 110));

            // ---------- Header Bar ----------
            PdfPTable header = new PdfPTable(1);
            header.setWidthPercentage(100);

            PdfPCell headerCell = new PdfPCell(new Phrase("Bharat Teeka Portal", headerTitle));
            headerCell.setBorder(Rectangle.NO_BORDER);
            headerCell.setBackgroundColor(new Color(18, 52, 105));
            headerCell.setPadding(12);
            header.addCell(headerCell);

            document.add(header);

            document.add(Chunk.NEWLINE);

            // ---------- Certificate Title ----------
            Paragraph title = new Paragraph("Vaccination Certificate", certTitle);
            title.setAlignment(Element.ALIGN_CENTER);
            document.add(title);

            Paragraph subtitle = new Paragraph(
                    "This certificate is generated digitally for vaccination verification.",
                    subTitle
            );
            subtitle.setAlignment(Element.ALIGN_CENTER);
            document.add(subtitle);

            document.add(Chunk.NEWLINE);

            // ---------- Meta Row (Certificate No + Issue Date) ----------
            PdfPTable meta = new PdfPTable(2);
            meta.setWidthPercentage(100);
            meta.setWidths(new float[]{1f, 1f});

            String certificateNo = "BT-" + safe(dto.getPatientName()).toUpperCase().replace(" ", "").hashCode();
            String issueDate = LocalDate.now().format(DateTimeFormatter.ISO_DATE);

            meta.addCell(metaCell("Certificate No:", certificateNo, label, value));
            meta.addCell(metaCell("Issue Date:", issueDate, label, value));

            document.add(meta);

            document.add(Chunk.NEWLINE);

            // ---------- Beneficiary Details Box ----------
            PdfPTable beneficiary = new PdfPTable(2);
            beneficiary.setWidthPercentage(100);
            beneficiary.setWidths(new float[]{1f, 1f});

            PdfPCell boxTitle = new PdfPCell(new Phrase("Beneficiary Details", new Font(Font.HELVETICA, 12, Font.BOLD, new Color(18, 52, 105))));
            boxTitle.setColspan(2);
            boxTitle.setPadding(10);
            boxTitle.setBackgroundColor(new Color(235, 242, 255));
            boxTitle.setBorderColor(new Color(190, 210, 240));
            beneficiary.addCell(boxTitle);

            beneficiary.addCell(kvCell("Patient Name", dto.getPatientName(), label, value));
            beneficiary.addCell(kvCell("Hospital Name", dto.getHospitalName(), label, value));

            document.add(beneficiary);

            document.add(Chunk.NEWLINE);

            // ---------- Vaccination Details Table ----------
            PdfPTable table = new PdfPTable(4);
            table.setWidthPercentage(100);
            table.setSpacingBefore(5);
            table.setWidths(new float[]{1.4f, 1.2f, 1.2f, 2.2f});

            addTH(table, "Vaccine Name", tableHead);
            addTH(table, "Dose No.", tableHead);
            addTH(table, "Vaccination Date", tableHead);
            addTH(table, "Vaccination Center", tableHead);

            addTD(table, dto.getVaccineName(), tableCell);
            addTD(table, String.valueOf(dto.getDoseNumber()), tableCell);
            addTD(table, dto.getVaccinationDate() == null ? "-" : dto.getVaccinationDate().toString(), tableCell);
            addTD(table, dto.getHospitalName(), tableCell);

            document.add(table);

            document.add(Chunk.NEWLINE);

            // ---------- Signature / Footer ----------
            PdfPTable sign = new PdfPTable(2);
            sign.setWidthPercentage(100);
            sign.setWidths(new float[]{1f, 1f});

            PdfPCell left = new PdfPCell(new Phrase(
                    "This is a system-generated certificate.\nNo physical signature is required.",
                    footNote
            ));
            left.setBorder(Rectangle.NO_BORDER);
            left.setPaddingTop(10);

            PdfPCell right = new PdfPCell(new Phrase(
                    "Authorized by:\nBharat Teeka System",
                    new Font(Font.HELVETICA, 10, Font.BOLD, new Color(50, 50, 50))
            ));
            right.setHorizontalAlignment(Element.ALIGN_RIGHT);
            right.setBorder(Rectangle.NO_BORDER);
            right.setPaddingTop(10);

            sign.addCell(left);
            sign.addCell(right);

            document.add(sign);

            document.add(Chunk.NEWLINE);

            Paragraph verification = new Paragraph(
                    "Verification: Match beneficiary details with hospital records. Generated via BharatTeekaPortal.",
                    footNote
            );
            verification.setAlignment(Element.ALIGN_CENTER);
            document.add(verification);

            document.close();
            return out.toByteArray();

        } catch (Exception e) {
            throw new RuntimeException("Failed to generate certificate PDF", e);
        }
    }

    // ---------------- Helpers ----------------

    private static String safe(String s) {
        return (s == null || s.trim().isEmpty()) ? "-" : s.trim();
    }

    private static PdfPCell metaCell(String k, String v, Font keyFont, Font valFont) {
        PdfPCell c = new PdfPCell();
        c.setBorderColor(new Color(210, 210, 210));
        c.setPadding(8);
        Paragraph p = new Paragraph();
        p.add(new Phrase(k + " ", keyFont));
        p.add(new Phrase(safe(v), valFont));
        c.addElement(p);
        return c;
    }

    private static PdfPCell kvCell(String k, String v, Font keyFont, Font valFont) {
        PdfPCell c = new PdfPCell();
        c.setBorderColor(new Color(190, 210, 240));
        c.setPadding(9);
        Paragraph p = new Paragraph();
        p.add(new Phrase(k + ": ", keyFont));
        p.add(new Phrase(safe(v), valFont));
        c.addElement(p);
        return c;
    }

    private static void addTH(PdfPTable t, String text, Font font) {
        PdfPCell c = new PdfPCell(new Phrase(text, font));
        c.setBackgroundColor(new Color(18, 52, 105));
        c.setPadding(8);
        c.setHorizontalAlignment(Element.ALIGN_CENTER);
        c.setBorderColor(new Color(18, 52, 105));
        t.addCell(c);
    }

    private static void addTD(PdfPTable t, String text, Font font) {
        PdfPCell c = new PdfPCell(new Phrase(safe(text), font));
        c.setPadding(8);
        c.setBorderColor(new Color(220, 220, 220));
        t.addCell(c);
    }

    /**
     * Watermark event (light grey diagonal text).
     */
    private static class WatermarkPageEvent extends PdfPageEventHelper {
        @Override
        public void onEndPage(PdfWriter writer, Document document) {
            PdfContentByte canvas = writer.getDirectContentUnder();
            Font wmFont = new Font(Font.HELVETICA, 52, Font.BOLD, new Color(235, 235, 235));
            Phrase watermark = new Phrase("BHARAT TEEKA", wmFont);

            float x = (document.left() + document.right()) / 2;
            float y = (document.bottom() + document.top()) / 2;

            ColumnText.showTextAligned(canvas, Element.ALIGN_CENTER, watermark, x, y, 35);
        }
    }
}
