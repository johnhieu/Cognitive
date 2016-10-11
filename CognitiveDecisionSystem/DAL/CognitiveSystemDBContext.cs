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
    // Context class that will represents as a connection to the database and retreive data by using this class
    // Since using Mysql database, we have to configure this context class a bit different than the default configuration
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

        // Initialize the connection string
        public CognitiveSystemDBContext(): base("server=localhost;user=root;database=uehi;port=3306;password=lovingyou;")
        {
            Database.SetInitializer<CognitiveSystemDBContext>(new CreateDatabaseIfNotExists<CognitiveSystemDBContext>());
           

        }
        protected override void OnModelCreating(DbModelBuilder modelBuilder)
        {
            // Since there is a specialization in ScreenElement entity so we have to configure Widget and StandAloneElement to have attributes
            // from ScreenElement class
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