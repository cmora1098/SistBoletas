using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;

namespace Intranet2020.Controllers
{
    public class HomeController : Controller
    {
        public ActionResult Index(string tk)
        {

            HttpCookie cookie = new HttpCookie("SessionCookie", tk);

            cookie.Expires = DateTime.Now.AddDays(1);
            cookie.Domain = ".agrorural.gob.pe";
            Response.Cookies.Add(cookie);

            
            ViewBag.tk = cookie.Value;

            return View();
        }

        public ActionResult About()
        {
            ViewBag.Message = "Your application description page.";

            return View();
        }

        public ActionResult Contact()
        {
            ViewBag.Message = "Your contact page.";

            return View();
        }
    }
}