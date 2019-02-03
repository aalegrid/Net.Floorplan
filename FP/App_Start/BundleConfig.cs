using System.Web;
using System.Web.Optimization;

namespace FP
{
    public class BundleConfig
    {
        // For more information on bundling, visit https://go.microsoft.com/fwlink/?LinkId=301862
        public static void RegisterBundles(BundleCollection bundles)
        {
            bundles.Add(new ScriptBundle("~/bundles/jquery").Include(
                        "~/Scripts/jquery-{version}.js"));

            bundles.Add(new ScriptBundle("~/bundles/jqueryval").Include(
                        "~/Scripts/jquery.validate*"));

            // Use the development version of Modernizr to develop with and learn from. Then, when you're
            // ready for production, use the build tool at https://modernizr.com to pick only the tests you need.
            bundles.Add(new ScriptBundle("~/bundles/modernizr").Include(
                        "~/Scripts/modernizr-*"));

            bundles.Add(new ScriptBundle("~/bundles/site").Include(
            "~/Scripts/site.js"));

            bundles.Add(new ScriptBundle("~/bundles/bootstrap").Include(
                      "~/Scripts/bootstrap.js"));

            bundles.Add(new ScriptBundle("~/bundles/underscore").Include(
                "~/Scripts/underscore.min.js"));

            bundles.Add(new ScriptBundle("~/bundles/qtip").Include(
                "~/Scripts/jquery.qtip.min.js"));

            bundles.Add(new ScriptBundle("~/bundles/maphilight").Include(
                "~/Scripts/jquery.maphilight.min.js"));

            bundles.Add(new ScriptBundle("~/bundles/imageMapResizer").Include(
                "~/Scripts/imageMapResizer.min.js"));

            bundles.Add(new ScriptBundle("~/bundles/moment").Include(
                "~/Scripts/moment.min.js"));


            bundles.Add(new ScriptBundle("~/bundles/cookie").Include(
                "~/Scripts/js.cookie.js"));


            bundles.Add(new StyleBundle("~/Content/css").Include(
                      "~/Content/bootstrap.css",
                      "~/Content/site.css"));

            bundles.Add(new StyleBundle("~/Content/qtip").Include("~/Content/jquery.qtip.min.css"));
        }
    }
}
