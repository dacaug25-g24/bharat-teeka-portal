//package com.bharatteeka.hospital.service.impl;
//
//import com.bharatteeka.hospital.entity.*;
//import com.bharatteeka.hospital.repository.AppointmentRepository;
//import com.bharatteeka.hospital.repository.VaccinationRecordRepository;
//import com.bharatteeka.hospital.service.AppointmentService;
//import org.springframework.stereotype.Service;
//import org.springframework.transaction.annotation.Transactional;
//
//import java.time.LocalDate;
//import java.util.List;
//
//@Service
//public class AppointmentServiceImpl implements AppointmentService {
//
//    private final AppointmentRepository repo;
//    private final VaccinationRecordRepository vaccRepo;
//
//    public AppointmentServiceImpl(AppointmentRepository repo, VaccinationRecordRepository vaccRepo) {
//        this.repo = repo;
//        this.vaccRepo = vaccRepo;
//    }
//
//    @Override
//    public List<Appointment> getAllAppointments() {
//        return repo.findAll();
//    }
//
//    @Override
//    public List<Appointment> getPatientHistory(Integer patientId) {
//        return repo.findByPatientId(patientId);
//    }
//
//    @Override
//    public List<Appointment> getAppointmentsByHospital(Integer hospitalId) {
//        return repo.findByHospitalHospitalId(hospitalId);
//    }
//
//    @Override
//    public List<Appointment> getTodayAppointments(Integer hospitalId) {
//        return repo.findByHospitalHospitalIdAndBookingDate(hospitalId, LocalDate.now());
//    }
//
//    @Override
//    public List<Appointment> getAppointmentsByHospitalAndDate(Integer hospitalId, LocalDate date) {
//        return repo.findByHospitalHospitalIdAndBookingDate(hospitalId, date);
//    }
//
//    @Override
//    public Appointment markCompleted(Integer appointmentId, String remarks) {
//        Appointment appt = repo.findById(appointmentId)
//                .orElseThrow(() -> new RuntimeException("Appointment not found"));
//
//        appt.setStatus(AppointmentStatus.COMPLETED);
//        appt.setRemarks(remarks);
//
//        return repo.save(appt);
//    }
//
//    @Transactional
//    @Override
//    public Appointment markCompletedWithBatch(Integer appointmentId, String remarks, String batchNumber) {
//        if (batchNumber == null || batchNumber.trim().isEmpty()) {
//            throw new RuntimeException("Batch number is required");
//        }
//
//        Appointment appt = repo.findById(appointmentId)
//                .orElseThrow(() -> new RuntimeException("Appointment not found"));
//
//        if (appt.getStatus() == AppointmentStatus.COMPLETED) {
//            return appt;
//        }
//
//        if (appt.getSlot() == null || appt.getSlot().getVaccine() == null) {
//            throw new RuntimeException("Appointment is missing slot/vaccine mapping");
//        }
//        if (appt.getHospital() == null) {
//            throw new RuntimeException("Appointment is missing hospital mapping");
//        }
//
//        if (vaccRepo.findByAppointmentAppointmentId(appointmentId).isPresent()) {
//            appt.setStatus(AppointmentStatus.COMPLETED);
//            appt.setRemarks(remarks);
//            return repo.save(appt);
//        }
//
//        Integer patientId = appt.getPatientId();
//        Integer vaccineId = appt.getSlot().getVaccine().getVaccineId();
//
//        long previous = vaccRepo.countByPatientIdAndVaccineVaccineId(patientId, vaccineId);
//        int doseNumber = (int) previous + 1;
//
//        Vaccine v = appt.getSlot().getVaccine();
//        Integer maxDosesRaw = firstNonNull(v.getDosesRequired(), v.getDoseRequired(), v.getDoseCount());
//        Integer maxDoses = (maxDosesRaw != null && maxDosesRaw > 0) ? maxDosesRaw : null;
//
//        if (maxDoses != null && doseNumber > maxDoses) {
//            throw new RuntimeException("Dose limit exceeded for this vaccine. Max doses: " + maxDoses);
//        }
//
//        appt.setStatus(AppointmentStatus.COMPLETED);
//        appt.setRemarks(remarks);
//        Appointment savedAppt = repo.save(appt);
//
//        VaccinationRecord r = new VaccinationRecord();
//        r.setAppointment(savedAppt);
//        r.setPatientId(patientId);
//        r.setHospital(savedAppt.getHospital());
//        r.setSlot(savedAppt.getSlot());
//        r.setVaccine(savedAppt.getSlot().getVaccine());
//        r.setDoseNumber(doseNumber);
//        r.setBatchNumber(batchNumber.trim());
//        r.setVaccinationDate(LocalDate.now());
//        r.setRemarks(remarks);
//
//        vaccRepo.save(r);
//
//        return savedAppt;
//    }
//
//
//    private Integer firstNonNull(Integer a, Integer b, Integer c) {
//        if (a != null && a > 0) return a; //  treat 0 as invalid
//        if (b != null && b > 0) return b;
//        if (c != null && c > 0) return c;
//        return null;
//    }
//
//
//    @Override
//    public Appointment cancelAppointment(Integer appointmentId, String reason) {
//        Appointment appt = repo.findById(appointmentId)
//                .orElseThrow(() -> new RuntimeException("Appointment not found"));
//
//        appt.setStatus(AppointmentStatus.CANCELLED);
//        appt.setRemarks(reason);
//
//        return repo.save(appt);
//    }
//}
package com.bharatteeka.hospital.service.impl;

