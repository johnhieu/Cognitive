using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.ComponentModel.DataAnnotations.Schema;
using System.ComponentModel.DataAnnotations;
using System.Data.Entity;
using System.Web.Mvc;

namespace CognitiveDecisionSystem.Models
{
    // RegularUser class for regular user table in the database
    public class RegularUser
    {
        [Key]
        [DatabaseGeneratedAttribute(DatabaseGeneratedOption.Identity)]
       
        public int ID { get; set; }
        public String Username { get; set; }
        public String FullName { get; set; }
        public String Occupation { get; set; }
        public String Email { get; set; }
        public int Age { get; set; }
        public String RegisteredDate { get; set; }
        public String LastAccess { get; set; }
        public int PhoneNumber { get; set; }
        public String FirstTimeRecommendedWidget { get; set; }

        public virtual ICollection<Session> Sessions { get; set; }
        public virtual Role Role { get; set; }
        public virtual Rank Rank { get; set; }
        public virtual ICollection<Dashboard> Dashboards { get; set; }
    }

    // Login class for the login page to submit the information to the controller through a model
    public class Login
    {
        [Required]
        [Display(Name ="Username")]
        public String Username { get; set; }

        [Required]
        [DataType(DataType.Password)]
        [Display(Name = "Password")]
        public String Password { get; set; }
        
    }

    // Login class that is only for admin to login
    public class AdminLogin
    {
        [Required]
        [Display(Name = "Admin Name")]
        public String AdminUsername { get; set; }

        [Required]
        [DataType(DataType.Password)]
        [Display(Name = "Password")]
        public String Password { get; set; }
    }

    // Register class for the register page to submit the information to the controller through a model
    public class Register
    {
        [Required]
        [Display(Name = "Username")]
        public string UserName { get; set; }

        [Required]
        [Display(Name="Full name")]
        public String FullName { get; set; }

        [Required]
        [Display(Name="Occupation")]
        public String Occupation { get; set; }

        [Display(Name="Email")]
        [EmailAddress]
        public String Email { get; set; }

        [Required]
        [Display(Name="Age")]
        public int Age { get; set; }

        public List<SelectListItem> ListRole { get; set; }


        [Required]
        [Display(Name="Role")]
        public string selectedValue {get; set;}

        [Required]
        [DataType(DataType.PhoneNumber)]
        [Display(Name="Phone number")]
        public int PhoneNumber { get; set; }

        [Required]
        [DataType(DataType.DateTime)]
        [Display(Name="Registered Date")]
        public DateTime RegisteredDate { get; set; }
        [Display(Name="Last Access")]
        [DataType(DataType.DateTime)]
        public DateTime LastAccess { get; set; }

        //[Required]
       // [Display(Name = "Role")]
       // [DataType(DataType.Text)]
        //public string Role { get; set; }

        [Required]
        [StringLength(100, ErrorMessage = "The {0} must be at least {2} characters long.", MinimumLength = 6)]
        [DataType(DataType.Password)]
        [Display(Name = "Password")]
        public string Password { get; set; }

        [DataType(DataType.Password)]
        [Display(Name = "Confirm password")]
        [System.ComponentModel.DataAnnotations.Compare("Password", ErrorMessage = "The password and confirmation password do not match.")]
        public string ConfirmPassword { get; set; }
    }

 
}