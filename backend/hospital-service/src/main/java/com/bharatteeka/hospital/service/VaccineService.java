package com.bharatteeka.hospital.service;

import com.bharatteeka.hospital.entity.Vaccine;

import java.util.List;

public interface VaccineService {

    List<Vaccine> getAllVaccines();

    Vaccine getVaccineById(Integer id);

    List<Vaccine> searchByName(String name);

    List<Vaccine> getExpiring(int days);

    List<Vaccine> getByHospital(Integer hospitalId);
}
