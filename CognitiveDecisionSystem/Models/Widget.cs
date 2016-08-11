using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace CognitiveDecisionSystem.Models
{
    public class Widget: ScreenElement
    {
        

        public virtual ICollection<Record> Records { get; set; }
    }
}