using FP.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using FP.Utilities;
using System.Data.Entity;
using AutoMapper;

namespace FP.Controllers
{
    [Authorize]
    public class FloorplansController : Controller
    {

        private readonly LMFloorplanEntities entities = new LMFloorplanEntities();
        private readonly Helpers _hp = new Helpers();
       

        // GET: Floorplans
        public ActionResult Index()
        {
            
            var model = entities.Floorplans.ToList();
            return View(model);
        }

        [HttpGet]
        public ActionResult GetLocationsByContractId(long contractId)
        {
            var locations = new SelectList(_hp.GetLocationsByContract(contractId), "LocationId", "Name");

            return Json(locations, JsonRequestBehavior.AllowGet);

        }


        [HttpGet]
        public ActionResult GetPropertyTypesByContractId(long contractId)
        {
            var types = new SelectList(_hp.GetPropertyTypesByContract(contractId), "PropertyTypeCode", "PropertyTypeName");

            return Json(types, JsonRequestBehavior.AllowGet);

        }

        [HttpGet]
        public ActionResult GetFloorplanLocationDetailsById(long floorplanLocationId)
        {
            var locationDetails = from loc in entities.FloorplanLocations.ToList()
                                  where loc.FloorplanLocationId == floorplanLocationId
                                  select new
                                  {
                                      FloorplanId = loc.FloorplanId,
                                      FloorplanLocationId = loc.FloorplanLocationId,
                                      Description = loc.Description,
                                      MinX = loc.MinX,
                                      MaxX = loc.MaxX,
                                      MinY = loc.MinY,
                                      MaxY = loc.MaxY

                                  };



            return Json(locationDetails, JsonRequestBehavior.AllowGet);

        }

        //
        // GET: /Floorplans/Details/5

       



        //
        // GET: /Floorplans/Create

        public ActionResult Add()
        {

            ViewBag.ContractId = new SelectList(entities.Contracts, "ContractId", "Code");


            ViewBag.PropertyTypeCode = new SelectList(_hp.GetPropertyTypesByContract(Convert.ToInt64(entities.Contracts.FirstOrDefault().ContractId)), "PropertyTypeCode", "PropertyTypeName");

            return View();
        }

        //
        // POST: /Floorplans/Add

        [HttpPost]
        [ValidateAntiForgeryToken]
        public ActionResult Add(FloorplanDto floorplanDto)
        {
            

            

            Floorplan floorplan = Mapper.Map<Floorplan>(floorplanDto);


            HttpPostedFileBase image = Request.Files["ImageURL"];
            string imagePath = _hp.SaveImage(image);

            if (imagePath == null)
            {
                ModelState.AddModelError("ImageURL", "Please choose either a GIF, JPG or PNG image.");
            }

            if (ModelState.IsValid)
            {

                long tempUser = 2111;
                floorplan.DateAdded = DateTime.UtcNow;
                floorplan.AddedByUserProfileId = tempUser;
                floorplan.OriginatingSystemIdValue = _hp.GetContractOriginatingSystemIdValueByContractId((long)floorplan.ContractId);
                floorplan.ImageURL = !String.IsNullOrEmpty(imagePath) ? imagePath : floorplan.ImageURL;

                try
                {
                    entities.Floorplans.Add(floorplan);
                    entities.SaveChanges();
                    return RedirectToAction("Edit", "Floorplans", new { @id = floorplan.FloorplanId });
                }
                catch (Exception e)
                {
                    ViewBag.Message = "There was an error saving the item. Please try again later.";
                    ViewBag.ShowOrHide = "show";
                    ViewBag.AlertType = "alert-danger";
                }


                //return RedirectToAction("Index");
                //ViewBag.Message = "Item saved successfully";
                //ViewBag.ShowOrHide = "show";
                //ViewBag.AlertType = "alert-info";


            }

            else
            {
                ViewBag.Message = "There was a problem with the form. Please check again.";
                ViewBag.ShowOrHide = "show";
                ViewBag.AlertType = "alert-danger";

            }




            ViewBag.PropertyTypeCode = new SelectList(_hp.GetPropertyTypesByContract(Convert.ToInt64(floorplan.ContractId)), "PropertyTypeCode", "PropertyTypeName", floorplan.PropertyTypeCode);



            ViewBag.ContractId = new SelectList(entities.Contracts, "ContractId", "Code", floorplan.ContractId);
            return View(floorplanDto);
        }

        //
        // GET: /Floorplans/Edit/5

