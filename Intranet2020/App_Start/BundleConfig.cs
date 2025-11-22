using System.Web;
using System.Web.Optimization;

namespace Intranet2020
{
    public class BundleConfig
    {
        // Para obtener más información sobre las uniones, visite https://go.microsoft.com/fwlink/?LinkId=301862
        public static void RegisterBundles(BundleCollection bundles)
        {
                                          
            bundles.Add(new StyleBundle("~/bundles/styles").Include(
                      "~/Content/vendors/morris.js/morris.css", //Morris Charts CSS
                      "~/Content/vendors/jquery-toggles/css/toggles.css", //Toggles CSS
                      "~/Content/vendors/jquery-toggles/css/themes/toggles-light.css", //Toggles CSS
                      "~/Content/vendors/jquery-toast-plugin/dist/jquery.toast.min.css")); //Toastr CSS

                                                  

            bundles.Add(new StyleBundle("~/bundles/css").Include(
                      "~/Content/dist/css/style.css",
                      "~/Content/Main.css"));


            bundles.Add(new ScriptBundle("~/bundles/js").Include(
                      "~/Content/vendors/jquery/dist/jquery.min.js",
                      "~/Content/vendors/popper.js/dist/umd/popper.min.js",
                      "~/Content/vendors/bootstrap/dist/js/bootstrap.min.js",
                      "~/Content/vendors/jquery.redirect-master/jquery.redirect.js",
                      "~/Content/dist/js/jquery.slimscroll.js",
                      "~/Content/dist/js/dropdown-bootstrap-extended.js",
                      "~/Content/dist/js/feather.min.js",
                      "~/Content/vendors/jquery-toggles/toggles.min.js",
                      "~/Content/vendors/jquery-toast-plugin/dist/jquery.toast.min.js",
                      "~/Content/vendors/waypoints/lib/jquery.waypoints.min.js",
                      "~/Content/vendors/jquery.counterup/jquery.counterup.min.js",
                      "~/Content/vendors/raphael/raphael.min.js",
                      "~/Content/vendors/morris.js/morris.min.js",
                      "~/Content/vendors/easy-pie-chart/dist/jquery.easypiechart.min.js",
                      "~/Content/vendors/apexcharts/dist/apexcharts.min.js",
                      "~/Content/vendors/echarts/dist/echarts-en.min.js"));

            


        }
    }
}
