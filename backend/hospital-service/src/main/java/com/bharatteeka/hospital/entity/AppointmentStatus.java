package com.bharatteeka.hospital.entity;

public enum AppointmentStatus {
    PENDING, BOOKED, COMPLETED, CANCELLED;

    public static AppointmentStatus fromDb(String value) {
        if (value == null) return null;
        return AppointmentStatus.valueOf(value.trim().toUpperCase());
    }
}
