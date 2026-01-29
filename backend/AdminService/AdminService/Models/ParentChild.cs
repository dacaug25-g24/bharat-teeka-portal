using System;
using System.Collections.Generic;

namespace AdminService.Models;

public partial class ParentChild
{
    public int ParentChildId { get; set; }

    public int ParentUserId { get; set; }

    public int ChildPatientId { get; set; }

    public int RelationId { get; set; }

    public virtual Patient ChildPatient { get; set; } = null!;

    public virtual User ParentUser { get; set; } = null!;

    public virtual Relationship Relation { get; set; } = null!;
}
