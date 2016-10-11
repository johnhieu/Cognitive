using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using System.Web.Routing;

namespace CognitiveDecisionSystem
{
    public class RouteConfig
    {
        public static void RegisterRoutes(RouteCollection routes)
        {
            routes.IgnoreRoute("{resource}.axd/{*pathInfo}");

            // Specify Route for controller class
            routes.MapRoute(
                name: "Default",
                url: "{controller}/{action}/{id}",
                defaults: new { controller = "RegularUser", action = "Login", id = UrlParameter.Optional }
            );

            routes.MapRoute(
            "Users",                                              
            "{controller}/{action}/{username}/{password}",                          
            new { controller = "User", action = "Login", username = "", password = "" }  
        );
        }
    }
}