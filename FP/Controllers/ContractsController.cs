using FP.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;

namespace FP.Controllers
{
    [Authorize]
    public class ContractsController : Controller
    {

        private readonly LMFloorplanEntities entities = new LMFloorplanEntities();
        // GET: Contracts
        public ActionResult Index()
        {
            var model = entities.Contracts.ToList();
            return View(model);
        }

        public ActionResult Edit(int id = 0)
        {
            var model = new Contract();
            if (id > 0)              
            {
                model = entities.Contracts.Find(id);
            }
            return View(model);
        }
    }
}