using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using NUnit.Framework;
using CognitiveDecisionSystem.DAL;
using CognitiveDecisionSystem.Models;
using System.Web.Security;
using WebMatrix.WebData;
using System.ComponentModel;
using NPOI.SS.UserModel;
using NPOI.XSSF.UserModel;
using NPOI.HSSF.UserModel;
using System.Data;
using System.IO;
using MySql.Data.MySqlClient;

namespace CognitiveDecisionSystem.Test
{
    [TestFixture]
    public class NunitTesting
    {
        private CognitiveSystemDBContext db = new CognitiveSystemDBContext();

        [Test]
        public void RecordLog()
        {
            // This testing is integration testing, by using a dummy data of a record then add these data to the database
            // After that, check how many records have been added to the session. In this case there will be 47 records in total.
            String data = "uid=44&time=8.013&pagew=895&pageh=4748&xcoords=558,552,552,570,589,589,600,684,780,802,807,837,850,850,850,850,850,855,868,871,871,871,871,871,871,871,871,871,871,871,871,871,871,871,871,871,871,870,870,870,870,870,870,870,870,870,870&ycoords=125,116,116,126,130,130,135,145,145,144,150,166,171,171,171,171,171,406,463,470,470,473,473,473,473,473,473,473,473,972,978,978,978,978,978,978,978,1378,1378,1378,1378,1378,1378,1378,1778,1778,1778&xclicks=,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,&yclicks=,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,&elhovered=DIV#Suppliers and Suppliers Performance DIV.panel-body,None,None,DIV#Suppliers and Suppliers Performance DIV.panel-body,DIV#Suppliers and Suppliers Performance DIV.panel-body,None,None,DIV#Suppliers and Suppliers Performance DIV.panel-body,DIV#Suppliers and Suppliers Performance DIV.panel-body,DIV#Suppliers and Suppliers Performance DIV.panel-body H4,DIV#Suppliers and Suppliers Performance DIV.panel-body H4,DIV#Suppliers and Suppliers Performance DIV.panel-body H4,DIV#Suppliers and Suppliers Performance DIV.panel-body H4,DIV#Suppliers and Suppliers Performance,None,None,None,None,None,DIV#Suppliers and Suppliers Performance,DIV#body DIV.container-fluid,None,None,None,None,None,None,None,None,None,None,None,None,None,None,None,None,None,None,None,None,None,None,None,None,None,None,None,None,None&elclicked=&action=append&remote=";
            string[] tokens = data.Split('&');

            var lastestSession = db.Sessions.OrderByDescending(s => s.SessionID).FirstOrDefault(s => s.RegularUser.ID == 44);
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

                for (int j = 0; j < widgets.Count(); j++)
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

            int count = db.Records.Count(r => r.Session.SessionID == sessionID);
            Assert.AreEqual(47, count);
        }

        // Test if a file can be written out and check if that file exists or not
        [Test]
        public void WriteExcelWithNPOI()
        {
            DataTable dt = new DataTable();
            dt.Columns.Add("Test", typeof(String));
            dt.Columns.Add("Condition 1", typeof(String));
            dt.Columns.Add("Condition 2", typeof(String));

            dt.Rows.Add("Testing write file to excel file", "True", "True");
           
            String name = "test.xls";
            String extension = "xls";
           
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
                   
                    
                        ICell cell = row.CreateCell(j);
                        String columnName = dt.Columns[j].ToString();
                        cell.SetCellValue(dt.Rows[i][columnName].ToString());
                    
                }
            }

