using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Web;

namespace FP.Models
{
    public class FloorplanDto
    {

        public long FloorplanId { get; set; }
        [Required]
        public string Code { get; set; }
        [Required]
        public string Name { get; set; }
        [Required]
        public string Description { get; set; }
        public string ImageURL { get; set; }
        public Nullable<System.DateTime> DateAdded { get; set; }
        public Nullable<System.DateTime> DateModified { get; set; }
        public Nullable<long> AddedByUserProfileId { get; set; }
        public Nullable<long> ModifiedByUserProfileId { get; set; }
        public Nullable<long> ContractId { get; set; }
        public string OriginatingSystemIdValue { get; set; }
        [Required]
        public string PropertyTypeCode { get; set; }

        public virtual Contract Contract { get; set; }
        [System.Diagnostics.CodeAnalysis.SuppressMessage("Microsoft.Usage", "CA2227:CollectionPropertiesShouldBeReadOnly")]
        public virtual ICollection<FloorplanLocation> FloorplanLocations { get; set; }
    }
}