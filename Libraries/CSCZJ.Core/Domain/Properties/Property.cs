﻿using System;
using System.Collections;
using System.Collections.Generic;
using System.Data.Entity.Spatial;

namespace CSCZJ.Core.Domain.Properties
{
    public class Property : BaseEntity
    {
        public Property()
        {
        }

        private ICollection<PropertyAllot> _propertyAllots;
        private ICollection<PropertyLend> _propertyLends;
        private ICollection<PropertyRent> _propertyRents;
        private ICollection<PropertyEdit> _propertyEdits;
        private ICollection<PropertyPicture> _propertyPictures;
        private ICollection<PropertyFile> _propertyFiles;

        /// <summary>
        /// 资产名称
        /// </summary>
        public string Name { get; set; }

        /// <summary>
        /// 资产类别
        /// </summary>
        public PropertyType PropertyType { get; set; }

        /// <summary>
        /// 资产所处区域
        /// </summary>
        public Region Region { get; set; }

        /// <summary>
        /// 获取方式
        /// </summary>
        public GetMode GetMode { get; set; }

        /// <summary>
        /// 地址
        /// </summary>
        public string Address { get; set; }

        /// <summary>
        /// 层数
        /// </summary>
        public int Floor { get; set; }

        /// <summary>
        /// 产权证号
        /// </summary>
        public string PropertyID { get; set; }
     
        /// <summary>
        /// 是否入账
        /// </summary>
        public bool IsAdmission { get; set; }

        /// <summary>
        /// 取得时间
        /// </summary>
        public DateTime? GetedDate { get; set; }

        /// <summary>
        /// 使用方
        /// </summary>
        public string UsedPeople { get; set; }
    
        /// <summary>
        /// 坐落位置
        /// </summary>
        public DbGeography Location { get; set; }

        public double X { get; set; }

        public double Y { get; set; }

        /// <summary>
        /// 范围，房产不需要
        /// </summary>
        public DbGeography Extent { get; set; }

        /// <summary>
        /// 描述
        /// </summary>
        public string Description { get; set; }

        /// <summary>
        /// 四至情况
        /// </summary>
        public string FourToStation { get; set; }

        /// <summary>
        /// 发布状态
        /// </summary>
        public bool Published { get; set; }

        public int DisplayOrder { get; set; }

        /// <summary>
        /// 资产所有方
        /// </summary>
        public virtual GovernmentUnit Government { get; set; }

        /// <summary>
        /// 不动产证
        /// </summary>
        public string EstateId { get; set; }

        /// <summary>
        /// 不动产证发证时间
        /// </summary>
        public DateTime? EstateTime { get; set; }

        /// <summary>
        /// 房产证
        /// </summary>
        public string ConstructId { get; set; }

        /// <summary>
        /// 建筑面积
        /// </summary>
        public double ConstructArea { get; set; }

        /// <summary>
        /// 房产证发证时间
        /// </summary>
        public DateTime? ConstructTime { get; set; }

        /// <summary>
        /// 土地证号
        /// </summary>
        public string LandId { get; set;}

        /// <summary>
        /// 土地面积
        /// </summary>
        public double LandArea { get; set; }

        public DateTime? LandTime { get; set; }

        /// <summary>
        /// 使用现状
        /// </summary>
        public CurrentType CurrentType { get; set; }
        /// <summary>
        /// 用途
        /// </summary>
        public UseType UseType { get; set; }
        /// <summary>
        /// 是否抵押
        /// </summary>
        public bool IsMortgage { get; set; }

        public virtual PropertyNewCreate PropertyNewCreate { get; set; }

        public virtual ICollection<PropertyAllot> Allots
        {
            get { return _propertyAllots ?? (_propertyAllots = new List<PropertyAllot>()); }
            protected set { _propertyAllots = value; }
        }
        public virtual ICollection<PropertyLend> Lends
        {
            get { return _propertyLends ?? (_propertyLends = new List<PropertyLend>()); }
            protected set { _propertyLends = value; }
        }
        public virtual ICollection<PropertyRent> Rents
        {
            get { return _propertyRents ?? (_propertyRents = new List<PropertyRent>()); }
            protected set { _propertyRents = value; }
        }

        public virtual ICollection<PropertyEdit> Edits
        {
            get { return _propertyEdits ?? (_propertyEdits = new List<PropertyEdit>()); }
            protected set { _propertyEdits = value; }
        }

        public virtual PropertyOff PropertyOff { get; set; }

        /// <summary>
        /// 
        /// </summary>
        public bool Locked { get; set; }

        /// <summary>
        /// 是否核销
        /// </summary>
        public bool Off { get; set; }

        /// <summary>
        /// 是否为Excel导入
        /// </summary>
        public bool FromExcelImport { get; set; }


        /// <summary>
        /// 父级资产Id，默认为0
        /// </summary>
        public int ParentPropertyId { get; set; }

        
        public virtual ICollection<PropertyPicture> Pictures
        {
            get { return _propertyPictures ?? (_propertyPictures = new List<PropertyPicture>()); }
            protected set { _propertyPictures = value; }
        }

        public virtual ICollection<PropertyFile> Files
        {
            get { return _propertyFiles ?? (_propertyFiles = new List<PropertyFile>()); }
            protected set { _propertyFiles = value; }
        }

    }
}
