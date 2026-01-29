using System;
using System.Collections.Generic;

namespace AdminService.Models;

public partial class Notification
{
    public int NotificationId { get; set; }

    public int UserId { get; set; }

    public string Title { get; set; } = null!;

    public string Message { get; set; } = null!;

    public int? VaccineId { get; set; }

    public int? HospitalId { get; set; }

    public int? PatientId { get; set; }

    public int? SlotId { get; set; }

    public int? AppointmentId { get; set; }

    public string? Status { get; set; }

    public virtual Appointment? Appointment { get; set; }

    public virtual Hospital? Hospital { get; set; }

    public virtual Patient? Patient { get; set; }

    public virtual Slot? Slot { get; set; }

    public virtual User User { get; set; } = null!;

    public virtual Vaccine? Vaccine { get; set; }
}
