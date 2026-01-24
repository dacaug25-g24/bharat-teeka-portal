package com.bharatteeka.hospital.service;

import com.bharatteeka.hospital.entity.Vaccine;
import java.util.List;

public interface VaccineService {

    List<Vaccine> getAllVaccines();

    Vaccine getVaccineById(Integer id);
}
