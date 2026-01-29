using System;
using System.Collections.Generic;

namespace AdminService.Models;

public partial class Vaccine
{
    public int VaccineId { get; set; }

    public string VaccineName { get; set; } = null!;

    public string Manufacturer { get; set; } = null!;

    public string VaccineType { get; set; } = null!;

    public string Description { get; set; } = null!;

    public string SideEffects { get; set; } = null!;

    public int MinAge { get; set; }

    public int MaxAge { get; set; }

    public int DoseRequired { get; set; }

    public int DoseGapDays { get; set; }

    public int StorageTemperature { get; set; }

    public DateOnly ExpiryDate { get; set; }

    public DateOnly ManufacturingDate { get; set; }

    public virtual ICollection<Notification> Notifications { get; set; } = new List<Notification>();

    public virtual ICollection<Slot> Slots { get; set; } = new List<Slot>();
}
