namespace AdminService.DTO
{
    public class PatientDto
    {

        public int PatientId { get; set; }
        public int UserId { get; set; }
        public string FirstName { get; set; }
        public string LastName { get; set; }
        public DateTime DateOfBirth { get; set; }
        public string Gender { get; set; }
        public string AadharNumber { get; set; }
        public string BloodGroup { get; set; }
        public bool IsAdult { get; set; }
        public bool IsActive { get; set; }
        public string Remarks { get; set; }
    }
}
