// import { Component, OnInit ,HostBinding,ViewEncapsulation} from '@angular/core';
// import { slideInDownAnimation } from '../../../animations';
import { Component, OnInit } from '@angular/core';
import { UiTableComponent } from '../../common/ui-table/ui-table.component';
import { LayoutService } from "./../../../services/layoutService";

import { TablePageSize,TableColumn,TableOption } from "../../../viewModels/common/TableOption";
import { PropertyService } from '../../../services/propertyService';

@Component({
  selector: 'app-property-list',
  templateUrl: './property-list.component.html',
  styleUrls: ['./property-list.component.less'],
  // animations: [ slideInDownAnimation ],
  // encapsulation: ViewEncapsulation.None,
})
export class PropertyListComponent implements OnInit {
  // 路由动画会导致Ui显示问题 暂时注释 
  // @HostBinding('@routeAnimation') routeAnimation = true;
  // @HostBinding('style.display')   display = 'block';
  // @HostBinding('style.position')  position = 'absolute';
  private contentHeight:number;
  data:any[];
  tableOption:TableOption;
  private loading:boolean;


  constructor(
    private propertyService:PropertyService,
    private layoutService:LayoutService){      

    this.contentHeight=layoutService.getContentHeight()-70-2;

    this.loading=true;
  }

  ngOnInit() {
    this.tableOption={
      pageSize:{
        pageIndex:1,
        pageSize:15,
        filterCount:0,
        total:0
      },
      columns:[
        {name:"name",title:"资产名称",width:350,left:70,center:false,showSort:true},
        {name:"propertyType",title:"类别",width:100,left:420,center:true,showSort:true},     
        {name:"address",title:"坐落位置",width:300,left:0,center:true,showSort:true},
        {name:"fourToStation",title:"四至情况",width:300,left:0,center:true,showSort:true},
        {name:"governmentName",title:"权属单位",width:300,left:0,center:true,showSort:true},
        {name:"getMode",title:"获取方式",width:150,left:0,center:true,showSort:true},
        {name:"getedDate",title:"取得时间",width:150,left:0,center:true,showSort:true},
        {name:"floor",title:"层数",width:90,left:0,center:true,showSort:true},     
        {name:"propertyId",title:"产权证号",width:150,left:0,center:true,showSort:true},   
        {name:"constructorArea",title:"建筑面积",width:150,left:0,center:true,showSort:true},
        {name:"constructId",title:"房产证",width:400,left:0,center:true,showSort:true},
        // {name:"constructTime",title:"房产证发证时间",width:150,left:0,center:true,showSort:true},
        {name:"landArea",title:"土地面积",width:150,left:0,center:true,showSort:true},
        {name:"landId",title:"土地证",width:400,left:0,center:true,showSort:true},
        // {name:"landTime",title:"土地证发证时间",width:100,left:0,center:true,showSort:true},
        {name:"usedPeople",title:"使用人员",width:300,left:0,center:true,showSort:true},        
        {name:"currentType",title:"使用现状",width:150,left:0,center:true,showSort:true},
        {name:"useType",title:"用途",width:100,left:0,center:true,showSort:true},
        {name:"isAdmission",title:"入账",width:100,left:0,center:true,showSort:true},        
        {name:"isMortgage",title:"抵押",width:100,left:0,center:true,showSort:true}
      ],
      nzScroll:{}
    };

    var fullWidth=370;
    this.tableOption.columns.forEach(element => {
      console.log(fullWidth);
      fullWidth+=element.width;
    });

    this.tableOption.nzScroll={ x:fullWidth+"px"};

    console.log(this.tableOption);
  }

  getAllProperties($event):void{    
    console.log("start");
    this.loading=true;
    this.propertyService.getAllProperties($event)
    .subscribe(response=>{
    var that=this;
    setTimeout(function(){
      that.loading=false;
      if(response.data!=undefined && response.data!=null)
      {
        that.data=response.data;
        that.tableOption.pageSize=response.paging;
      }      
    },200);


    });
  }

}
