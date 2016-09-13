using CognitiveDecisionSystem.Models;
using CognitiveDecisionSystem.DAL;
using System;
using System.Text;
using System.Data;
using System.IO;
using System.Linq;
using System.Web.Mvc;
using System.Web.Security;
using WebMatrix.WebData;
using System.Collections.Generic;
using System.ComponentModel;
using NPOI.SS.UserModel;
using NPOI.XSSF.UserModel;
using NPOI.HSSF.UserModel;
using MySql.Data.Entity;
using System.Data.Entity;
using MySql.Data.MySqlClient;
using System.Web.Routing;



namespace CognitiveDecisionSystem.Controllers
{
    public class RegularUserController : Controller
    {
        private CognitiveSystemDBContext db = new CognitiveSystemDBContext();
        
       
        public ActionResult Index()
        {
            return View(db.Users.ToList());
           
        }



        //
        // GET: /RegularUser/Login
        [AllowAnonymous]
        public ActionResult Login()
        {
           
            return View();
        }

        

        //
        // POST: /RegularUser/Login
        [HttpPost]
        [AllowAnonymous]
        [ValidateAntiForgeryToken]
        public ActionResult Login(Login model)
        {
            
            int length = 9;
            int[] widgetCount = new int[length+1];
            string[] widgetClicked = new string[length + 1];
            if (ModelState.IsValid && WebSecurity.Login(model.Username, model.Password))
            {
                // Change the last access attribute
                RegularUser user = new RegularUser();
                user = db.Users.Find(WebSecurity.GetUserId(model.Username));
                user.LastAccess = DateTime.Now.ToString();
                db.Entry(user).State = EntityState.Modified;
                
              

                // Check user's rank
                DateTime registeredDate = DateTime.Parse(user.RegisteredDate);
                TimeSpan timePeriod = DateTime.Now - registeredDate;

                if(timePeriod.TotalDays >= 365 && timePeriod.TotalDays < 1825)
                {
                    var advanced = db.Roles.OrderByDescending(r => r.RoleId).FirstOrDefault(r => r.RoleId == 2);
                    user.Role = advanced;
                }
                else if(timePeriod.TotalDays >= 1825)
                {
                    var advanced = db.Roles.OrderByDescending(r => r.RoleId).FirstOrDefault(r => r.RoleId == 3);        
                    user.Role = advanced;
                }

                db.Entry(user).State = EntityState.Modified;
                db.SaveChanges();

                // Check first time user

                int sessionCount = db.Sessions.Count(s => s.RegularUser.ID == user.ID);

                if(sessionCount == 0)
                {
                    var users = db.Users.ToList();
                    var highestTemp = 0;
                   
                    Array.Clear(widgetCount, 0, length+1);
                 
                    // Generate xls file for the first time user
                    DataTable dt = new DataTable();
                    dt.Columns.Add("Ranks", typeof(Int32));
                    dt.Columns.Add("RoleID", typeof(Int32));
                    dt.Columns.Add("Duration", typeof(Int32));
                    dt.Columns.Add("WidgetID", typeof(String));
                    foreach (var u in users)
                    {
                       var sessionList = db.Sessions.Where(s => s.RegularUser.ID == u.ID);
                       foreach(var sess in sessionList)
                       {
                            var records = db.Records.Where(rec => rec.Session.SessionID == sess.SessionID);
                           foreach(var r in records)
                           {
                               if (r.Widget != null)
                               {
                                   widgetCount[(r.Widget.WidgetID)]++;
                               }
                           }
                       }
                       for (int i = 1; i < length+1; i++)
                       {
                           if(widgetCount[i] > widgetCount[highestTemp])
                           {
                               highestTemp = i;
                           }
                       }
                        if(highestTemp != 0)
                        {
                            dt.Rows.Add(u.Rank.RankID,u.Role.RoleId, DateTime.Now.Month - DateTime.Parse(u.RegisteredDate).Month, "W" + highestTemp);
                        }
                        Array.Clear(widgetCount, 0, length+1);
                        highestTemp = 0;
                    }
                    WriteExcelWithNPOI(dt, "xls", "decisionTreeTest_dummy.xls");

                    
                }
               /* else
                {
                    int count = 1;
                   

                    // Only get the default widgets
                    var widgets = db.Widgets.Take(9);
                    DataTable dt = new DataTable();
                    dt.Columns.Add("id", typeof(Int32));
                    foreach(var widget in widgets)
                    {
                        dt.Columns.Add("W" + widget.WidgetID, typeof(string));
                    }
                    var sessions = db.Sessions.OrderByDescending(s => s.SessionID).Take(100);

                    // Attributes' name for data
                    var csv = new StringBuilder();
                    var line = string.Format("id,W1,W2,W3,W4,W5,W6,W7,W8,W9");
                    csv.AppendLine(line);
                    foreach(var session in sessions)
                    {
                        // Initialize the array and get the records from each session
                        var records = db.Records.Where(rec => rec.Session.SessionID == session.SessionID);
                        for (int i = 1; i < length+1; i++)
                        {
                            widgetClicked[i] = " ";
                        }

                        // Loops through the records
                        foreach (var r in records)
                        {
                            
                                if (r.Widget != null && r.Clicked && !widgetClicked[(r.Widget.WidgetID)].Equals("t"))
                                {

                                    widgetClicked[(r.Widget.WidgetID)] = "t";
                                }
                           
                           
                        }
                        
                        /* Add custom row into dt variable using row
                        DataRow row = dt.NewRow();
                        row[0] = count;
                        for(int i = 1; i< length+1; i++)
                        {
                            row[i] = widgetClicked[i];
                        }
                        dt.Rows.Add(row);
                        count++;
                        Array.Clear(widgetClicked, 0, length + 1); // Remember to end comment here

                        // Add custom using StringBuilder and file path   
                        var newLine = string.Format("{0},{1},{2},{3},{4},{5},{6},{7},{8},{9}", count, widgetClicked[1], widgetClicked[2], widgetClicked[3], widgetClicked[4], widgetClicked[5], widgetClicked[6], widgetClicked[7], widgetClicked[8], widgetClicked[9]);

                        csv.AppendLine(newLine);

                        
                        count++;
                    }
                  
                    //WriteExcelWithNPOI(dt, "xls", "associationRule.csv");
                    StreamWriter sw = new StreamWriter(@"D:\functions\train.csv");
                    sw.Write(csv.ToString());
                    sw.Close();

                    
                }*/
                
                // Create a Session record
                DateTime localDate = DateTime.Now;
                Session newSession = new Session();
                int id = db.Sessions.Count();
                newSession.SessionID = id+1;
                newSession.SessionDate = localDate.ToShortDateString();
                newSession.StartTime = localDate.ToShortTimeString();
                newSession.RegularUser = user;
                db.Sessions.Add(newSession);
                db.SaveChanges();

                ViewBag.RnR = "";

                return RedirectToAction("YourDashboard", "RegularUser");

               
            }

            // If we got this far, something failed, redisplay form
            ModelState.AddModelError("", "The user name or password provided is incorrect.");
            return View(model);
        }

