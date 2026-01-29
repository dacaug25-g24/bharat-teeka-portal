package com.bharatteeka.patient.service;

import com.bharatteeka.patient.dto.AppointmentDetailsDto;
import com.bharatteeka.patient.dto.AppointmentRequestDto;
import com.bharatteeka.patient.dto.SlotDto;
import com.bharatteeka.patient.entity.Appointment;
import com.bharatteeka.patient.entity.Patient;
import com.bharatteeka.patient.entity.Slot;
import com.bharatteeka.patient.repository.AppointmentRepository;
import com.bharatteeka.patient.repository.ParentChildRepository;
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
	private final ParentChildRepository parentChildRepository;

	private final SlotRepository slotRepository;
	private final SlotQueryService slotQueryService;

	private static final String STATUS_PENDING = "Pending";
	private static final String STATUS_COMPLETED = "Completed";
	private static final String STATUS_CANCELLED = "Cancelled";

	@Transactional
	public Appointment bookAppointment(AppointmentRequestDto dto) {

		if (dto == null)
			throw new IllegalArgumentException("Request body is required");
		if (dto.getPatientId() == null)
			throw new IllegalArgumentException("patientId is required");
		if (dto.getSlotId() == null)
			throw new IllegalArgumentException("slotId is required");
		if (dto.getDoseNumber() == null)
			throw new IllegalArgumentException("doseNumber is required");

		Patient patient = patientRepository.findById(dto.getPatientId())
				.orElseThrow(() -> new IllegalArgumentException("Patient not found: " + dto.getPatientId()));

		if (Boolean.FALSE.equals(patient.getIsAdult())) {
			if (dto.getParentUserId() == null) {
				throw new IllegalArgumentException("parentUserId is required for beneficiary booking");
			}

			boolean allowed = parentChildRepository.existsByParentUserIdAndChildPatientId(dto.getParentUserId(),
					dto.getPatientId());

			if (!allowed) {
				throw new IllegalArgumentException("Beneficiary does not belong to this parent");
			}
		}

		Slot localSlot = slotRepository.findById(dto.getSlotId())
				.orElseThrow(() -> new IllegalArgumentException("Slot not found: " + dto.getSlotId()));

		if (dto.getVaccineId() != null && localSlot.getVaccineId() != null
				&& !dto.getVaccineId().equals(localSlot.getVaccineId())) {
			throw new IllegalArgumentException("Selected vaccine does not match slot vaccine");
		}

		if (appointmentRepository.existsByPatientIdAndSlotId(dto.getPatientId(), dto.getSlotId())) {
			throw new IllegalArgumentException("Appointment already exists for this patient and slot");
		}

		int updated = slotRepository.incrementBookedCount(dto.getSlotId());
		if (updated == 0) {
			throw new IllegalArgumentException("Slot is full. Please select another slot.");
		}

		if (localSlot.getHospitalId() == null) {
			throw new IllegalArgumentException("HospitalId missing for slot: " + dto.getSlotId());
		}
		if (localSlot.getSlotDate() == null || localSlot.getStartTime() == null) {
			throw new IllegalArgumentException("Slot date/time missing for slot: " + dto.getSlotId());
		}

		Appointment appointment = Appointment.builder().patientId(dto.getPatientId())
				.hospitalId(localSlot.getHospitalId()).slotId(dto.getSlotId()).doseNumber(dto.getDoseNumber())
				.bookingDate(localSlot.getSlotDate()).bookingTime(localSlot.getStartTime()).status(STATUS_PENDING)
				.remarks(dto.getRemarks()).build();

		return appointmentRepository.save(appointment);
	}

	public List<Appointment> getAppointmentsByPatient(Integer patientId, Integer parentUserId) {

		if (patientId == null)
			throw new IllegalArgumentException("patientId is required");

		Patient patient = patientRepository.findById(patientId)
				.orElseThrow(() -> new IllegalArgumentException("Patient not found: " + patientId));

		if (Boolean.FALSE.equals(patient.getIsAdult())) {
			if (parentUserId == null) {
				throw new IllegalArgumentException("parentUserId is required for beneficiary history");
			}

			boolean allowed = parentChildRepository.existsByParentUserIdAndChildPatientId(parentUserId, patientId);
			if (!allowed) {
				throw new IllegalArgumentException("This beneficiary does not belong to this parent");
			}
		}

		return appointmentRepository.findByPatientId(patientId);
	}

	@Transactional
	public Appointment cancelAppointment(Integer appointmentId, Integer parentUserId) {

		if (appointmentId == null)
			throw new IllegalArgumentException("appointmentId is required");

		Appointment appt = appointmentRepository.findById(appointmentId)
				.orElseThrow(() -> new IllegalArgumentException("Appointment not found: " + appointmentId));

		Patient patient = patientRepository.findById(appt.getPatientId())
				.orElseThrow(() -> new IllegalArgumentException("Patient not found: " + appt.getPatientId()));

		if (Boolean.FALSE.equals(patient.getIsAdult())) {
			if (parentUserId == null) {
				throw new IllegalArgumentException("parentUserId is required to cancel beneficiary appointment");
			}

			boolean allowed = parentChildRepository.existsByParentUserIdAndChildPatientId(parentUserId,
					patient.getPatientId());
			if (!allowed) {
				throw new IllegalArgumentException("You cannot cancel this beneficiary appointment");
			}
		}

		if (STATUS_COMPLETED.equalsIgnoreCase(appt.getStatus())) {
			throw new IllegalArgumentException("Completed appointment cannot be cancelled");
		}

		if (STATUS_CANCELLED.equalsIgnoreCase(appt.getStatus())) {
			return appt;
		}

		appt.setStatus(STATUS_CANCELLED);

		String old = appt.getRemarks();
		String msg = "Cancelled by patient-service";
		appt.setRemarks(old == null || old.isBlank() ? msg : (old + " | " + msg));

		Appointment saved = appointmentRepository.save(appt);

		slotRepository.decrementBookedCount(appt.getSlotId());

		return saved;
	}

	public List<AppointmentDetailsDto> getAppointmentDetails(Integer patientId, Integer parentUserId) {

		List<Appointment> appointments = getAppointmentsByPatient(patientId, parentUserId);

		return appointments.stream().map(appt -> {

			SlotDto slot = slotQueryService.getSlotById(appt.getSlotId());

			Integer vaccineId = (slot != null && slot.getVaccine() != null) ? slot.getVaccine().getVaccineId() : null;
			String vaccineName = (slot != null && slot.getVaccine() != null) ? slot.getVaccine().getVaccineName()
					: null;

			Integer hospitalId = (slot != null && slot.getHospital() != null) ? slot.getHospital().getHospitalId()
					: appt.getHospitalId();
			String hospitalName = (slot != null && slot.getHospital() != null) ? slot.getHospital().getHospitalName()
					: null;

			return AppointmentDetailsDto.builder().appointmentId(appt.getAppointmentId()).patientId(appt.getPatientId())
					.hospitalId(hospitalId).hospitalName(hospitalName).slotId(appt.getSlotId())
					.doseNumber(appt.getDoseNumber()).bookingDate(appt.getBookingDate())
					.bookingTime(appt.getBookingTime()).status(appt.getStatus()).remarks(appt.getRemarks())

					.slotDate(slot != null ? slot.getDate() : null).startTime(slot != null ? slot.getStartTime() : null)
					.endTime(slot != null ? slot.getEndTime() : null).capacity(slot != null ? slot.getCapacity() : null)
					.bookedCount(slot != null ? slot.getBookedCount() : null)

					.vaccineId(vaccineId).vaccineName(vaccineName).build();

		}).collect(Collectors.toList());
	}
}