             using (FileStream stream = new FileStream(@"D:\functions\" + name, FileMode.Create, FileAccess.Write))
            {
                
                workbook.Write(stream);
                stream.Close();
                
            }
             FileAssert.Exists(@"D:\functions\" + name);
          
        }

        // This is an integration testing, this test will be tested twice, one for the first time user and the second time for not first time user
        [Test]
        public void CheckFirstTimeUser()
        {
            // First time user
            String username = "unit_test";


            String popularWidget = "";
            int sessionCount = db.Sessions.Count(s => s.RegularUser.Username == username);
            RegularUser user = db.Users.Find(WebSecurity.GetUserId(username));
            if (sessionCount == 1)
            {
                MLApp.MLApp matlab = new MLApp.MLApp();

                matlab.Execute(@"cd D:\functions");

                object result = null;

                matlab.Feval("DemoDecisionTree_2", 1, out result, Double.Parse(user.Rank.RankID.ToString()), Double.Parse(user.Role.RoleId.ToString()), Double.Parse((DateTime.Now.Month - DateTime.Parse(user.RegisteredDate).Month).ToString()));

                object[] res = result as object[];


                String temp = Convert.ToString(res[0]);
                popularWidget = temp.Substring(1);
                user.FirstTimeRecommendedWidget = "1 2 3 4 5 6 7 8 9";

                Assert.IsNotEmpty(popularWidget);
                Assert.AreEqual(1, popularWidget.Split().Length);

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
                    for (int i = 1; i < length + 1; i++)
                    {
                        if (widgetCount[i] > widgetCount[highestTemp])
                        {
                            highestTemp = i;
                        }
                    }

                    popularWidget = highestTemp.ToString();

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

                Assert.IsNotEmpty(popularWidget);
                Assert.AreEqual(9, popularWidget.Split().Length);
            }
        }

        // This is an integration testing, test if a dashboard list is returned or not in form of a string
        [Test]
        public void GetDashboard()
        {
            String username = "client";
            int id = WebSecurity.GetUserId(username);
            var dashboards = db.Dashboards.Where(s => s.RegularUser.ID == id);
            String list = "";

            foreach (var d in dashboards)
            {
                list += d.DashboardName + "," + d.DashboardId + ";";
            }

            Assert.IsNotEmpty(list);

        }

        // Test if the attribute name matchs the result expectation for example: attribute name at index 0 is ProductId
        [Test]
        public void GetAttributes()
        {
            string database = "finance";
            string table = "products";
            List<string> attributeName = new List<string>();
            MySqlConnection conn = new MySqlConnection("server=localhost; port=3306;database=" + database + ";user=root;password=lovingyou;");
            conn.Open();
            MySqlCommand cmd = new MySqlCommand("SELECT COLUMN_NAME FROM INFORMATION_SCHEMA.COLUMNS WHERE TABLE_SCHEMA='" + database + "'  AND `TABLE_NAME`='" + table + "';");
            cmd.Connection = conn;

            MySqlDataReader reader = cmd.ExecuteReader();
            while (reader.Read())
            {
                attributeName.Add(reader.GetString(0));
            }
            conn.Close();

            Assert.AreEqual("ProductId", attributeName[0]);
            Assert.AreEqual("SupplierID", attributeName[1]);
            Assert.AreEqual("Stocklevel", attributeName[2]);
            Assert.AreEqual("UnitPrice", attributeName[3]);

        }

        // Test if it can retreive a list of table for a specific database, in that case there is no table's name in the result
        [Test]
        public void GetTables()
        {
            string database = "engineering";
            List<string> tableName = new List<string>();
            MySqlConnection conn = new MySqlConnection("server=localhost; port=3306;database=" + database + ";user=root;password=lovingyou;");
            conn.Open();
            MySqlCommand cmd = new MySqlCommand("SELECT TABLE_NAME FROM INFORMATION_SCHEMA.TABLES WHERE TABLE_TYPE = 'BASE TABLE' AND TABLE_SCHEMA='" + database + "' ");
            cmd.Connection = conn;

            MySqlDataReader reader = cmd.ExecuteReader();

            while (reader.Read())
            {
                tableName.Add(reader.GetString(0));

            }

            conn.Close();
            Assert.AreEqual(0, tableName.Count);

        }

    }


        
}