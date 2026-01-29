namespace AdminService.DTO
{
    public class VaccineDto
    {

        public int VaccineId { get; set; }
        public string VaccineName { get; set; }
        public string Manufacturer { get; set; }
        public string VaccineType { get; set; }
        public string Description { get; set; }
        public string SideEffects { get; set; }
        public int MinAge { get; set; }
        public int MaxAge { get; set; }
        public int DoseRequired { get; set; }
        public int DoseGapDays { get; set; }
        public int StorageTemperature { get; set; }
        public DateOnly? ExpiryDate { get; set; }   // ✅ nullable (IMPORTANT)
    }
}
