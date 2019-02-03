using System;
using System.Collections.Generic;
using System.Linq;
using System.Net.Http;
using System.Threading.Tasks;
using System.Web;
using System.Web.Mvc;
using FP.Models;
using FP.Utilities;

namespace FP.Controllers
{

    [Authorize]
    public class PropertiesController : Controller
    {

        private readonly LMFloorplanEntities  entities = new LMFloorplanEntities();
        private readonly Helpers _hp = new Helpers();

        // GET: Properties
        public ActionResult Index()
        {
            
            var model = entities.Properties.ToList();
            return View(model);
        }


        public ActionResult Mapping(int id)
        {

            var model = entities.Properties.Find(id);
            ViewBag.Floorplans = entities.Floorplans;
            return View(model);
        }


        public ActionResult View(int id)
        {

            var property = entities.Properties.Find(id);
            var floorplan = entities.Floorplans.Find(property.Floorplan);

            ViewBag.PropertyId = property.PropertyId;
            ViewBag.PropertyNumber = property.PropertyNumber;
            ViewBag.Address = property.Address;
            ViewBag.State = property.State;
            ViewBag.Suburb = property.Suburb;

            floorplan.FloorplanLocations.Clear();
            floorplan.FloorplanLocations = _hp.GetFloorplanLocationsByFloorplanId(floorplan.FloorplanId);

            foreach (FloorplanLocation f in floorplan.FloorplanLocations)
            {

                var location = (from l in entities.Locations
                                where l.LocationId == f.LocationId
                                select l).FirstOrDefault();

                if (location != null)
                {
                    f.Location = location;
                }

            }
            return View(floorplan);


        }

    }
}