        public ActionResult Edit(long id = 0)
        {


            Models.Floorplan floorplan = entities.Floorplans.Find(id);

            FloorplanDto floorplanDto = Mapper.Map<FloorplanDto>(floorplan);

            if (floorplan == null)
            {
                return HttpNotFound();
            }

            ViewBag.Locations = new SelectList(_hp.GetLocationsByContract((long)floorplanDto.ContractId), "LocationId", "Name");

            //ViewBag.CurrentLocations = hp.GetFloorplanLocationsByFloorplanId(floorplan.FloorplanId);

            ViewBag.CurrentLocations = new SelectList(_hp.GetFloorplanLocationsByFloorplanId(floorplanDto.FloorplanId), "FloorplanLocationId", "Description", floorplanDto.ContractId);

            ViewBag.Contracts = entities.Contracts;

            // new SelectList(_hp.GetPropertyTypesByContract(contractId), "PropertyTypeCode", "PropertyName");
            ViewBag.PropertyTypeCode = new SelectList(_hp.GetPropertyTypesByContract(Convert.ToInt64(floorplanDto.ContractId)), "PropertyTypeCode", "PropertyTypeName", floorplanDto.PropertyTypeCode);
            ViewBag.ContractId = new SelectList(entities.Contracts, "ContractId", "Code", floorplanDto.ContractId);
            return View(floorplanDto);
        }

        //
        // POST: /Floorplans/Edit/5

        [HttpPost]
        [ValidateAntiForgeryToken]
        public ActionResult Edit(FloorplanDto floorplanDto)
        {

            Floorplan floorplan = Mapper.Map<Floorplan>(floorplanDto);

            var defaultContract = entities.Contracts.FirstOrDefault();
            long contractId = defaultContract != null ? defaultContract.ContractId : 0;
            ViewBag.Locations = new SelectList(_hp.GetLocationsByContract(contractId), "LocationId", "Name");


            HttpPostedFileBase image = Request.Files["ImageUpload"];
            string imagePath = _hp.SaveImage(image);

            if (imagePath == null)
            {
                ModelState.AddModelError("ImageURL", "Please choose either a GIF, JPG or PNG image.");
            }

            if (ModelState.IsValid)
            {

                long tempUser = 2111;
                floorplan.DateModified = DateTime.UtcNow;
                floorplan.ModifiedByUserProfileId = tempUser;
                floorplan.ImageURL = !String.IsNullOrEmpty(imagePath) ? imagePath : floorplan.ImageURL;
                floorplan.OriginatingSystemIdValue = _hp.GetContractOriginatingSystemIdValueByContractId((long)floorplan.ContractId);

                try
                {
                    entities.Entry(floorplan).State = EntityState.Modified;
                    entities.SaveChanges();
                    ViewBag.Message = "Item saved successfully";
                    ViewBag.ShowOrHide = "show";
                    ViewBag.AlertType = "alert-info";
                }
                catch (Exception e)
                {
                    ViewBag.Message = "There was an error saving the item. Please try again later.";
                    ViewBag.ShowOrHide = "show";
                    ViewBag.AlertType = "alert-danger";
                }

                // return RedirectToAction("Edit", "Floorplans", new { @id = floorplan.FloorplanId });
            }

            else
            {

                ViewBag.Message = "There was a problem with the form. Please check again.";
                ViewBag.ShowOrHide = "show";
                ViewBag.AlertType = "alert-danger";

            }

            ViewBag.CurrentLocations = new SelectList(_hp.GetFloorplanLocationsByFloorplanId(floorplan.FloorplanId), "FloorplanLocationId", "Description", floorplan.ContractId);
            ViewBag.PropertyTypeCode = new SelectList(_hp.GetPropertyTypesByContract(Convert.ToInt64(floorplan.ContractId)), "PropertyTypeCode", "PropertyTypeName", floorplan.PropertyTypeCode);

            ViewBag.ContractId = new SelectList(entities.Contracts, "ContractId", "Code", floorplan.ContractId);
            return View(floorplanDto);
        }

        //
        // GET: /Floorplans/Delete/5

        public ActionResult Delete(long id = 0)
        {
            Models.Floorplan floorplan = entities.Floorplans.Find(id);

            if (id == 0)
            {
                ViewBag.Message = "Deleted";
                return View();
            }

            if (floorplan == null)
            {
                return HttpNotFound();
            }
            return View(floorplan);
        }

        // POST: /Floorplans/Delete/5

        [HttpPost, ActionName("Delete")]
        [ValidateAntiForgeryToken]
        public ActionResult DeleteConfirmed(long id)
        {
            Models.Floorplan floorplan = entities.Floorplans.Find(id);

            try
            {
                entities.Floorplans.Remove(floorplan);
                entities.SaveChanges();
            }
            catch (Exception e)
            {
                ViewBag.Message = "There was an error deleting the item. Please try again later.";
                ViewBag.ShowOrHide = "show";
                ViewBag.AlertType = "alert-danger";
                return RedirectToAction("Edit", "Floorplans", new { @id = id, error = "delete_FP" });
            }


            return RedirectToAction("Index", "Floorplans");
        }


