using System;
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
        public ActionResult Index()
        {
            if (User.Identity.IsAuthenticated)
            {
                return View();

            }
            return RedirectToAction("Error", "System");
        }

        // GET: /System/dashboard
      
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

        public ActionResult DecisionSummary_Page_Update(string SSCode)
        {
            
            ViewBag.SSCode = SSCode;
            if (User.Identity.IsAuthenticated)
            {
                return View();

            }
            return RedirectToAction("Error", "System");
        }

        [OutputCache(NoStore = true, Duration = 0, VaryByParam = "None")]
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
        public ActionResult Error()
        {
            return View();
        }
     
    }
}