        // GET: /RegularUser/LogOut
        public ActionResult LogOut()
        {
            WebSecurity.Logout();
            int id = WebSecurity.CurrentUserId;

            var lastestSession = db.Sessions.OrderByDescending(s => s.SessionID).FirstOrDefault(s => s.RegularUser.Username == WebSecurity.CurrentUserName);

            lastestSession.EndTime = DateTime.Now.ToShortTimeString();
            db.Entry(lastestSession).State = EntityState.Modified;
            db.SaveChanges();


            return RedirectToAction("Login", "RegularUser");
        }

        [AllowAnonymous]
        public ActionResult Register()
        {
            Register model = new Register();
            model.ListRole = new List<SelectListItem>();

            model.ListRole.Add(new SelectListItem
            {
                Text = "Financial Executive",
                Value = "Financial Executive"
            });
            model.ListRole.Add(new SelectListItem
            {
                Text = "Logistic",
                Value = "Logistic",
                Selected = true
            });
            model.ListRole.Add(new SelectListItem
            {
                Text = "Transaction Manager",
                Value = "Transaction Manager"
            });
            return View(model);
           
      
        }

        //
        // POST: /RegularUser/Register

        [HttpPost]
        [AllowAnonymous]
        [ValidateAntiForgeryToken]
        public ActionResult Register(Register model)
        {
            if (ModelState.IsValid)
            {
                // Attempt to register the user
                try
                {
                   /* var membership = (SimpleMembershipProvider)Membership.Provider;
                    membership.CreateUserAndAccount(model.UserName, model.Password, new Dictionary<string, object>
                    { { "FullName", model.FullName },
                        { "Occupation", model.Occupation },
                        { "Age", model.Age },
                        { "Email ", model.Email },
                        { "RegisteredDate", DateTime.Now.ToString() },
                        { "PhoneNumber", model.PhoneNumber },
                        { "LastAccess", DateTime.Now.ToString() },
                        { "Role_RoleId", '1'}
                    });*/
                    RegularUser user = new RegularUser();
                    user.Age = model.Age;
                    user.FullName = model.FullName;
                    user.Username = model.UserName;
                    user.Occupation = model.Occupation;
                    user.Email = model.Email;
                    user.RegisteredDate = DateTime.Now.ToString();
                    user.LastAccess = DateTime.Now.ToString();
                    user.PhoneNumber = model.PhoneNumber;
                    user.FirstTimeRecommendedWidget = null;
                    var roles = db.Roles.ToList();
                    foreach(var role in roles)
                    {
                        if(role.RoleType.Equals(model.selectedValue))
                        {
                            user.Role = role;
                        }
                    }
                    user.Rank = db.Ranks.OrderByDescending(r => r.RankID).FirstOrDefault(r => r.RankID == 1); 
                    db.Users.Add(user);
                    db.SaveChanges();
                    WebSecurity.CreateAccount(model.UserName, model.Password);

                    return RedirectToAction("Login", "RegularUser");
                }
                catch (MembershipCreateUserException e)
                {
                    ModelState.AddModelError("", ErrorCodeToString(e.StatusCode));
                }
            }
             
            // If we got this far, something failed, redisplay form
            return View(model);
        }

 

 






