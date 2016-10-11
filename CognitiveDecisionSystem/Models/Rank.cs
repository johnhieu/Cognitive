using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace CognitiveDecisionSystem.Models
{
    // Rank class for rank table in the database
    public class Rank
    {
        public int RankID { get; set; }
        public String RankName { get; set; }
        public String RankDesc { get; set; }

        public virtual ICollection<RegularUser> RegularUsers { get; set; }
    }
}