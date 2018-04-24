using CSCZJ.Web.Framework.Mvc;

namespace CSCZJ.API.Models.Properties
{
    public class SimplePropertyModel: BaseQMEntityModel
    {
        public string Name { get; set; }

        public string GovernmentName { get; set; }
    }
}