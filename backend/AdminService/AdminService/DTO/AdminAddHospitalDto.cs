namespace AdminService.DTO
{
    public class AdminAddHospitalDto
    {

        // will take all the data from the user;
        // USER TABLE
        public int RoleId { get; set; }          // Hospital role id
        public string Username { get; set; }
        public string Password { get; set; }     // hash later
        public string Email { get; set; }
        public string Phone { get; set; }
        public string Address { get; set; }

        // HOSPITAL TABLE
        public string HospitalName { get; set; }
        public string RegistrationNo { get; set; }
        public string HospitalType { get; set; }
        public int CityId { get; set; }
    }
}
