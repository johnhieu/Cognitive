﻿using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace CognitiveDecisionSystem.Models
{
    public class Role
    {
        public int RoleId { get; set; }
        public String RoleType { get; set; }
        public String RoleDesc { get; set; }

        public virtual ICollection<RegularUser> RegularUsers { get; set; }

    }
}