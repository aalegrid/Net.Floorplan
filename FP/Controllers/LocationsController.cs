using FP.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;

namespace FP.Controllers
{
    [Authorize]
    public class LocationsController : Controller
    {

        private readonly LMFloorplanEntities entities = new LMFloorplanEntities();
        // GET: Locations
        public ActionResult Index()
        {
            var model = entities.Locations.ToList();
            return View(model);
        }

        public ActionResult Edit(int id = 0)
        {
            ViewBag.Contracts = new SelectList(entities.Contracts, "ContractId", "Code");
            var model = new Location();
            if (id > 0)              
            {
                model = entities.Locations.Find(id);
            }
            return View(model);
        }
    }
}