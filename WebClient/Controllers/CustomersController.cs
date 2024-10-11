using Microsoft.AspNetCore.Mvc;

namespace WebClient.Controllers
{
    public class CustomersController : Controller
    {
        public IActionResult Index()
        {
            return View();
        }
        public IActionResult Add()
        {
            return View();
        }
        public IActionResult Edit()
        {
            return View();
        }
        public IActionResult Details()
        {
            return View();
        }

    }
}
