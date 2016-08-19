using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.ComponentModel.DataAnnotations.Schema;
using System.ComponentModel.DataAnnotations;
using System.Data.Entity;


namespace CognitiveDecisionSystem.Models
{
    
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

        public virtual ICollection<Session> Sessions { get; set; }
        public virtual Role Role { get; set; }
        public virtual Rank Rank { get; set; }
    }

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


        [Required]
        [StringLength(100, ErrorMessage = "The {0} must be at least {2} characters long.", MinimumLength = 6)]
        [DataType(DataType.Password)]
        [Display(Name = "Password")]
        public string Password { get; set; }

        [DataType(DataType.Password)]
        [Display(Name = "Confirm password")]
        [Compare("Password", ErrorMessage = "The password and confirmation password do not match.")]
        public string ConfirmPassword { get; set; }
    }

 
}