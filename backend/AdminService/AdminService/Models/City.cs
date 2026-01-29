using System;
using System.Collections.Generic;

namespace AdminService.Models;

public partial class City
{
    public int CityId { get; set; }

    public string CityName { get; set; } = null!;

    public int StateId { get; set; }

    public virtual ICollection<Hospital> Hospitals { get; set; } = new List<Hospital>();

    public virtual State State { get; set; } = null!;
}
