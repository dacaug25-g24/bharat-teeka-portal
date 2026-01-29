using AdminService.DTO;
using AdminService.Models;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace AdminService.Controllers
{
    [Route("api/admin")]
    [ApiController]
    public class AdminController : ControllerBase
    {
        [HttpGet("test")]
        public String GetConfirmation()
        {
            return "Request Received sucessfully";
        }

        // get all hospital
        [HttpGet("getallhospital")]
        public async Task<List<HospitalDto>> GetAllHospital()
        {
            var db = new P24BharatTeekaPortalContext();

            List<HospitalDto> hlist = await db.Hospitals
                .Select(h => new HospitalDto
                {
                    HospitalId = h.HospitalId,
                    UserId = h.UserId,
                    HospitalName = h.HospitalName,
                    RegistrationNo = h.RegistrationNo,
                    HospitalType = h.HospitalType,
                    CityId = h.CityId
                })
                .ToListAsync();

            return hlist;
        }

        /*
        [HttpGet("getallvaccine")]
        public List<Vaccine> GetAllVaccine()
        {
            var db = new P24BharatTeekaPortalContext();
            List<Vaccine> vlist = db.Vaccines.ToList();
            return vlist;
        }*/

        /*
        [HttpGet("getallHospital1problem")]
        public List<Hospital> GetAllHospital1()
        {
            var db = new P24BharatTeekaPortalContext();
            List<Hospital> hlist = db.Hospitals.ToList();
            return hlist;
            
        }
        */

        // view specific user;
        [HttpGet("getuserbyid/{id}")]
        public async Task<ActionResult<UserDto>> GetUserById(int id)
        {
            var db = new P24BharatTeekaPortalContext();

            var user = await db.Users
                .Where(u => u.UserId == id)
                .Select(u => new UserDto
                {
                    UserId = u.UserId,
                    RoleId = u.RoleId,
                    Username = u.Username,
                    Email = u.Email,
                    Phone = u.Phone,
                    Address = u.Address,
                    IsActive = (bool)u.IsActive
                })
                .FirstOrDefaultAsync();

            if (user == null)
                return NotFound("User not found");

            return Ok(user);
        }

        // view all users
        [HttpGet("getallusers")]
        public async Task<ActionResult<List<UserDto>>> GetAllUsers()
        {
            var db = new P24BharatTeekaPortalContext();

            var users = await db.Users
                .Select(u => new UserDto
                {
                    UserId = u.UserId,
                    RoleId = u.RoleId,
                    Username = u.Username,
                    Email = u.Email,
                    Phone = u.Phone,
                    Address = u.Address,
                    IsActive = (bool)u.IsActive
                })
                .ToListAsync();

            if (users == null || users.Count == 0)
                return NotFound("No users found");

            return Ok(users);
        }

   
        // view all vaccines
        [HttpGet("getallvaccines")]
        public async Task<ActionResult<List<VaccineDto>>> GetAllVaccines()
        {
            var db = new P24BharatTeekaPortalContext();

            var vaccines = await db.Vaccines
                .Select(v => new VaccineDto
                {
                    VaccineId = v.VaccineId,
                    VaccineName = v.VaccineName,
                    Manufacturer = v.Manufacturer,
                    VaccineType = v.VaccineType,
                    Description = v.Description,
                    SideEffects = v.SideEffects,
                    MinAge = v.MinAge,
                    MaxAge = v.MaxAge,
                    DoseRequired = v.DoseRequired,
                    DoseGapDays = v.DoseGapDays,
                    StorageTemperature = v.StorageTemperature,
                    ExpiryDate = v.ExpiryDate  
                })
                .ToListAsync();

            if (vaccines == null || vaccines.Count == 0)
                return NotFound("No vaccines found");

            return Ok(vaccines);
        }


        // view specific vaccine
        [HttpGet("getvaccinebyid/{id}")]
        public async Task<ActionResult<VaccineDto>> GetVaccineById(int id)
        {
            var db = new P24BharatTeekaPortalContext();

            var vaccine = await db.Vaccines
                .Where(v => v.VaccineId == id)
                .Select(v => new VaccineDto
                {
                    VaccineId = v.VaccineId,
                    VaccineName = v.VaccineName,
                    Manufacturer = v.Manufacturer,
                    VaccineType = v.VaccineType,
                    Description = v.Description,
                    SideEffects = v.SideEffects,
                    MinAge = v.MinAge,
                    MaxAge = v.MaxAge,
                    DoseRequired = v.DoseRequired,
                    DoseGapDays = v.DoseGapDays,
                    StorageTemperature = v.StorageTemperature,
                    ExpiryDate = v.ExpiryDate
                })
                .FirstOrDefaultAsync();

            if (vaccine == null)
                return NotFound("Vaccine not found");

            return Ok(vaccine);
        }


        // view users by role
        [HttpGet("getusersbyrole/{roleId}")]
        public async Task<ActionResult<List<UserDto>>> GetUsersByRole(int roleId)
        {
            var db = new P24BharatTeekaPortalContext();

            var users = await db.Users
                .Where(u => u.RoleId == roleId)
                .Select(u => new UserDto
                {
                    UserId = u.UserId,
                    RoleId = u.RoleId,
                    Username = u.Username,
                    Email = u.Email,
                    Phone = u.Phone,
                    Address = u.Address,
                    IsActive = (bool)u.IsActive
                })
                .ToListAsync();

            if (users == null || users.Count == 0)
                return NotFound("No users found for this role");

            return Ok(users);
        }


        // add hospital(do we have to add the data in a user table along with hospital)



        // add vaccine; 
        [HttpPost("addvaccine")]
        public async Task<ActionResult> AddVaccine(VaccineDto dto)
        {
            var db = new P24BharatTeekaPortalContext();

            Vaccine vaccine = new Vaccine
            {
                VaccineName = dto.VaccineName,
                Manufacturer = dto.Manufacturer,
                VaccineType = dto.VaccineType,
                Description = dto.Description,
                SideEffects = dto.SideEffects,
                MinAge = dto.MinAge,
                MaxAge = dto.MaxAge,
                DoseRequired = dto.DoseRequired,
                DoseGapDays = dto.DoseGapDays,
                StorageTemperature = dto.StorageTemperature,
                ExpiryDate = (DateOnly)dto.ExpiryDate
            };

            db.Vaccines.Add(vaccine);
            await db.SaveChangesAsync();

            return Ok(new
            {
                message = "Vaccine added successfully",
                vaccineId = vaccine.VaccineId
            });
        }


        


        // admin adds approved hospital
        [HttpPost("addhospital")]
        public async Task<ActionResult> AdminAddHospital(AdminAddHospitalDto dto)
        {
            var db = new P24BharatTeekaPortalContext();
            using var transaction = await db.Database.BeginTransactionAsync();

            try
            {
                // duplicate check
                if (db.Users.Any(u => u.Email == dto.Email || u.Username == dto.Username))
                    return BadRequest("Email or Username already exists");

                // create user
                User user = new User
                {
                    // these are the fields in a db for user object;
                    RoleId = dto.RoleId,
                    Username = dto.Username,
                    Password = dto.Password,
                    Email = dto.Email,
                    Phone = dto.Phone,
                    Address = dto.Address,
                    IsActive = true
                };

                db.Users.Add(user); // saved object in DB;
                await db.SaveChangesAsync();

                // create hospital
                Hospital hospital = new Hospital
                {
                    UserId = user.UserId, // fetch from user(saved above) to set in Hospital as a foreign key 
                    HospitalName = dto.HospitalName,
                    RegistrationNo = dto.RegistrationNo,
                    HospitalType = dto.HospitalType,
                    CityId = dto.CityId
                };

                db.Hospitals.Add(hospital); // hospital object saved
                await db.SaveChangesAsync(); 

                await transaction.CommitAsync();

                return Ok(new
                {
                    message = "Hospital added successfully",
                    userId = user.UserId,
                    hospitalId = hospital.HospitalId
                });
            }
            catch (Exception ex)
            {
                await transaction.RollbackAsync();
                return StatusCode(500, ex.InnerException?.Message ?? ex.Message);
            }
        }


        // id will come default from respective vaccine for deletion;
        // delete vaccine by id
        [HttpDelete("deletevaccine/{id}")]
        public async Task<ActionResult> DeleteVaccine(int id)
        {
            var db = new P24BharatTeekaPortalContext();

            var vaccine = await db.Vaccines.FindAsync(id);

            if (vaccine == null)
                return NotFound("Vaccine not found");

            db.Vaccines.Remove(vaccine);
            await db.SaveChangesAsync();

            return Ok("Vaccine deleted successfully");
        }




        // all user list have respective de-activate button;
        // De-active user by it's ID; (internally used with all users from there admin can deactivate) 
        // deactivate user
        [HttpDelete("deactivateuser/{id}")]
        public async Task<ActionResult> UserDeactivate(int id)
        {
            Console.WriteLine("deactivating user");
            var db = new P24BharatTeekaPortalContext();

            var user = await db.Users.FindAsync(id);

            if (user == null)
                return NotFound("User not found");

            if (user.IsActive == false)
                return BadRequest("User is already deactivated");

            user.IsActive = false;
            await db.SaveChangesAsync();

            return Ok("User deactivated successfully");
        }

        // re-activate user
        [HttpPut("reactivateuser/{id}")]
        public async Task<ActionResult> UserReactivate(int id)
        {
            var db = new P24BharatTeekaPortalContext();

            var user = await db.Users.FindAsync(id);

            if (user == null)
                return NotFound("User not found");

            if (user.IsActive == true)
                return BadRequest("User is already active");

            user.IsActive = true;
            await db.SaveChangesAsync();

            return Ok("User re-activated successfully");
        }


        [HttpPut("updatevaccine/{id}")]
        public async Task<ActionResult> UpdateVaccine(int id, VaccineDto dto)
        {
            var db = new P24BharatTeekaPortalContext();

            if (id != dto.VaccineId)
                return BadRequest("ID mismatch");

            var vaccine = await db.Vaccines.FindAsync(id);

            if (vaccine == null)
                return NotFound("Vaccine not found");

            vaccine.VaccineName = dto.VaccineName;
            vaccine.Manufacturer = dto.Manufacturer;
            vaccine.VaccineType = dto.VaccineType;
            vaccine.Description = dto.Description;
            vaccine.SideEffects = dto.SideEffects;
            vaccine.MinAge = dto.MinAge;
            vaccine.MaxAge = dto.MaxAge;
            vaccine.DoseRequired = dto.DoseRequired;
            vaccine.DoseGapDays = dto.DoseGapDays;
            vaccine.StorageTemperature = dto.StorageTemperature;
            vaccine.ExpiryDate = (DateOnly)dto.ExpiryDate;

            await db.SaveChangesAsync();

            return Ok("Vaccine updated successfully");
        }

        // search vaccine;
        [HttpGet("searchvaccine")]
        public async Task<ActionResult<List<VaccineDto>>> SearchVaccine(string name)
        {
            var db = new P24BharatTeekaPortalContext();

            var vaccines = await db.Vaccines
                .Where(v => v.VaccineName.Contains(name))
                .Select(v => new VaccineDto
                {
                    VaccineId = v.VaccineId,
                    VaccineName = v.VaccineName,
                    Manufacturer = v.Manufacturer,
                    VaccineType = v.VaccineType,
                    MinAge = v.MinAge,
                    MaxAge = v.MaxAge,
                    DoseRequired = v.DoseRequired,
                    DoseGapDays = v.DoseGapDays,
                    StorageTemperature = v.StorageTemperature,
                    ExpiryDate = v.ExpiryDate
                })
                .ToListAsync();

            return Ok(vaccines);
        }



        // for admin profile
        // get admin profile
        [HttpGet("getadminprofile")]
        public async Task<ActionResult<AdminProfileDto>> GetAdminProfile()
        {
            var db = new P24BharatTeekaPortalContext();

            var admin = await db.Users
                .Where(u => u.UserId == 1 && u.RoleId == 1)
                .Select(u => new AdminProfileDto
                {
                    UserId = u.UserId,
                    Username = u.Username,
                    Email = u.Email,
                    Phone = u.Phone,
                    Address = u.Address
                })
                .FirstOrDefaultAsync();

            if (admin == null)
                return NotFound("Admin not found");

            return Ok(admin);
        }

        // update admin profile
        [HttpPut("updateadminprofile")]
        public async Task<ActionResult> UpdateAdminProfile(AdminProfileDto dto)
        {
            var db = new P24BharatTeekaPortalContext();

            var admin = await db.Users.FindAsync(1);
            if (admin == null)
                return NotFound("Admin not found");

            if (admin.RoleId != 1)
                return BadRequest("Not an admin user");

            admin.Email = dto.Email;
            admin.Phone = dto.Phone;
            admin.Address = dto.Address;

            await db.SaveChangesAsync();

            return Ok("Admin profile updated successfully");
        }


        // user report
        [HttpGet("userreport")]
        public async Task<ActionResult> GetUserReport()
        {
            var db = new P24BharatTeekaPortalContext();

            var report = new
            {
                TotalUsers = await db.Users.CountAsync(),
                ActiveUsers = await db.Users.CountAsync(u => u.IsActive == true),
                InactiveUsers = await db.Users.CountAsync(u => u.IsActive == false),
                TotalPatients = await db.Users.CountAsync(u => u.RoleId == 2),
                TotalHospitals = await db.Users.CountAsync(u => u.RoleId == 3)
            };

            return Ok(report);
        }


        // get all states;
        [HttpGet("getallstates")]
        public async Task<ActionResult<List<StateDto>>> GetAllStates()
        {
            var db = new P24BharatTeekaPortalContext();

            var states = await db.States
                .Select(s => new StateDto
                {
                    StateId = s.StateId,
                    StateName = s.StateName
                })
                .ToListAsync();

            if (states == null || states.Count == 0)
                return NotFound("No states found");

            return Ok(states); // return state object list;
        }


        //get all cities;
        [HttpGet("getcitiesbystate/{stateId}")]
        public async Task<ActionResult<List<CityDto>>> GetCitiesByState(int stateId)
        {
            var db = new P24BharatTeekaPortalContext();

            // optional but good: state exists check
            var stateExists = await db.States.AnyAsync(s => s.StateId == stateId);
            if (!stateExists)
                return NotFound($"State not found for StateId = {stateId}");

            var cities = await db.Cities
                .Where(c => c.StateId == stateId)
                .Select(c => new CityDto
                {
                    CityId = c.CityId,
                    CityName = c.CityName,
                    StateId = c.StateId
                })
                .ToListAsync();

            if (cities == null || cities.Count == 0)
                return NotFound("No cities found for this state");

            return Ok(cities);
        }

    }
}
