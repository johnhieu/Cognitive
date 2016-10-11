﻿using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using System.Web.Security;
using WebMatrix.WebData;
using System.IO;
using CognitiveDecisionSystem.Models;
using CognitiveDecisionSystem.DAL;

namespace CognitiveDecisionSystem.Controllers
{
    public class SystemController : Controller
    {
        //
        // GET: /System/
        private CognitiveSystemDBContext db = new CognitiveSystemDBContext();
       

        // GET: /System/Induction_Page_Update
        // Return to the Induction Page 
        public ActionResult Induction_Page_Update()
        {

            if (User.Identity.IsAuthenticated)
            {
                int id = WebSecurity.GetUserId(User.Identity.Name);
                RegularUser user = db.Users.Find(id);
                return View(user);

            }
            return RedirectToAction("Error", "System");
        }

        // GET: /System/DecisionSummary_Page_Update
        // Get the Decision Summary page 
        public ActionResult DecisionSummary_Page_Update(string SSCode)
        {
            
            ViewBag.SSCode = SSCode;
            if (User.Identity.IsAuthenticated)
            {
                return View();

            }
            return RedirectToAction("Error", "System");
        }

        // GET: /System/SupplierPerformance
       // [OutputCache(NoStore = true, Duration = 0, VaryByParam = "None")]
        // The default dashboard Supplier performance which the mouse tracking happens
        public ActionResult SupplierPerformance()
        {
            if (User.Identity.IsAuthenticated)
            {
                int id = WebSecurity.GetUserId(User.Identity.Name);
                RegularUser user = db.Users.Find(id);
                return View(user);

            }
            return RedirectToAction("Error", "System");
            
        }

        // GET: System/DisplayWidget?id=
        // Display widgets in a dashboard specified by the id
        public ActionResult DisplayWidgets(int id)
        {
            var widgets = db.Widgets.Where(w => w.Dashboard.DashboardId == id);
            ViewBag.Widgets = new Widget[widgets.Count()];
            int count = 0;
            foreach (var w in widgets)
            {
                ViewBag.Widgets[count++] = w;
            }
            return View();
        }

        // Add custom dashboard 
        [HttpPost]
        public ActionResult AddDashboard(FormDashboard form)
        {
       
          
                Dashboard newDashboard = new Dashboard();

                newDashboard.DashboardName = form.DashboardName;
                newDashboard.DashboardDesc = form.DashboardDesc;
                newDashboard.RegularUser = db.Users.Find(WebSecurity.GetUserId(form.Username));

                db.Dashboards.Add(newDashboard);
                db.SaveChanges();

                return RedirectToAction("YourDashboard", "RegularUser");
          

        }

        // Return a list of dashboard for a particular user
        [HttpGet]
        public String GetDashboard(String username)
        {
            int id = WebSecurity.GetUserId(username);
            var dashboards = db.Dashboards.Where(s => s.RegularUser.ID == id);
            String list = "";

            foreach(var d in dashboards)
            {
                list += d.DashboardName + ","+d.DashboardId+";";
            }
            return list;
        }

        // Add custom widget to the particular dashboard
        [HttpPost]
        public ActionResult AddWidget(WidgetDashboard widget)
        {
            int count = db.Widgets.Count();

            Widget newWidget = new Widget();
            newWidget.WidgetName = widget.WidgetName;
            newWidget.WidgetQuery = widget.WidgetQuery;
            newWidget.HTMLId = count.ToString();
            newWidget.WidgetType = widget.WidgetType;
            newWidget.Dashboard = db.Dashboards.Find( widget.DashboardId);

            db.Widgets.Add(newWidget);
            db.SaveChanges();

            return RedirectToAction("YourDashboard", "RegularUser");
        }

        // GET: System/Error
        public ActionResult Error()
        {
            return View();
        }
     
    }
}