        public bool WriteExcelWithNPOI(DataTable dt, String extension, String name)
        {

            IWorkbook workbook;

            if (extension == "xlsx")
            {
                workbook = new XSSFWorkbook();
            }
            else if (extension == "xls")
            {
                workbook = new HSSFWorkbook();
            }
            else
            {
                throw new Exception("This format is not supported");
            }

            ISheet sheet1 = workbook.CreateSheet("Sheet 1");

            //make a header row
            IRow row1 = sheet1.CreateRow(0);

            for (int j = 0; j < dt.Columns.Count; j++)
            {

                ICell cell = row1.CreateCell(j);
                String columnName = dt.Columns[j].ToString();
                cell.SetCellValue(columnName);
            }

            //loops through data
            for (int i = 0; i < dt.Rows.Count; i++)
            {
                IRow row = sheet1.CreateRow(i + 1);
                for (int j = 0; j < dt.Columns.Count; j++)
                {
                    if (j < 1)
                    {
                        ICell cell = row.CreateCell(j);
                        String columnName = dt.Columns[j].ToString();
                        cell.SetCellValue(Int32.Parse(dt.Rows[i][columnName].ToString()));

                    }
                    else
                    {
                        ICell cell = row.CreateCell(j);
                        String columnName = dt.Columns[j].ToString();
                        cell.SetCellValue(dt.Rows[i][columnName].ToString());
                    }
                }
            }

           

            using (FileStream stream = new FileStream(@"D:\functions\" + name, FileMode.Create, FileAccess.Write))
            {
                
                workbook.Write(stream);
                stream.Close();
                return true;
            }
        }

        [HttpPost]
        public int InitUsername()
        {
            return WebSecurity.CurrentUserId;

        }

        public ActionResult YourDashboard()
        {
           
            if (User.Identity.IsAuthenticated)
            {
                int id = WebSecurity.GetUserId(User.Identity.Name);
                RegularUser user = db.Users.Find(id);
                ViewBag.Rank = "Rank: " + user.Rank.RankName;
                ViewBag.Role = "Role: " + user.Role.RoleType;
                var dashboards = db.Dashboards.Where(d => d.RegularUser.ID == id);
                ViewBag.NewlyCreatedWidget = db.Widgets.OrderByDescending(w => w.WidgetID).Where(w => w.Dashboard.RegularUser.ID == id).FirstOrDefault();
                ViewBag.Dashboards = new Dashboard[dashboards.Count()];
                int count = 0;
                foreach(var d in dashboards)
                {
                    ViewBag.Dashboards[count++] = d;
                }
                return View();

            }
            return RedirectToAction("Error", "System");
        }

      

        public ActionResult CreateWidget()
        {
      
            if (User.Identity.IsAuthenticated)
            {
                int id = WebSecurity.GetUserId(User.Identity.Name);
                RegularUser user = db.Users.Find(id);
                ViewBag.Rank = "Rank: " + user.Rank.RankName;
                ViewBag.Role = "Role: " + user.Role.RoleType;
                return View();

            }
            return RedirectToAction("Error", "System");
        }
        //
        // GET: /User/Create

        public ActionResult Create()
        {
            return View();
        }

        //
        // POST: /User/Create


       



       

        protected override void Dispose(bool disposing)
        {
            db.Dispose();
            base.Dispose(disposing);
        }

        private static string ErrorCodeToString(MembershipCreateStatus createStatus)
        {
            // See http://go.microsoft.com/fwlink/?LinkID=177550 for
            // a full list of status codes.
            switch (createStatus)
            {
                case MembershipCreateStatus.DuplicateUserName:
                    return "User name already exists. Please enter a different user name.";

                case MembershipCreateStatus.DuplicateEmail:
                    return "A user name for that e-mail address already exists. Please enter a different e-mail address.";

                case MembershipCreateStatus.InvalidPassword:
                    return "The password provided is invalid. Please enter a valid password value.";

                case MembershipCreateStatus.InvalidEmail:
                    return "The e-mail address provided is invalid. Please check the value and try again.";

                case MembershipCreateStatus.InvalidAnswer:
                    return "The password retrieval answer provided is invalid. Please check the value and try again.";

                case MembershipCreateStatus.InvalidQuestion:
                    return "The password retrieval question provided is invalid. Please check the value and try again.";

                case MembershipCreateStatus.InvalidUserName:
                    return "The user name provided is invalid. Please check the value and try again.";

                case MembershipCreateStatus.ProviderError:
                    return "The authentication provider returned an error. Please verify your entry and try again. If the problem persists, please contact your system administrator.";

                case MembershipCreateStatus.UserRejected:
                    return "The user creation request has been canceled. Please verify your entry and try again. If the problem persists, please contact your system administrator.";

                default:
                    return "An unknown error occurred. Please verify your entry and try again. If the problem persists, please contact your system administrator.";
            }
        }
    }
}