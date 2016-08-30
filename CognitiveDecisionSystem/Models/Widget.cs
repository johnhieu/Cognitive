using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.ComponentModel.DataAnnotations.Schema;
using System.ComponentModel.DataAnnotations;

namespace CognitiveDecisionSystem.Models
{
    public class Widget: ScreenElement
    {
        public String WidgetType { get; set; }
        public String WidgetQuery { get; set; }


        public virtual ICollection<Record> Records { get; set; }
        public virtual Dashboard Dashboard { get; set; }
    }

    public class WidgetDashboard
    {
        [Required]
        public String WidgetName { get; set; }


        
        public String HTMLID { get; set; }

        [Required]
        public String WidgetType { get; set; }

        [Required]
        public String WidgetQuery { get; set; }

        [Required]
        public int DashboardId { get; set; }
    }
}