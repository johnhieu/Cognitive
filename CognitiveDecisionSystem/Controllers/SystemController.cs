using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using System.Web.Security;
using WebMatrix.WebData;
using System.IO;

namespace CognitiveDecisionSystem.Controllers
{
    public class SystemController : Controller
    {
        //
        // GET: /System/

        public ActionResult Index()
        {
            return View();
        }

        // GET: /System/dashboard
      
        public ActionResult Induction_Page_Update()
        {
        
            return View();
        }

        // GET: /System/DecisionSummary_Page_Update

        public ActionResult DecisionSummary_Page_Update(string SSCode)
        {
  
            ViewBag.SSCode = SSCode;
            return View();
        }

        [OutputCache(NoStore = true, Duration = 0, VaryByParam = "None")]
        public ActionResult SupplierPerformance()
        {
            return View();
            
        }

     
    }
}
