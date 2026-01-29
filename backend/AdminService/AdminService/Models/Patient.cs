using System;
using System.Collections.Generic;

namespace AdminService.Models;

public partial class Patient
{
    public int PatientId { get; set; }

    public int? UserId { get; set; }

    public string FirstName { get; set; } = null!;

    public string LastName { get; set; } = null!;

    public DateOnly DateOfBirth { get; set; }

    public string Gender { get; set; } = null!;

    public string AadharNumber { get; set; } = null!;

    public string BloodGroup { get; set; } = null!;

    public bool? IsAdult { get; set; }

    public bool? IsActive { get; set; }

    public string? Remarks { get; set; }

    public virtual ICollection<Appointment> Appointments { get; set; } = new List<Appointment>();

    public virtual ICollection<Notification> Notifications { get; set; } = new List<Notification>();

    public virtual ICollection<ParentChild> ParentChildren { get; set; } = new List<ParentChild>();

    public virtual User? User { get; set; }
}
