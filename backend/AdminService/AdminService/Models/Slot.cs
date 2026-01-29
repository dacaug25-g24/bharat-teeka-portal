using System;
using System.Collections.Generic;

namespace AdminService.Models;

public partial class Slot
{
    public int SlotId { get; set; }

    public int HospitalId { get; set; }

    public DateOnly SlotDate { get; set; }

    public TimeOnly StartTime { get; set; }

    public TimeOnly EndTime { get; set; }

    public int Capacity { get; set; }

    public int? BookedCount { get; set; }

    public int VaccineId { get; set; }

    public virtual ICollection<Appointment> Appointments { get; set; } = new List<Appointment>();

    public virtual Hospital Hospital { get; set; } = null!;

    public virtual ICollection<Notification> Notifications { get; set; } = new List<Notification>();

    public virtual Vaccine Vaccine { get; set; } = null!;
}
