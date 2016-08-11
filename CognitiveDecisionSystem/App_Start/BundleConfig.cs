using System.Web;
using System.Web.Optimization;

namespace CognitiveDecisionSystem
{
    public class BundleConfig
    {
        // For more information on Bundling, visit http://go.microsoft.com/fwlink/?LinkId=254725
        public static void RegisterBundles(BundleCollection bundles)
        {
            bundles.Add(new ScriptBundle("~/bundles/jquery").Include(
                        "~/Scripts/jquery-{version}.js"));

            bundles.Add(new ScriptBundle("~/bundles/jqueryui").Include(
                        "~/Scripts/jquery-ui-{version}.js"));

            bundles.Add(new ScriptBundle("~/bundles/jqueryval").Include(
                        "~/Scripts/jquery.unobtrusive*",
                        "~/Scripts/jquery.validate*"));

            // Use the development version of Modernizr to develop with and learn from. Then, when you're
            // ready for production, use the build tool at http://modernizr.com to pick only the tests you need.
            bundles.Add(new ScriptBundle("~/bundles/modernizr").Include(
                        "~/Scripts/modernizr-*"));

            //Bootstrap bundles and jquery
            bundles.Add(new StyleBundle("~/bundles/bootstrap").Include(
                        "~/Content/bootstrap.css"));
            bundles.Add(new ScriptBundle("~/bundles/bootstrap-jquery").Include(
                        "~/Scripts/bootstrap.js"));

            //Homepage stylesheet
            bundles.Add(new StyleBundle("~/bundles/homepage").Include(
                        "~/Content/homepage.css"));
            //Index SystemController Stylesheet
            bundles.Add(new StyleBundle("~/bundles/login").Include(
                        "~/Content/login.css"));
            //Register stylesheet
            bundles.Add(new StyleBundle("~/bundles/register").Include(
                        "~/Content/register.css"));
            //Login Partial stylesheet
            bundles.Add(new StyleBundle("~/bundles/partial").Include(
                       "~/Content/partial.css"));

            //Dashboard stylesheet
            bundles.Add(new StyleBundle("~/bundles/dashboard").Include(
                        "~/Content/dashboard-outline.css"));

            // Mouse movement record script
            bundles.Add(new ScriptBundle("~/bundles/mouse-record").Include(
                    "~/Scripts/Mouse tracking/json2.js",
                    "~/Scripts/Mouse tracking/selector.js",
                    "~/Scripts/Mouse tracking/sizzle.js",
                    "~/Scripts/Mouse tracking/smt-aux.js",
                    "~/Scripts/Mouse tracking/smt-record.js"
             ));

            // Mouse movement replay script
            bundles.Add(new ScriptBundle("~/bundles/mouse-replay").Include(
                    "~/Scripts/core/js/src/json2.js",
                    "~/Scripts/core/js/src/selector.js",
                    "~/Scripts/core/js/src/sizzle.js",
                    "~/Scripts/core/js/src/smt-aux.js",
                    "~/Scripts/core/js/src/smt-replay",
                    "~/Scripts/core/js/src/wz_jsgraphics.js"
                ));

            bundles.Add(new StyleBundle("~/Content/css").Include("~/Content/site.css"));


            bundles.Add(new StyleBundle("~/Content/themes/base/css").Include(
                        "~/Content/themes/base/jquery.ui.core.css",
                        "~/Content/themes/base/jquery.ui.resizable.css",
                        "~/Content/themes/base/jquery.ui.selectable.css",
                        "~/Content/themes/base/jquery.ui.accordion.css",
                        "~/Content/themes/base/jquery.ui.autocomplete.css",
                        "~/Content/themes/base/jquery.ui.button.css",
                        "~/Content/themes/base/jquery.ui.dialog.css",
                        "~/Content/themes/base/jquery.ui.slider.css",
                        "~/Content/themes/base/jquery.ui.tabs.css",
                        "~/Content/themes/base/jquery.ui.datepicker.css",
                        "~/Content/themes/base/jquery.ui.progressbar.css",
                        "~/Content/themes/base/jquery.ui.theme.css"));
        }
    }
}