import com.bharatteeka.hospital.entity.*;
import com.bharatteeka.hospital.repository.AppointmentRepository;
import com.bharatteeka.hospital.repository.VaccinationRecordRepository;
import com.bharatteeka.hospital.service.AppointmentService;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.List;

@Service
public class AppointmentServiceImpl implements AppointmentService {

    private final AppointmentRepository repo;
    private final VaccinationRecordRepository vaccRepo;

    public AppointmentServiceImpl(AppointmentRepository repo, VaccinationRecordRepository vaccRepo) {
        this.repo = repo;
        this.vaccRepo = vaccRepo;
    }

    @Override
    public List<Appointment> getAllAppointments() {
        return repo.findAll();
    }

    @Override
    public List<Appointment> getPatientHistory(Integer patientId) {
        return repo.findByPatientId(patientId);
    }

    @Override
    public List<Appointment> getAppointmentsByHospital(Integer hospitalId) {
        return repo.findByHospitalHospitalId(hospitalId);
    }

    @Override
    public List<Appointment> getTodayAppointments(Integer hospitalId) {
        return repo.findByHospitalHospitalIdAndBookingDate(hospitalId, LocalDate.now());
    }

    @Override
    public List<Appointment> getAppointmentsByHospitalAndDate(Integer hospitalId, LocalDate date) {
        return repo.findByHospitalHospitalIdAndBookingDate(hospitalId, date);
    }

    @Override
    public Appointment markCompleted(Integer appointmentId, String remarks) {
        Appointment appt = repo.findById(appointmentId)
                .orElseThrow(() -> new RuntimeException("Appointment not found"));

        appt.setStatus(AppointmentStatus.COMPLETED);
        appt.setRemarks(remarks);
        return repo.save(appt);
    }

    // ✅ CORE: MUST create VaccinationRecord
    @Transactional
    @Override
    public Appointment markCompletedWithBatch(Integer appointmentId, String remarks, String batchNumber) {

        if (batchNumber == null || batchNumber.trim().isEmpty()) {
            throw new RuntimeException("Batch number is required");
        }

        Appointment appt = repo.findById(appointmentId)
                .orElseThrow(() -> new RuntimeException("Appointment not found"));

        if (appt.getSlot() == null || appt.getSlot().getVaccine() == null) {
            throw new RuntimeException("Slot/Vaccine mapping missing");
        }
        if (appt.getHospital() == null) {
            throw new RuntimeException("Hospital mapping missing");
        }
        if (appt.getPatientId() == null) {
            throw new RuntimeException("PatientId missing in appointment");
        }

        // ✅ If record exists => make appointment completed and return (idempotent)
        if (vaccRepo.findByAppointmentAppointmentId(appointmentId).isPresent()) {
            if (appt.getStatus() != AppointmentStatus.COMPLETED) {
                appt.setStatus(AppointmentStatus.COMPLETED);
                appt.setRemarks(remarks);
                repo.save(appt);
            }
            return appt;
        }

        Integer patientId = appt.getPatientId();
        Vaccine vaccine = appt.getSlot().getVaccine();

        long previous = vaccRepo.countByPatientIdAndVaccineVaccineId(patientId, vaccine.getVaccineId());
        int doseNumber = (int) previous + 1;

        Integer maxDose = firstNonNull(vaccine.getDosesRequired(), vaccine.getDoseRequired(), vaccine.getDoseCount());
        if (maxDose != null && doseNumber > maxDose) {
            throw new RuntimeException("Dose limit exceeded (max " + maxDose + ")");
        }

        // ✅ mark appointment completed FIRST
        appt.setStatus(AppointmentStatus.COMPLETED);
        appt.setRemarks(remarks);
        Appointment saved = repo.save(appt);

        // ✅ IMPORTANT: vaccinationDate should match appointment date (so reports work)
        LocalDate vaccDate = saved.getBookingDate() != null ? saved.getBookingDate() : LocalDate.now();

        VaccinationRecord r = new VaccinationRecord();
        r.setAppointment(saved);
        r.setPatientId(patientId);
        r.setHospital(saved.getHospital());
        r.setSlot(saved.getSlot());
        r.setVaccine(vaccine);
        r.setDoseNumber(doseNumber);
        r.setBatchNumber(batchNumber.trim());
        r.setVaccinationDate(vaccDate);
        r.setRemarks(remarks);

        // ✅ force insert now (so you SEE it in SQL logs)
        vaccRepo.saveAndFlush(r);

        return saved;
    }

    private Integer firstNonNull(Integer a, Integer b, Integer c) {
        if (a != null && a > 0) return a;
        if (b != null && b > 0) return b;
        if (c != null && c > 0) return c;
        return null;
    }

    @Override
    public Appointment cancelAppointment(Integer appointmentId, String reason) {
        Appointment appt = repo.findById(appointmentId)
                .orElseThrow(() -> new RuntimeException("Appointment not found"));

        appt.setStatus(AppointmentStatus.CANCELLED);
        appt.setRemarks(reason);
        return repo.save(appt);
    }
}
