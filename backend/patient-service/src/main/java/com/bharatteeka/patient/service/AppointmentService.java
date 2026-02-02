package com.bharatteeka.patient.service;

import com.bharatteeka.patient.dto.AppointmentDetailsDto;
import com.bharatteeka.patient.dto.AppointmentRequestDto;
import com.bharatteeka.patient.dto.SlotDto;
import com.bharatteeka.patient.entity.Appointment;
import com.bharatteeka.patient.entity.Patient;
import com.bharatteeka.patient.entity.Slot;
import com.bharatteeka.patient.repository.AppointmentRepository;
import com.bharatteeka.patient.repository.PatientRepository;
import com.bharatteeka.patient.repository.SlotRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class AppointmentService {

    private final AppointmentRepository appointmentRepository;
    private final PatientRepository patientRepository;

    private final BeneficiaryAccessService beneficiaryAccessService;

    private final SlotRepository slotRepository;
    private final SlotService slotService;

    private static final String STATUS_BOOKED = "BOOKED";
    private static final String STATUS_COMPLETED = "COMPLETED";
    private static final String STATUS_CANCELLED = "CANCELLED";

    // -------------------------
    // BOOK APPOINTMENT
    // -------------------------
    @Transactional
    public Appointment bookAppointment(AppointmentRequestDto dto) {

        require(dto != null, "Request body is required");
        require(dto.getPatientId() != null, "patientId is required");
        require(dto.getSlotId() != null, "slotId is required");
        require(dto.getDoseNumber() != null, "doseNumber is required");

        Patient patient = getPatientOrThrow(dto.getPatientId());

        // ✅ reusable beneficiary validation
        beneficiaryAccessService.validateAccess(patient, dto.getParentUserId(), "booking");

        // slot exists
        Slot localSlot = slotRepository.findById(dto.getSlotId())
                .orElseThrow(() -> new IllegalArgumentException("Slot not found: " + dto.getSlotId()));

        // vaccine mismatch check (if frontend sends vaccineId)
        if (dto.getVaccineId() != null && localSlot.getVaccineId() != null
                && !dto.getVaccineId().equals(localSlot.getVaccineId())) {
            throw new IllegalArgumentException("Selected vaccine does not match slot vaccine");
        }

        // avoid duplicate appointment for same patient + slot
        if (appointmentRepository.existsByPatientIdAndSlotId(dto.getPatientId(), dto.getSlotId())) {
            throw new IllegalArgumentException("Appointment already exists for this patient and slot");
        }

        // capacity check + update
        int updated = slotRepository.incrementBookedCount(dto.getSlotId());
        if (updated == 0) {
            throw new IllegalArgumentException("Slot is full. Please select another slot.");
        }

        // minimal slot integrity check
        require(localSlot.getHospitalId() != null, "HospitalId missing for slot: " + dto.getSlotId());
        require(localSlot.getSlotDate() != null && localSlot.getStartTime() != null,
                "Slot date/time missing for slot: " + dto.getSlotId());

        Appointment appointment = Appointment.builder()
                .patientId(dto.getPatientId())
                .hospitalId(localSlot.getHospitalId())
                .slotId(dto.getSlotId())
                .doseNumber(dto.getDoseNumber())
                .bookingDate(localSlot.getSlotDate())
                .bookingTime(localSlot.getStartTime())
                .status(STATUS_BOOKED)
                .remarks(dto.getRemarks())
                .build();

        return appointmentRepository.save(appointment);
    }

    // -------------------------
    // LIST APPOINTMENTS
    // -------------------------
    public List<Appointment> getAppointmentsByPatient(Integer patientId, Integer parentUserId) {

        require(patientId != null, "patientId is required");

        Patient patient = getPatientOrThrow(patientId);

        // ✅ reusable beneficiary validation
        beneficiaryAccessService.validateAccess(patient, parentUserId, "history");

        return appointmentRepository.findByPatientId(patientId);
    }

    // -------------------------
    // CANCEL APPOINTMENT
    // -------------------------
    @Transactional
    public Appointment cancelAppointment(Integer appointmentId, Integer parentUserId) {

        require(appointmentId != null, "appointmentId is required");

        Appointment appt = appointmentRepository.findById(appointmentId)
                .orElseThrow(() -> new IllegalArgumentException("Appointment not found: " + appointmentId));

        Patient patient = getPatientOrThrow(appt.getPatientId());

        // ✅ reusable beneficiary validation
        beneficiaryAccessService.validateAccess(patient, parentUserId, "cancel");

        // cannot cancel completed
        if (STATUS_COMPLETED.equalsIgnoreCase(appt.getStatus())) {
            throw new IllegalArgumentException("Completed appointment cannot be cancelled");
        }

        // already cancelled -> return as-is
        if (STATUS_CANCELLED.equalsIgnoreCase(appt.getStatus())) {
            return appt;
        }

        appt.setStatus(STATUS_CANCELLED);
        appt.setRemarks(appendRemarks(appt.getRemarks(), "Cancelled by patient-service"));

        Appointment saved = appointmentRepository.save(appt);

        // free up slot booking count
        slotRepository.decrementBookedCount(appt.getSlotId());

        return saved;
    }

    // -------------------------
    // DETAILS (appointments + slot/vaccine/hospital info)
    // -------------------------
    public List<AppointmentDetailsDto> getAppointmentDetails(Integer patientId, Integer parentUserId) {

        List<Appointment> appointments = getAppointmentsByPatient(patientId, parentUserId);

        return appointments.stream().map(appt -> {

            SlotDto slot = slotService.getSlotDetails(appt.getSlotId());

            Integer vaccineId = (slot != null && slot.getVaccine() != null) ? slot.getVaccine().getVaccineId() : null;
            String vaccineName = (slot != null && slot.getVaccine() != null) ? slot.getVaccine().getVaccineName() : null;

            Integer hospitalId = (slot != null && slot.getHospital() != null)
                    ? slot.getHospital().getHospitalId()
                    : appt.getHospitalId();

            String hospitalName = (slot != null && slot.getHospital() != null)
                    ? slot.getHospital().getHospitalName()
                    : null;

            return AppointmentDetailsDto.builder()
                    .appointmentId(appt.getAppointmentId())
                    .patientId(appt.getPatientId())

                    .hospitalId(hospitalId)
                    .hospitalName(hospitalName)

                    .slotId(appt.getSlotId())
                    .doseNumber(appt.getDoseNumber())

                    .bookingDate(appt.getBookingDate())
                    .bookingTime(appt.getBookingTime())

                    .status(appt.getStatus())
                    .remarks(appt.getRemarks())

                    .slotDate(slot != null ? slot.getDate() : null)
                    .startTime(slot != null ? slot.getStartTime() : null)
                    .endTime(slot != null ? slot.getEndTime() : null)
                    .capacity(slot != null ? slot.getCapacity() : null)
                    .bookedCount(slot != null ? slot.getBookedCount() : null)

                    .vaccineId(vaccineId)
                    .vaccineName(vaccineName)
                    .build();

        }).collect(Collectors.toList());
    }

    // -------------------------
    // Helpers
    // -------------------------
    private Patient getPatientOrThrow(Integer patientId) {
        return patientRepository.findById(patientId)
                .orElseThrow(() -> new IllegalArgumentException("Patient not found: " + patientId));
    }

    private String appendRemarks(String oldRemarks, String extra) {
        if (extra == null || extra.isBlank()) return oldRemarks;
        if (oldRemarks == null || oldRemarks.isBlank()) return extra;
        return oldRemarks + " | " + extra;
    }

    private void require(boolean condition, String message) {
        if (!condition) throw new IllegalArgumentException(message);
    }
}
