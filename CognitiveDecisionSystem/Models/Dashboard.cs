﻿using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.ComponentModel.DataAnnotations.Schema;
using System.ComponentModel.DataAnnotations;
namespace CognitiveDecisionSystem.Models
{
    // Dashboard class for the Dashboard entity in the database
    public class Dashboard
    {
        public int DashboardId { get; set; }
        public String DashboardName { get; set; }
        public String DashboardDesc { get; set; }

        public virtual RegularUser RegularUser { get; set;}
        public virtual ICollection<Widget> Widgets { get; set; }
    }

    // This class is to be used in the YourDashboard page to 
    // submit information to create a new dashboard for users
    public class FormDashboard
    {
        [Required]
        [Display(Name = "Dashboard name")]
        public String DashboardName { get; set; }

            
        [Display(Name = "Dashboard Description")]
        [Required]
        public String DashboardDesc { get; set; }

        [Required]
        public String Username { get; set; }
    }
}