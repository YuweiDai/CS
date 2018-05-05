import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';

import { Property } from "../../../viewModels/Properties/property";
import { PropertyService } from '../../../services/propertyService';

@Component({
  selector: 'app-property-detail',
  templateUrl: './property-detail.component.html',
  styleUrls: ['./property-detail.component.less']
})
export class PropertyDetailComponent implements OnInit {

  private loading:boolean;
  private property:Property;
  private basicInfo:any[];

  constructor(    
    private propertyService:PropertyService,
    private route: ActivatedRoute) 
    { 
  }

  ngOnInit() {
    this.getProperty();
  }

  getProperty():void{
    this.loading=true;
    const id = +this.route.snapshot.paramMap.get('id');
    
    this.propertyService.getPropertyById(id).subscribe(property=>{
      this.property=property;

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


      this.loading=false;
    });

    console.log(this.property);
  }

}
