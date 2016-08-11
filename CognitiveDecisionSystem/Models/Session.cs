using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace CognitiveDecisionSystem.Models
{
    public class Session
    {
        public int SessionID { get; set; }
        public String  SessionDate { get; set; }
        public String  StartTime { get; set; }
        public String  EndTime { get; set; }

        public virtual ICollection<Record> Records { get; set; }
        public virtual RegularUser RegularUser { get; set; }
    }
}