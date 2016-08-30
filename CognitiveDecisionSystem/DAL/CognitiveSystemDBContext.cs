using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Data.Entity;
using System.Data.Entity.ModelConfiguration.Conventions;
using CognitiveDecisionSystem.Models;
using MySql.Data.Entity;
using System.Text;

namespace CognitiveDecisionSystem.DAL
{
    [DbConfigurationType(typeof(MySqlEFConfiguration))]
    public class CognitiveSystemDBContext: DbContext
    {
        public DbSet<RegularUser> Users { get; set; }
        public DbSet<Role> Roles{ get; set; }
        public DbSet<Session> Sessions { get; set;}
        public DbSet<Record> Records { get; set; }
        public DbSet<Widget> Widgets { get; set; }
        public DbSet<StandAloneElement> StandAloneElements { get; set; }
        public DbSet<Rank> Ranks { get; set; }
        public DbSet<Dashboard> Dashboards { get; set; }


        public CognitiveSystemDBContext(): base("server=localhost;user=root;database=uehi;port=3306;password=lovingyou;")
        {
            Database.SetInitializer<CognitiveSystemDBContext>(new CreateDatabaseIfNotExists<CognitiveSystemDBContext>());
           

        }
        protected override void OnModelCreating(DbModelBuilder modelBuilder)
        {
            modelBuilder.Conventions.Remove<PluralizingTableNameConvention>();
            modelBuilder.Entity<Widget>().Map(m =>
                {
                    m.MapInheritedProperties();
                    m.ToTable("Widget");
                });
            modelBuilder.Entity<StandAloneElement>().Map(m =>
                {
                    m.MapInheritedProperties();
                    m.ToTable("StandAloneElement");
                });
        }
    }
}