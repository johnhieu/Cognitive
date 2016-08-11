using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace CognitiveDecisionSystem.Models
{
    public class Record
    {
        public int RecordID { get; set; }
        public int ScreenWidth { get; set; }
        public int ScreenLength { get; set; }
        public int CoordX { get; set; }
        public int CoordY { get; set; }
        public bool Clicked { get; set; }
        public double TimeStamp { get; set; }
        public int FPS { get; set; }

        public virtual Session Session { get; set; }
        public virtual Widget Widget { get; set; }
    }
}