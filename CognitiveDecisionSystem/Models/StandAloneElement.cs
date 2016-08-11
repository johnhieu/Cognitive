using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace CognitiveDecisionSystem.Models
{
    public class StandAloneElement: ScreenElement
    {
        public String LinkToPopUp { get; set; }

        public virtual ICollection<Record> Records { get; set; }
    }
}