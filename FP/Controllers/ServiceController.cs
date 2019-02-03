using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Threading.Tasks;
using System.Web;
using System.Web.Http;
using System.Web.Script.Serialization;
using FP.Models;
using System.Data.Entity;

namespace FP.Controllers
{
    [RoutePrefix("api/Service")]
    public class ServiceController : ApiController
    {
        private readonly LMFloorplanEntities entities = new LMFloorplanEntities();

        [Route("SaveFloorplanMapping")]
        [System.Web.Http.HttpPost]
        public IHttpActionResult SaveFloorplanMapping()
        {

            try
            {

                Property requestData = JsonConvert.DeserializeObject<Property>(SerializeJson(Request.Content));

                var property = (from p in entities.Properties
                                       where p.PropertyId == requestData.PropertyId
                                       select p).FirstOrDefault();

                property.Floorplan = requestData.Floorplan;            

                try
                {
                    entities.Entry(property).State = EntityState.Modified;
                    entities.SaveChanges();
                    return Ok();

                }
                catch (Exception ex)
                {
                    return BadRequest(ex.ToString());
       
                }

            }
            catch (Exception ex)
            {
                return BadRequest(ex.ToString());

            }
        }

        [Route("SaveContract")]
        [System.Web.Http.HttpPost]
        public IHttpActionResult SaveContract()
        {

            try
            {
                
                Contract requestData = JsonConvert.DeserializeObject<Contract>(SerializeJson(Request.Content));

                var contract = (from c in entities.Contracts
                                where c.ContractId == requestData.ContractId
                                select c).FirstOrDefault();

                bool isAdd = contract == null ? true : false;

                if (isAdd)
                {
                    contract = new Contract();
                    contract.DateAdded = DateTime.UtcNow;
                    contract.AddedByUserProfileId = 2000;
                }

                else
                {
                    contract.DateModified = DateTime.UtcNow;
                    contract.ModifiedByUserProfileId = 2000;
                }

                contract.Code = requestData.Code;
                contract.Name = requestData.Name;
                contract.Description = requestData.Description;
                contract.OriginatingSystemIdType = requestData.OriginatingSystemIdType;
                contract.OriginatingSystemIdValue = requestData.OriginatingSystemIdValue;
                contract.SystemCode = requestData.SystemCode;
                contract.DomainValueId = requestData.DomainValueId;

                try
                {
                    if (isAdd)
                    {
                        entities.Contracts.Add(contract);
                    }

                    else
                    {
                        entities.Entry(contract).State = EntityState.Modified;
                    }

                   
                    entities.SaveChanges();
                    return Ok();

                }
                catch (Exception ex)
                {
                    return BadRequest(ex.ToString());

                }

            }
            catch (Exception ex)
            {
                return BadRequest(ex.ToString());

            }
        }

        [Route("DeleteContract")]
        [System.Web.Http.HttpPost]
        public IHttpActionResult DeleteContract()
        {

            try
            {
               Contract requestData = JsonConvert.DeserializeObject<Contract>(SerializeJson(Request.Content));

                var contract = (from c in entities.Contracts
                                where c.ContractId == requestData.ContractId
                                select c).FirstOrDefault();               

                try
                {
                    entities.Contracts.Remove(contract);
                    entities.SaveChanges();
                    return Ok();

                }
                catch (Exception ex)
                {
                    return BadRequest(ex.ToString());

                }

            }
            catch (Exception ex)
            {
                return BadRequest(ex.ToString());

            }
        }


        [Route("SaveLocation")]
        [System.Web.Http.HttpPost]
        public IHttpActionResult SaveLocation()
        {

            try
            {

                Location requestData = JsonConvert.DeserializeObject<Location>(SerializeJson(Request.Content));

                var location = (from l in entities.Locations
                                where l.LocationId == requestData.LocationId
                                select l).FirstOrDefault();

                bool isAdd = location == null ? true : false;

                if (isAdd)
                {
                    location = new Location();
                    location.DateAdded = DateTime.UtcNow;
                    location.AddedByUserProfileId = 2000;
                }

                else
                {
                    location.DateModified = DateTime.UtcNow;
                    location.ModifiedByUserProfileId = 2000;
                }

                location.Code = requestData.Code;
                location.Name = requestData.Name;
                location.Description = requestData.Description;
                location.OriginatingSystemIdType = requestData.OriginatingSystemIdType;
                location.OriginatingSystemIdValue = requestData.OriginatingSystemIdValue;
                location.ContractId = requestData.ContractId;

                try
                {
                    if (isAdd)
                    {
                        entities.Locations.Add(location);
                    }

                    else
                    {
                        entities.Entry(location).State = EntityState.Modified;
                    }


                    entities.SaveChanges();
                    return Ok();

                }
                catch (Exception ex)
                {
                    return BadRequest(ex.ToString());

                }

            }
            catch (Exception ex)
            {
                return BadRequest(ex.ToString());

            }
        }

        [Route("DeleteLocation")]
        [System.Web.Http.HttpPost]
        public IHttpActionResult DeleteLocation()
        {

            try
            {
                Location requestData = JsonConvert.DeserializeObject<Location>(SerializeJson(Request.Content));

                var location = (from l in entities.Locations
                                where l.LocationId == requestData.LocationId
                                select l).FirstOrDefault();

                try
                {
                    entities.Locations.Remove(location);
                    entities.SaveChanges();
                    return Ok();

                }
                catch (Exception ex)
                {
                    return BadRequest(ex.ToString());

                }

            }
            catch (Exception ex)
            {
                return BadRequest(ex.ToString());

            }
        }


        private string SerializeJson(HttpContent requestContent)
        {
            string stringValues = requestContent.ReadAsStringAsync().Result;

            var dict = HttpUtility.ParseQueryString(stringValues);
            var jsonContent = new JavaScriptSerializer().Serialize(
                dict.AllKeys.ToDictionary(k => k, k => dict[k])
            );

            return jsonContent;
        }
    }
}
