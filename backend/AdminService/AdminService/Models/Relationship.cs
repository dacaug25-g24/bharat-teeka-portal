using System;
using System.Collections.Generic;

namespace AdminService.Models;

public partial class Relationship
{
    public int RelationId { get; set; }

    public string RelationshipName { get; set; } = null!;

    public virtual ICollection<ParentChild> ParentChildren { get; set; } = new List<ParentChild>();
}
