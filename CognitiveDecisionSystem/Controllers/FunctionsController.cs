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
    // Controller classes that contain functions that to be called from the client
   
    public class FunctionsController : Controller
    {
        private CognitiveSystemDBContext db = new CognitiveSystemDBContext();

        // Get last widget order for the default dashboard
        [HttpGet]
        public String GetLastWidgetOrder(String username)
        {
            RegularUser user = db.Users.Find(WebSecurity.GetUserId(username));
            return user.FirstTimeRecommendedWidget;
        }

        // Store the current dashboard when user leaves the session
        [HttpGet]
        public String StoreCurrentDashboard(String username, String widgetID)
        {
            RegularUser user = db.Users.Find(WebSecurity.GetUserId(username));
            user.FirstTimeRecommendedWidget = widgetID;
            db.Entry(user).State = EntityState.Modified;
            db.SaveChanges();
            return "Success";
        }

        // Get the order of the widgets in the default dashboard
        [HttpGet]
        public String CheckFirstTimeUser(String username)
        {
            String popularWidget = "";
            int sessionCount = db.Sessions.Count(s => s.RegularUser.Username == username);
            RegularUser user = db.Users.Find(WebSecurity.GetUserId(username));
            // Check the session if there is only 1 session then this is the new user
            if (sessionCount == 1)
            {
                // Call the matlab function: DemoDecistionTree_2 to use the excel file generated when they login to get the suggestion for the 
                // first time user
                MLApp.MLApp matlab = new MLApp.MLApp();

                matlab.Execute(@"cd D:\functions");

                object result = null;

                matlab.Feval("recommendWidget", 1, out result, Double.Parse(user.Rank.RankID.ToString()), Double.Parse(user.Role.RoleId.ToString()), Double.Parse((DateTime.Now.Month - DateTime.Parse(user.RegisteredDate).Month).ToString()));

                object[] res = result as object[];


                String temp = Convert.ToString(res[0]);
                popularWidget = temp.Substring(1);
                user.FirstTimeRecommendedWidget = "1 2 3 4 5 6 7 8 9";

                db.Entry(user).State = EntityState.Modified;
                db.SaveChanges();
            }
            // Not the first time user, use the second suggestion including the first widget recommedation
            else
            {

                string widgetOrder = user.FirstTimeRecommendedWidget;
               
                int length = 9;
                int[] widgetCount = new int[length + 1];
                int highestTemp = 0;
                int count = 0;
                bool notEmpty = false;

                // Check if the last session is empty or not
                var sessions = db.Sessions.OrderByDescending(s => s.SessionID).Where(u => u.RegularUser.ID == user.ID);
                foreach (var s in sessions)
                {
                    // Only check the last session by using condition count to check the second session in the list sessions variable
                    if (count == 1)
                    {
                        var session = s;
                        var records = db.Records.Where(rec => rec.Session.SessionID == session.SessionID);
                        foreach (var r in records)
                        {
                            if (r.Widget != null)
                            {
                                if (!notEmpty)
                                {
                                    notEmpty = true;
                                }
                                widgetCount[(r.Widget.WidgetID)]++;
                            }

                        }

                    }

                    count++;
                }

                // If empty, we just need to populate the old data already stored in the database
                if (!notEmpty)
                {
                    popularWidget = widgetOrder;
                }
                else
                {
                    // Get the recommended widget based on the most used widget in the last session
                    for (int i = 1; i < length + 1; i++)
                    {
                        if (widgetCount[i] > widgetCount[highestTemp])
                        {
                            highestTemp = i;
                        }
                    }
                    popularWidget = highestTemp.ToString();

                    string firstW = "W"+ popularWidget;
                    string secondW = "W" + user.FirstTimeRecommendedWidget.Substring(0, 1);
                    
                    // If the first widget and the second widget is different, generate the recommendation using Matlab function GenerateAssociationRules
                    if (firstW != secondW)
                    {
                        // Association Rule Generation

                        MLApp.MLApp matlab = new MLApp.MLApp();

                        matlab.Execute(@"cd D:\functions");

                        object result = null;

                        matlab.Feval("GenerateAssociationRules", 1, out result, "associationRuleFile.csv");

                        object[] res = result as object[];



                        // Convert result from matlab function to be used in the system

                        string str = Convert.ToString(res[0]);
                        string recommendedW = "Empty";
                        string[] stringSeparators = new string[] { "==>", "\n" };
                        string[] arrListStr = str.Split(stringSeparators, StringSplitOptions.RemoveEmptyEntries); // tokens = "Best in found:" or LHS or RHS of a rule
                       
                        int chk = 0;
                        for (int i = 1; i < arrListStr.Length; i = i + 2) // check the odd tokens (LHS) to find the firstW
                        {
                            if (arrListStr[i].ToString().Contains(firstW) == true)
                            {
                                chk = i + 1;
                                break;
                            }
                        }
                        if (chk == 0) // there is no firstW in the LHS
                        {
                            for (int i = 1; i < arrListStr.Length; i = i + 2) // check the odd tokens (LHS) to find the secondW
                            {
                                if (arrListStr[i].ToString().Contains(secondW) == true)
                                {
                                    chk = i + 1;
                                    break;
                                }
                            }
                        }

                        if (chk == 0) // there is not firstW and secondW in LHS - no rules for recommending
                        {
                            // adding the default widget here
                            recommendedW = "Empty";
                        }
                        else
                        {
                            string[] subArrListStr = arrListStr[chk].Trim().Split(' ');

                            recommendedW = subArrListStr[0].Substring(1, subArrListStr[0].Length - 3);
                        }

                        // Check if the third widget is not empty and also not the same either the first or the second widget
                        if(recommendedW != "Empty" && recommendedW != popularWidget && recommendedW != user.FirstTimeRecommendedWidget.Substring(0,1))
                        {
                            popularWidget += " " + user.FirstTimeRecommendedWidget.Substring(0, 1) +" " + recommendedW;
                        }
                        else
                        {
                            popularWidget += " " + user.FirstTimeRecommendedWidget.Substring(0, 1);
                        }

                        // Add the result after converting data from Matlab function
                        String[] splits = widgetOrder.Split(null);
                        for (int i = 0; i < splits.Length; i++)
                        {
                            if (highestTemp.ToString().Equals(splits[i]) || recommendedW.Equals(splits[i]) || user.FirstTimeRecommendedWidget.Substring(0, 1).Equals(splits[i]))
                            {
                                continue;
                            }
                            else
                            {
                                popularWidget += " " + splits[i];
                            }
                        }
                    }

                    // If first widget is the same with the secondW then we dont need to produce any rules
                    else
                    {
                        String[] splits = widgetOrder.Split(null);
                        for (int i = 0; i < splits.Length; i++)
                        {
                            if (highestTemp.ToString().Equals(splits[i]))
                            {
                                continue;
                            }
                            else
                            {
                                popularWidget += " " + splits[i];
                            }
                        }
                    }



                   

                }
            }

            return popularWidget;
        }

        // Functions that are used to record the mouse movement called from the website using AJAX
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
            string[] xcoordclicks = tokens[6].Split('=');
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

            
            for (int i = 0; i < x.Length; i++)
            {

                if (x[i] == xclick[i] && y[i] == yclick[i])
                {
                    clicked = true;
                }
                else
                {
                    clicked = false;
                }

                for (int j = 0; j < 10; j++)
                {
                    if (elementsID[i].Contains(widgets[j].HTMLId) )
                    {
                        repeatedRecord.Widget = widgets[j];
                    }
                }
                repeatedRecord.CoordX = Int32.Parse(x[i]);
                repeatedRecord.CoordY = Int32.Parse(y[i]);

                repeatedRecord.Clicked = clicked;

                // Save the record
                db.Records.Add(repeatedRecord);
                db.SaveChanges();
            }

        }

    }
}