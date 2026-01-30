import { useMemo } from "react";
import useBookAppointmentData from "./hooks/useBookAppointmentData";
import {
  beneficiaryLabel,
  formatChipDate,
  getCityKey,
  getCityLabel,
  getHospitalKey,
  getHospitalLabel,
  getHospitalType,
  getStateKey,
  getStateLabel,
} from "./utils/bookingMappers";

import BookingForSection from "./ui/BookingForSection";
import LocationSection from "./ui/LocationSection";
import VaccineSection from "./ui/VaccineSection";
import AvailabilitySection from "./ui/AvailabilitySection";
import SlotSection from "./ui/SlotSection";
import DoseAndBookSection from "./ui/DoseAndBookSection";
import SelectionSummary from "./ui/SelectionSummary";

/*
  This is the main Book Appointment page.
  All API logic is inside useBookAppointmentData hook.
  This file mainly focuses on UI layout.
*/

export default function BookAppointment() {
  const {
    isParent,

    bookingFor,
    setBookingFor,
    selectedBeneficiary,
    setSelectedBeneficiary,

    selfPatientId,
    loadingProfile,

    states,
    cities,
    hospitals,
    stateId,
    setStateId,
    cityId,
    setCityId,
    hospitalId,
    setHospitalId,

    vaccines,
    vaccineId,
    setVaccineId,
    loadingVaccines,

    todayStr,
    date,
    setDate,
    slots,
    slotId,
    setSlotId,
    selectedSlot,
    availableCount,

    doseNumber,
    setDoseNumber,

    beneficiaries,

    loadingStates,
    loadingCities,
    loadingHospitals,
    loadingSlots,
    booking,
    disableBook,

    error,
    successMsg,
    slotsInfo,
    earliestInfo,
    setError,
    setSuccessMsg,
    setSlotsInfo,
    setEarliestInfo,

    availability,
    loadingAvailability,

    resetAll,
    handleFindEarliest,
    handleBook,
  } = useBookAppointmentData();

  // Names for summary card
  const selectedStateName = useMemo(() => {
    const s = states.find((x) => String(getStateKey(x)) === String(stateId));
    return s ? getStateLabel(s) : "-";
  }, [states, stateId]);

  const selectedCityName = useMemo(() => {
    const c = cities.find((x) => String(getCityKey(x)) === String(cityId));
    return c ? getCityLabel(c) : "-";
  }, [cities, cityId]);

  const selectedHospitalName = useMemo(() => {
    const h = hospitals.find(
      (x) => String(getHospitalKey(x)) === String(hospitalId)
    );
    return h ? getHospitalLabel(h) : "-";
  }, [hospitals, hospitalId]);

  const selectedVaccineName = useMemo(() => {
    const v = vaccines.find((x) => String(x.vaccineId) === String(vaccineId));
    return v ? v.vaccineName : "All";
  }, [vaccines, vaccineId]);

  return (
    <div className="container-fluid p-0">
      <div className="card border-0 shadow-sm">
        <div className="card-body">
          <div className="d-flex justify-content-between align-items-start flex-wrap gap-2 mb-3">
            <div>
              <h5 className="mb-1">Book Appointment</h5>
              <div className="text-muted small">
                Step 1: Choose person, Step 2: Select location, Step 3: Select
                vaccine, Step 4: Pick date and slot, then book
              </div>
            </div>

            <button
              type="button"
              className="btn btn-outline-secondary btn-sm"
              onClick={resetAll}
            >
              Reset All
            </button>
          </div>

          {error && (
            <div className="alert alert-danger py-2 mb-3">{String(error)}</div>
          )}
          {successMsg && (
            <div className="alert alert-success py-2 mb-3">{successMsg}</div>
          )}
          {slotsInfo && (
            <div className="alert alert-info py-2 mb-3">{slotsInfo}</div>
          )}
          {earliestInfo && (
            <div className="alert alert-success py-2 mb-3">{earliestInfo}</div>
          )}

          <div className="row g-3">
            <BookingForSection
              isParent={isParent}
              bookingFor={bookingFor}
              setBookingFor={setBookingFor}
              selectedBeneficiary={selectedBeneficiary}
              setSelectedBeneficiary={setSelectedBeneficiary}
              beneficiaries={beneficiaries}
              beneficiaryLabel={beneficiaryLabel}
              selfPatientId={selfPatientId}
              loadingProfile={loadingProfile}
              resetAll={resetAll}
              setError={setError}
              setSuccessMsg={setSuccessMsg}
            />

            <LocationSection
              states={states}
              cities={cities}
              hospitals={hospitals}
              stateId={stateId}
              setStateId={setStateId}
              cityId={cityId}
              setCityId={setCityId}
              hospitalId={hospitalId}
              setHospitalId={setHospitalId}
              loadingStates={loadingStates}
              loadingCities={loadingCities}
              loadingHospitals={loadingHospitals}
              getStateKey={getStateKey}
              getStateLabel={getStateLabel}
              getCityKey={getCityKey}
              getCityLabel={getCityLabel}
              getHospitalKey={getHospitalKey}
              getHospitalLabel={getHospitalLabel}
              getHospitalType={getHospitalType}
            />

            <VaccineSection
              hospitalId={hospitalId}
              vaccines={vaccines}
              vaccineId={vaccineId}
              setVaccineId={setVaccineId}
              loadingVaccines={loadingVaccines}
              setSlotsInfo={setSlotsInfo}
              setDate={setDate}
              setEarliestInfo={setEarliestInfo}
              setSlotId={setSlotId}
              setError={setError}
              setSuccessMsg={setSuccessMsg}
            />

            <AvailabilitySection
              hospitalId={hospitalId}
              availability={availability}
              loadingAvailability={loadingAvailability}
              handleFindEarliest={handleFindEarliest}
              date={date}
              setDate={setDate}
              setSlotId={setSlotId}
              setSlotsInfo={setSlotsInfo}
              setError={setError}
              setSuccessMsg={setSuccessMsg}
              setEarliestInfo={setEarliestInfo}
              formatChipDate={formatChipDate}
            />

            <SlotSection
              hospitalId={hospitalId}
              todayStr={todayStr}
              date={date}
              setDate={setDate}
              slots={slots}
              slotId={slotId}
              setSlotId={setSlotId}
              selectedSlot={selectedSlot}
              availableCount={availableCount}
              loadingSlots={loadingSlots}
              setError={setError}
              setSuccessMsg={setSuccessMsg}
              setSlotsInfo={setSlotsInfo}
              setEarliestInfo={setEarliestInfo}
            />

            <DoseAndBookSection
              doseNumber={doseNumber}
              setDoseNumber={setDoseNumber}
              handleBook={handleBook}
              disableBook={disableBook}
              booking={booking}
              bookingFor={bookingFor}
              isParent={isParent}
              selectedBeneficiary={selectedBeneficiary}
              selfPatientId={selfPatientId}
            />
          </div>
        </div>
      </div>

      <SelectionSummary
        bookingFor={bookingFor}
        selectedBeneficiary={selectedBeneficiary}
        selfPatientId={selfPatientId}
        selectedStateName={selectedStateName}
        selectedCityName={selectedCityName}
        selectedHospitalName={selectedHospitalName}
        selectedVaccineName={selectedVaccineName}
        date={date}
        slotId={slotId}
      />
    </div>
  );
}
