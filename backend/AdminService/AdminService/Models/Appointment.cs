using System;
using System.Collections.Generic;

namespace AdminService.Models;

public partial class Appointment
{
    public int AppointmentId { get; set; }

    public int PatientId { get; set; }

    public int HospitalId { get; set; }

    public int SlotId { get; set; }

    public int DoseNumber { get; set; }

    public DateOnly BookingDate { get; set; }

    public TimeOnly BookingTime { get; set; }

    public string? Status { get; set; }

    public string? Remarks { get; set; }

    public virtual Hospital Hospital { get; set; } = null!;

    public virtual ICollection<Notification> Notifications { get; set; } = new List<Notification>();

    public virtual Patient Patient { get; set; } = null!;

    public virtual Slot Slot { get; set; } = null!;
}
