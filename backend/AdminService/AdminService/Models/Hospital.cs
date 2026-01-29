using System;
using System.Collections.Generic;

namespace AdminService.Models;

public partial class Hospital
{
    public int HospitalId { get; set; }

    public int UserId { get; set; }

    public string HospitalName { get; set; } = null!;

    public string RegistrationNo { get; set; } = null!;

    public string HospitalType { get; set; } = null!;

    public int CityId { get; set; }

    public virtual ICollection<Appointment> Appointments { get; set; } = new List<Appointment>();

    public virtual City City { get; set; } = null!;

    public virtual ICollection<Notification> Notifications { get; set; } = new List<Notification>();

    public virtual ICollection<Slot> Slots { get; set; } = new List<Slot>();

    public virtual User User { get; set; } = null!;
}
