using CognitiveDecisionSystem.Models;
using CognitiveDecisionSystem.DAL;
using System;
using System.Data;
using System.Linq;
using System.Web.Mvc;
using System.Web.Security;
using WebMatrix.WebData;
using System.Collections.Generic;
using System.IO;
using System.ComponentModel;
using NPOI.SS.UserModel;
using NPOI.XSSF.UserModel;
using NPOI.HSSF.UserModel;
using MySql.Data.Entity;
using System.Data.Entity;
using MySql.Data.MySqlClient;

namespace CognitiveDecisionSystem.Controllers
{
    public class RegularUserController : Controller
    {
        private CognitiveSystemDBContext db = new CognitiveSystemDBContext();
        
       
        //
        // GET: /RegularUser/

        public ActionResult Index()
        {
            return View(db.Users.ToList());
        }

        //
        // GET: /RegularUser/Details/5

        public ActionResult Details(int id = 0)
        {
            
            RegularUser user = db.Users.Find(id);
            if (user == null)
            {
                return HttpNotFound();
            }
            return View(user);
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
            int length = db.Widgets.Count();
            int[] widgetCount = new int[length+1];
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
                    var highestTemp = 1;
                   
                    Array.Clear(widgetCount, 0, length+1);
                 
                    DataTable dt = new DataTable();

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
                            dt.Rows.Add(u.Role.RoleId, DateTime.Now.Month - DateTime.Parse(u.RegisteredDate).Month, "W" + highestTemp);
                        }
                        Array.Clear(widgetCount, 0, length+1);
                        highestTemp = 0;
                    }
                    WriteExcelWithNPOI(dt, "xls", "decisionTreeTest_dummy.xls");

                    
                }

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

                return RedirectToAction("Induction_Page_Update", "System");

               
            }

            // If we got this far, something failed, redisplay form
            ModelState.AddModelError("", "The user name or password provided is incorrect.");
            return View(model);
        }

        [AllowAnonymous]
        public ActionResult Register()
        {
            return View();
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
                    user.Role = db.Roles.OrderByDescending(r => r.RoleId).FirstOrDefault(r => r.RoleId == 1);

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

        [HttpGet]
        public String CheckFirstTimeUser(String username)
        {
            String popularWidget = "";
             int sessionCount = db.Sessions.Count(s => s.RegularUser.Username == username);
             RegularUser user = db.Users.Find(WebSecurity.GetUserId(username));
             if(sessionCount != 1)
             {
                 MLApp.MLApp matlab = new MLApp.MLApp();

                 matlab.Execute(@"cd D:\functions");

                 object result = null;

                 matlab.Feval("DemoDecisionTree_2", 1 , out result, Double.Parse(user.Role.RoleId.ToString()), Double.Parse((DateTime.Now.Month-DateTime.Parse(user.RegisteredDate).Month).ToString()));

                 object[] res = result as object[];


                 String temp = Convert.ToString(res[0]);
                 popularWidget = temp.Substring(1);
             }
             return popularWidget;
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
                    if (j < 2)
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

            using (FileStream stream = new FileStream(@"D:\functions\"+name, FileMode.Create, FileAccess.Write))
            {
                workbook.Write(stream);
                stream.Close();
                return true;
            }
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


        [HttpPost]
        public void RecordLog(string data)
        {
            string[] tokens = data.Split('&');
          
            var lastestSession = db.Sessions.OrderByDescending(s => s.SessionID).FirstOrDefault(s => s.RegularUser.Username == WebSecurity.CurrentUserName);
            // Look for sessionID
            int sessionID = lastestSession.SessionID;
            
            //List of Widgets
            List<Widget> widgets = db.Widgets.ToList();

            //Look for timestamp
            string[] timeSplit = tokens[1].Split('=');
            double timeStamp = double.Parse(timeSplit[1]);

            // Screen width and height
            string[] screenHeightSplit = tokens[3].Split('=');
            int screenHeight = Int32.Parse(screenHeightSplit[1]);

            string[] screenWidthSplit = tokens[2].Split('=');
            int screenWidth = Int32.Parse(screenWidthSplit[1]);

            // FPS
            int fps = 24;

            // X and Y Coordinate
            string[] xcoord = tokens[4].Split('=');
            string[] x = xcoord[1].Split(',');

            string[] ycoord = tokens[5].Split('=');
            string[] y = ycoord[1].Split(',');

            // X and Y Clicked
            string[] xcoordclicks= tokens[6].Split('=');
            string[] xclick = xcoordclicks[1].Split(',');

            string[] ycoordclicks = tokens[7].Split('=');
            string[] yclick = ycoordclicks[1].Split(',');

            bool clicked = true;

            //Hovered element
            string[] elements = tokens[8].Split('=');
            string[] elementsID = elements[1].Split(',');
            
            //Create a instance to hold a record
            Record repeatedRecord = new Record();
            int recordID = db.Records.Count();
            repeatedRecord.RecordID = recordID + 1;
            repeatedRecord.ScreenLength = screenHeight;
            repeatedRecord.ScreenWidth = screenWidth;
            repeatedRecord.Session = lastestSession;
            repeatedRecord.TimeStamp = timeStamp;
            repeatedRecord.FPS = fps;
            
         
            for(int i=0; i < x.Length; i++)
            {
                
                if(x[i] == xclick[i] && y[i] == yclick[i])
                {
                    clicked = true;
                }
                else
                {
                    clicked = false;
                }

                for (int j = 0; j < widgets.Count(); j++ )
                {
                    if (elementsID[i].Contains(widgets[j].HTMLId))
                    {
                        repeatedRecord.Widget = widgets[j];
                    }
                }
                repeatedRecord.CoordX = Int32.Parse(x[i]);
                repeatedRecord.CoordY = Int32.Parse(y[i]);
                
                repeatedRecord.Clicked = clicked;
               
                db.Records.Add(repeatedRecord);
                db.SaveChanges();
            }

        }

        [HttpPost]
        public int InitUsername()
        {
            return WebSecurity.CurrentUserId;
        }

        public ActionResult YourDashboard()
        {
            return View();
        }

        public ActionResult CreateWidget()
        {
            return View();
        }
        //
        // GET: /User/Create

        public ActionResult Create()
        {
            return View();
        }

        //
        // POST: /User/Create

        [HttpPost]
        [ValidateAntiForgeryToken]
        public ActionResult Create(RegularUser user)
        {
            if (ModelState.IsValid)
            {
                db.Users.Add(user);
                db.SaveChanges();
                return RedirectToAction("Index");
            }

            return View(user);
        }

        //
        // GET: /User/Edit/5

        public ActionResult Edit(int id = 0)
        {
            RegularUser user = db.Users.Find(id);
            if (user == null)
            {
                return HttpNotFound();
            }
            return View(user);
        }

        //
        // POST: /User/Edit/5

        [HttpPost]
        [ValidateAntiForgeryToken]
        public ActionResult Edit(RegularUser user)
        {
            if (ModelState.IsValid)
            {
                db.Entry(user).State = EntityState.Modified;
                db.SaveChanges();
                return RedirectToAction("Index");
            }
            return View(user);
        }

        //
        // GET: /User/Delete/5

        public ActionResult Delete(int id = 0)
        {
            RegularUser user = db.Users.Find(id);
            if (user == null)
            {
                return HttpNotFound();
            }
            return View(user);
        }

        //
        // POST: /User/Delete/5

        [HttpPost, ActionName("Delete")]
        [ValidateAntiForgeryToken]
        public ActionResult DeleteConfirmed(int id)
        {
            RegularUser user = db.Users.Find(id);
            db.Users.Remove(user);
            db.SaveChanges();
            return RedirectToAction("Index");
        }

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