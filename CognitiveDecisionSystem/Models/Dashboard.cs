using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.ComponentModel.DataAnnotations.Schema;
using System.ComponentModel.DataAnnotations;
using System.Data.Entity;

namespace CognitiveDecisionSystem.Models
{
    public class Dashboard
    {
        [Key]
        public int DashboardId { get; set; }
        public String DashboardName { get; set; }
        public String Dashboard { get; set; }

        public virtual RegularUser RegularUser;

    }
}