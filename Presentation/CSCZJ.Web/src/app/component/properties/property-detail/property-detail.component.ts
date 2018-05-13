import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';

import { Property } from "../../../viewModels/Properties/property";

import { MapService } from '../../../services/map/mapService';
import { PropertyService } from '../../../services/propertyService';
declare var L:any;
@Component({
  selector: 'app-property-detail',
  templateUrl: './property-detail.component.html',
  styleUrls: ['./property-detail.component.less']
})
export class PropertyDetailComponent implements OnInit {

  private loading:boolean;
  private property:Property;
  private basicInfo:any[];
  private filesInfo:any[];
  private map:any;

  constructor(    
    private propertyService:PropertyService,private mapService:MapService,
    private route: ActivatedRoute) 
    { 
      this.property=new Property();
  }

  ngOnInit() {
    this.getProperty();
  }

  getProperty():void{
    this.loading=true;
    const id = +this.route.snapshot.paramMap.get('id');
    
    this.propertyService.getPropertyById(id).subscribe(property=>{
      this.property=property;
      console.log(this.property);
      this.basicInfo=[
        {title:"资产名称",value:this.property.name},
        {title:"类别",value:this.property.propertyType},
        {title:"坐落位置",value:this.property.address},
        {title:"四至情况",value:this.property.fourToStation},
        {title:"权属单位",value:this.property.governmentName},
        {title:"获取方式",value:this.property.getMode},
        {title:"取得时间",value:this.property.getedDate},
        {title:"层数",value:this.property.floor},
        {title:"产权证号",value:this.property.propertyId},
        {title:"建筑面积",value:this.property.constructorArea},
        {title:"房产证",value:this.property.constructId},
        {title:"房产证发证时间",value:this.property.constructTime},
        {title:"土地面积",value:this.property.landArea},
        {title:"土地证",value:this.property.landId},
        {title:"土地证发证时间",value:this.property.landTime},
        {title:"使用人员",value:this.property.usedPeople},
        {title:"使用现状",value:this.property.currentType},
        {title:"用途",value:this.property.useType},
        {title:"入账",value:this.property.isAdmission},
        {title:"抵押",value:this.property.isMortgage},
      ];

      this.filesInfo=[];


      this.loading=false;
    });

    
  }

  mapStepInitial():void
  {
    var that=this;
    setTimeout(() => {
      var normal = this.mapService.getLayer("vector");
      var satellite = this.mapService.getLayer("img");
      this.map = L.map('map', {
          crs:L.CRS.EPSG4326,
          center: [28.905527517199516, 118.50629210472107],
          zoom: 17
      });
  
      satellite.addTo(this.map);
      var baseLayers = {
        "矢量": normal,
        "卫星": satellite
    };
      // L.control.layers(baseLayers).addTo(that.map);
    var zoomControl = this.map.zoomControl;

    zoomControl.setPosition("topright");

    if(that.property!=null && that.property!=undefined)
    {
    //   var m = new L.marker(new L.LatLng (element.x,element.y),{
    //     icon:land
    // }).bindTooltip(element.name,{permanent:true,direction:"top",offset:[0,-15]});                           
    
      L.marker([28.922364246100187,118.47742885351181],{title:that.property.name})
      .bindTooltip(that.property.name,{permanent:true,direction:"top",offset:[0,-15]})
      .addTo(this.map);


      // that.map.panTo([28.922364246100187,118.47742885351181]);
    }
    }, 500); 
  }

}
