using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Data.Entity;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace CognitiveDecisionSystem.Models
{
    // Abstract for 2 classes: Widget and StandAloneElement
    public abstract class ScreenElement
    {
        [Key]
        public int WidgetID { get; set; }
        public String WidgetName { get; set; }
        public String HTMLId { get; set; }
        
    }
}