        // This is UNUSED
        [HttpPost, ActionName("SaveLocation")]
        [ValidateAntiForgeryToken]
        public ActionResult SaveFloorplanLocation(string saveMode, string floorplanId, string minx, string maxx, string miny, string maxy, string locationId, string description, long floorplanLocationId = 0)
        {
            long tempUser = 2111;


            if (saveMode == "Save")
            {
                //Location location = db.Locations.Find(id);

                FloorplanLocation fl = entities.FloorplanLocations.Find(floorplanLocationId);

                fl.DateModified = DateTime.UtcNow;
                fl.ModifiedByUserProfileId = tempUser;
                fl.Description = description;
                fl.MinX = minx;
                fl.MaxX = maxx;
                fl.MinY = miny;
                fl.MaxY = maxy;


                try
                {
                    entities.Entry(fl).State = EntityState.Modified;
                    entities.SaveChanges();
                    return RedirectToAction("Edit", "Floorplans", new { @id = floorplanId });
                }
                catch (Exception e)
                {
                    ViewBag.Message = "There was an error saving the item. Please try again later.";
                    ViewBag.ShowOrHide = "show";
                    ViewBag.AlertType = "alert-danger";
                    return RedirectToAction("Edit", "Floorplans", new { @id = floorplanId, error = "save_LOC" });
                }

            }

            else
            {
                FloorplanLocation fl = new FloorplanLocation();

                fl.DateAdded = DateTime.UtcNow;
                fl.AddedByUserProfileId = tempUser;
                fl.Description = description;
                fl.MinX = minx;
                fl.MaxX = maxx;
                fl.MinY = miny;
                fl.MaxY = maxy;
                fl.FloorplanId = Convert.ToInt64(floorplanId);
                fl.LocationId = Convert.ToInt64(locationId);

                try
                {
                    entities.FloorplanLocations.Add(fl);
                    entities.SaveChanges();
                    return RedirectToAction("Edit", "Floorplans", new { @id = floorplanId });
                }
                catch (Exception e)
                {
                    ViewBag.Message = "There was an error saving the item. Please try again later.";
                    ViewBag.ShowOrHide = "show";
                    ViewBag.AlertType = "alert-danger";
                    return RedirectToAction("Edit", "Floorplans", new { @id = floorplanId, error = "save_LOC" });
                }
            }


        }



        [HttpGet]
        public ActionResult AjaxSaveLocation(string saveMode, string floorplanId, string minx, string maxx, string miny, string maxy, string locationId, string description, long floorplanLocationId = 0)
        {
            long tempUser = 2111;

            FloorplanLocation fl = new FloorplanLocation();

            if (saveMode == "Save")
            {
                //Location location = db.Locations.Find(id);

                fl = entities.FloorplanLocations.Find(floorplanLocationId);

                fl.DateModified = DateTime.UtcNow;
                fl.ModifiedByUserProfileId = tempUser;
                fl.Description = description;
                fl.MinX = minx;
                fl.MaxX = maxx;
                fl.MinY = miny;
                fl.MaxY = maxy;

                try
                {
                    entities.Entry(fl).State = EntityState.Modified;
                    entities.SaveChanges();

                }
                catch (Exception e)
                {
                    return Json(new
                    {
                        error = e.Message
                    }, JsonRequestBehavior.AllowGet);
                }

            }

            else
            {

                fl.DateAdded = DateTime.UtcNow;
                fl.AddedByUserProfileId = tempUser;
                fl.Description = description;
                fl.MinX = minx;
                fl.MaxX = maxx;
                fl.MinY = miny;
                fl.MaxY = maxy;
                fl.LocationId = Convert.ToInt64(locationId);
                fl.FloorplanId = Convert.ToInt64(floorplanId);

                try
                {
                    entities.FloorplanLocations.Add(fl);
                    entities.SaveChanges();

                }
                catch (Exception e)
                {
                    return Json(new
                    {
                        error = e.Message
                    }, JsonRequestBehavior.AllowGet);
                }
            }

            return Json(new
            {
                error = "",
                data = Json(new
                {
                    fl.FloorplanLocationId,
                    fl.Description,
                    fl.FloorplanId,
                    fl.LocationId,
                    fl.MinX,
                    fl.MaxX,
                    fl.MinY,
                    fl.MaxY

                })
            }, JsonRequestBehavior.AllowGet);





        }

        [HttpGet]
        public ActionResult AjaxDeleteLocation(long floorplanLocationId)
        {

            FloorplanLocation fl = entities.FloorplanLocations.Find(floorplanLocationId);

            try
            {
                entities.FloorplanLocations.Remove(fl);
                entities.SaveChanges();
            }
            catch (Exception e)
            {
                return Json(new
                {
                    error = e.Message
                }, JsonRequestBehavior.AllowGet);
            }


            return Json(new
            {
                error = ""
            }, JsonRequestBehavior.AllowGet);


        }



        protected override void Dispose(bool disposing)
        {
            entities.Dispose();
            base.Dispose(disposing);
        }


      }
}