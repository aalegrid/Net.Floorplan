using System;
using System.Collections.Generic;
using System.Configuration;
using System.IO;
using System.Linq;
using System.Net.Http;
using System.Threading.Tasks;
using System.Web;
using System.Web.Mvc;
using FP.Models;
using Newtonsoft.Json;

namespace FP.Utilities
{

    public class Helpers
    {
        private readonly LMFloorplanEntities _fpDb = new LMFloorplanEntities();
        //private SpyderwareEntities spdb = new SpyderwareEntities();
        //private  SpiderEntities spiderdb = new SpiderEntities();

        public bool IsLocalhost()
        {

            return HttpContext.Current.Request.ServerVariables["SERVER_NAME"].ToLower().Contains("localhost");

        }

        public List<SelectListItem> GetSelectListOriginatingSystemIdType()
        {
            string[] items = { "INT", "STRING" };
            return items.Select(i => new SelectListItem
            {
                Text = i,
                Value = i
            })
                .ToList();
        }

        public List<SelectListItem> GetSelectListStates()
        {
            //string[] items = { "NSW", "NT", "QUEENSLAND", "SA", "TAS", "VIC", "WA" };

            string[] items = { "WA", "TAS", "NSW", "VIC", "SA", "NT", "QLD" };
            return items.Select(i => new SelectListItem
            {
                Text = i,
                Value = i
            })
                .ToList();
        }

        public List<PropertyType> GetPropertyTypesByContract(long contractId)
        {

            var types = from t in _fpDb.PropertyTypes.ToList()
                        where t.ContractId == contractId
                        orderby t.PropertyTypeName
                        select t;

            return types.ToList();
        }


        public List<Location> GetLocationsByContract(long contractId)
        {

            var locations = from l in _fpDb.Locations.ToList()
                            where l.ContractId == contractId
                            orderby l.Name
                            select l;

            return locations.ToList();
        }

        public List<SelectListItem> GetSelectListFloorplansByOrininatingSystemIdValue(string contractOriginatingSystemIdValue)
        {

            var floorplans = from f in _fpDb.Floorplans.ToList()
                             where f.OriginatingSystemIdValue == contractOriginatingSystemIdValue
                             select new { Value = f.FloorplanId.ToString(), Text = f.Code };

            var emptyItem = new SelectListItem()
            {
                Value = "0",
                Text = "None"
            };

            var list = floorplans.Select(i => new SelectListItem
            {
                Text = i.Text,
                Value = i.Value
            })
                .ToList();

            list.Insert(0, emptyItem);

            return list;
        }

        public List<FloorplanLocation> GetFloorplanLocationsByFloorplanId(long floorplanId)
        {

            var locations = from l in _fpDb.FloorplanLocations.ToList()
                            where l.FloorplanId == floorplanId
                            orderby l.Description
                            select l;

            return locations.ToList();
        }

        public string GetSystemCodeByContractOriginatingSystemIdValue(string contractOriginatingSystemIdValue)
        {

            var contract = (from c in _fpDb.Contracts
                            where c.OriginatingSystemIdValue == contractOriginatingSystemIdValue
                            select c).FirstOrDefault();

            return contract.SystemCode;
        }

        public string GetContractOriginatingSystemIdValueByContractId(long contractId)
        {

            var contract = (from c in _fpDb.Contracts
                            where c.ContractId == contractId
                            select c).FirstOrDefault();

            return contract.OriginatingSystemIdValue;
        }

        public string SaveImage(HttpPostedFileBase image)
        {
            var validImageTypes = new string[] { "image/gif", "image/jpeg", "image/pjpeg", "image/png", "image/svg+xml" };
            string path = "";
            if (image != null && image.ContentLength > 0)
            {
                string fullpath;
                if (!validImageTypes.Contains(image.ContentType))
                {
                    return null;
                }
                var fileName = Path.GetFileName(image.FileName);
                fullpath = Path.Combine(HttpContext.Current.Server.MapPath("/Assets/"), fileName);
                image.SaveAs(fullpath);
                path = "/Assets/" + fileName;
            }
            return path;
        }

        

        //public async Task<Properties.Property> GetPropertyDetails(string domain, string contractId, string propertyId)
        //{
        //    string apiUrl = (domain == "Spider")
        //        ? ConfigurationManager.AppSettings["SpiderServicesUrl"] + "/api/getSpiderProperties?&page=1&pageSize=10&propertyId" + propertyId
        //        : ConfigurationManager.AppSettings["SpyderwareServicesUrl"] + "/api/Spyderware/GetSpyderwareProperties?contractId" + contractId + "&propertyId=" + propertyId;

        //    using (HttpClient client = new HttpClient())
        //    {
        //        client.Timeout = TimeSpan.FromMinutes(30);
        //        client.BaseAddress = new Uri(apiUrl);
        //        client.DefaultRequestHeaders.Accept.Clear();
        //        client.DefaultRequestHeaders.Accept.Add(new System.Net.Http.Headers.MediaTypeWithQualityHeaderValue("application/json"));

        //        try
        //        {
        //            HttpResponseMessage response = await client.GetAsync(apiUrl);
        //            if (response.IsSuccessStatusCode)
        //            {
        //                var data = await response.Content.ReadAsStringAsync();
        //                Properties.Spyderware dataList = JsonConvert.DeserializeObject<Properties.Spyderware>(data);

        //                return dataList.Data.First();

        //            }
        //        }
        //        catch (Exception ex)
        //        {
        //            var msg = ex.Message;
        //        }

        //        return null;
        //    }
        //}

        //public async Task<SpyderwareFloorplanMapping> GetSpyderwareFloorplan(string contractId, string propertyId, string propertyTypeId)
        //{
        //    string apiUrl = ConfigurationManager.AppSettings["SpyderwareServicesUrl"] + "/api/Spyderware/GetSpyderwareFloorplan?contractId" + contractId + "&propertyId=" + propertyId + "&propertyTypeId=" + propertyTypeId;

        //    using (HttpClient client = new HttpClient())
        //    {
        //        client.Timeout = TimeSpan.FromMinutes(30);
        //        client.BaseAddress = new Uri(apiUrl);
        //        client.DefaultRequestHeaders.Accept.Clear();
        //        client.DefaultRequestHeaders.Accept.Add(new System.Net.Http.Headers.MediaTypeWithQualityHeaderValue("application/json"));

        //        try
        //        {
        //            HttpResponseMessage response = await client.GetAsync(apiUrl);
        //            if (response.IsSuccessStatusCode)
        //            {
        //                var data = await response.Content.ReadAsStringAsync();
        //                SpyderwareFloorplanMapping map = JsonConvert.DeserializeObject<SpyderwareFloorplanMapping>(data);

        //                return map;

        //            }
        //        }
        //        catch (Exception ex)
        //        {
        //            var msg = ex.Message;
        //        }

        //        return null;
        //    }
        //}
    }
}