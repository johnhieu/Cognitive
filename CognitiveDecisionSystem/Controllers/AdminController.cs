using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using CognitiveDecisionSystem.DAL;
using CognitiveDecisionSystem.Models;
namespace CognitiveDecisionSystem.Controllers
{
    public class AdminController : Controller
    {
        private CognitiveSystemDBContext db = new CognitiveSystemDBContext();
        // GET: Admin/UserInformation
        // Get users inforation with ranks and roles
        public ActionResult UserInformation()
        {
            var users = db.Users.ToList();
            var ranks = db.Ranks.ToList();
            var roles = db.Roles.ToList();

            // Send data to dynamic attribute used in View
            ViewBag.Users = new RegularUser[users.Count()];
            ViewBag.Ranks = new Rank[ranks.Count()];
            ViewBag.Roles = new Role[roles.Count()];
            int count = 0;
            foreach (var d in users)
            {
                ViewBag.Users[count++] = d;
            }
            count = 0;

            foreach(var rank in ranks)
            {
                ViewBag.Ranks[count++] = rank;
            }
            count = 0;

            foreach(var role in roles)
            {
                ViewBag.Roles[count++] = role;
            }

            return View();
        }

        // GET: Admin/SessionInformation
        // Get all session and the latest 1000 records 
        public ActionResult SessionInformation()
        {
            var sessions = db.Sessions.ToList();
            var records = db.Records.OrderByDescending(r => r.RecordID).Take(1000);

            ViewBag.Sessions = new Session[sessions.Count()];
            ViewBag.Records = new Record[records.Count()];

            int count = 0;

            foreach(var session in sessions)
            {
                ViewBag.Sessions[count++] = session;
            }
            count = 0;

            foreach(var record in records)
            {
                ViewBag.Records[count++] = record;
            }
            return View();
        }

        // GET: Admin/DashboardInformation
        // Get dashboard and widget information
        public ActionResult DashboardInformation()
        {
            var dashboards = db.Dashboards.ToList();
            var widgets = db.Widgets.ToList();
            var users = db.Users.ToList();

            ViewBag.Users = new RegularUser[users.Count()];
            ViewBag.Dashboards = new Dashboard[dashboards.Count()];
            ViewBag.Widgets = new Widget[widgets.Count()];

            int count = 0;

            foreach(var dashboard in dashboards)
            {
                ViewBag.Dashboards[count++] = dashboard;
            }
            count = 0;

            foreach (var d in users)
            {
                ViewBag.Users[count++] = d;
            }

            count = 0;

            foreach(var widget in widgets)
            {
                ViewBag.Widgets[count++] = widget;
            }
            return View();
        }
    }
}