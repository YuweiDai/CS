import { Component, OnInit,ViewEncapsulation } from '@angular/core';
import { MapService } from '../../../services/map/mapService';
import { LayoutService } from "../../../services/layoutService";
import { property_map } from "../../../viewModels/Properties/property_map";
import { PropertyService } from '../../../services/propertyService';
import {MapListResponse} from '../../../viewModels/Response/MapListResponse';
//import { DH_UNABLE_TO_CHECK_GENERATOR } from 'constants';
import { Property } from "../../../viewModels/Properties/property";
import {PropertyNameList} from "../../../viewModels/Properties/propertyName";
import { ActivatedRoute } from '@angular/router';  
import { DOCUMENT } from '@angular/platform-browser';  
import {HighSearchProperty} from '../../../viewModels/Properties/highSearchModel';
import * as HeatmapJS from 'heatmap.js';
//import{ create } from '../../../../../node_modules/_@types_heatmap.js@2.0.35@@types/heatmap.js/index';
declare var L:any;

@Component({
    selector: 'app-map-home',
    encapsulation: ViewEncapsulation.None ,
    templateUrl: './map-home.component.html',   
    styleUrls: ['./map-home.component.less']
    
})
export class MapHomeComponent implements OnInit {
    
    map: any;
    mapHeight = 500;
    properties:any;
    propertyID:number;
    private basicInfo:any[];
    private property:Property;
    private propertyNameList:any;
    search:string;
    inputValue: string;
    private options=[];
    option=[];
    allChecked = false;
    indeterminate = true;
    highSearchProperty = new HighSearchProperty;
    showCollapse=false;
    searchProperties:any[];
    perfectScrollbarConfig:{};
    containerHeight=100;
    visible: boolean;
    switchModel=true;
    house:any;
    land:any;
    markers:any;  

    //热力图格式
    
      heatMapData={
          max:5700,
          data:[]
      }
      heatmapLayer :any;
    
    panels = [
        {
          active    : true,
          name      : 'This is panel header 1',
          disabled  : false
        }
      ];
   
    
    propertyType = [
        { label: '房产', value: 'House', checked: false },
        { label: '土地', value: 'Land', checked: false }
       
      ];
      regionType =[
        { label: '天马镇', value: 'TMZ', checked: false },
        { label: '招贤镇', value: 'ZSZ', checked: false },
        { label: '辉埠镇', value: 'HBZ', checked: false },
        { label: '球川镇', value: 'LQZ', checked: false },
        { label: '宋畈乡', value: 'SBZ', checked: false }

      ];
      area=[
        { label: '50以下', value: 'One', checked: false },
        { label: '50-200', value: 'Two', checked: false },
        { label: '200-500', value: 'Three', checked: false },
        { label: '500-1000', value: 'Four', checked: false },
        { label: '1000以上', value: 'Five', checked: false }
      ];
      currentType=[
        { label: '自用', value: 'ZY', checked: false },
        { label: '出租', value: 'CC', checked: false },
        { label: '闲置', value: 'XZ', checked: false },
        { label: '调配使用', value: 'SYDP', checked: false }
      ];
      propertyRights=[
        { label: '两证齐全', value: 'All', checked: false },
        { label: '有房产证', value: 'isHouse', checked: false },
        { label: '有土地证', value: 'isLand', checked: false },
        { label: '两证全无', value: 'None', checked: false }
      ];


    //输入框模糊搜索
    onInput(value: string): void {
    if(this.inputValue!=""&&this.inputValue!=null){
        this.propertyService.getPropertiesBySearch(value).subscribe(response=>{  
            this.propertyNameList = response;        
            response.forEach(p=>{             
                this.options.push( {id:p.id,value:p.name +" "+p.address}); 
            })               
        });
      this.options.forEach(o=>{

        console.log(o.value);
      })
    }    
    
    else {
        this.options =[];
    }

      };

      
      

    constructor(private mapService: MapService, private layoutService: LayoutService,private propertyService:PropertyService) {
        this.containerHeight=layoutService.getActualScreenSize().height;
        this.containerHeight=layoutService.getContentHeight()-200; 
    }


    ngOnInit() {
    
        this.mapHeight = this.layoutService.getContentHeight();  //计算除了header footer的高度
        var that=this;
        setTimeout(() => {
            var normal = this.mapService.getLayer("vector");
            var satellite = this.mapService.getLayer("img");
            that.map = L.map('map', {
                crs: L.CRS.EPSG4326,
                center: [28.905527517199516, 118.50629210472107],
                zoom: 14
            });

            normal.addTo(that.map);

           
            // var iconLayersControl = new L.Control.IconLayers(
            //     [
            //         {
            //             title: '矢量', // use any string
            //             layer: normal, // any ILayer
            //             icon: 'img/dx.png' // 80x80 icon
            //         },
            //         {
            //             title: '影像',
            //             layer: satellite,
            //             icon: 'img/yx.png'
            //         }
            //     ], {
            //         position: 'bottomleft',
            //         maxLayersInRow: 5
            //     }
            // );

            var zoomControl = that.map.zoomControl;

            zoomControl.setPosition("bottomright");

             //iconLayersControl.addTo(that.map);

            // mapService.setMapAttribute(map);

            that.house = L.icon({
                iconUrl: '../../assets/js/MarkerClusterGroup/house.png',
                iconAnchor: [12, 12],
            });

           that.land = L.icon({
                iconUrl: '../../assets/js/MarkerClusterGroup/land.png',
                iconAnchor: [12, 12],
            });

            that.markers = new L.MarkerClusterGroup({
                spiderfyOnMaxZoom: false,
                showCoverageOnHover: false,
                zoomToBoundsOnClick: false                
            });  

           var cfg = {
               // container: window.document.getElementById('container'),
               "radius": 4,
               "maxOpacity": .6,
               "scaleRadius": true,
               "useLocalExtrema": true,
               latField: 'lat',
               lngField: 'lng',
               valueField: 'count'
              };

            that.getMapProperties(that.markers);
            that.map.addLayer(that.markers);     

           // that.heatmapLayer = new HeatmapOverlay(cfg);
          //  that.heatmapLayer =h337.create(cfg);           
            console.log(this.heatmapLayer);

            //点击获取单个资产信息
           that.markers.on('click', function (a) {
                that.properties.forEach(element => {
                  if(a.latlng.lat==element.x&&a.latlng.lng==element.y){
                     
                      that.propertyService.getPropertyById(element.id).subscribe(property=>{
                        that.property=property;

                        that.basicInfo=[
                          {title:"资产名称",value:that.property.name},
                          {title:"类别",value:that.property.propertyType},
                          {title:"坐落位置",value:that.property.address},
                          {title:"四至情况",value:that.property.fourToStation},
                          {title:"权属单位",value:that.property.governmentName},
                          {title:"获取方式",value:that.property.getMode},
                          {title:"取得时间",value:that.property.getedDate},
                          {title:"层数",value:that.property.floor},
                          {title:"产权证号",value:that.property.propertyId},
                          {title:"建筑面积",value:that.property.constructorArea},
                          {title:"房产证",value:that.property.constructId},
                          {title:"房产证发证时间",value:that.property.constructTime},
                          {title:"土地面积",value:that.property.landArea},
                          {title:"土地证",value:that.property.landId},
                          {title:"土地证发证时间",value:that.property.landTime},
                          {title:"使用人员",value:that.property.usedPeople},
                          {title:"使用现状",value:that.property.currentType},
                          {title:"用途",value:that.property.useType},
                          {title:"入账",value:that.property.isAdmission},
                          {title:"抵押",value:that.property.isMortgage},
                        ];
                  

                         });
                  }
              });

          });           

        }, 500);


             
    }


//选择搜索的单个资产
findThisOne(option):void{

     this.markers.clearLayers();
     this.propertyService.getPropertyById(option.id).subscribe(property=>{
     var response = property;
   
         var points = response.location.split(' ');
         if(response.propertyType=="房屋"){
            
            var m = new L.marker(new L.LatLng (points[2].substring(0,points[2].length-1),points[1].substring(1,points[1].length-1)),{
                 icon:this.house
             }).bindTooltip(response.name,{permanent:true,direction:"top",offset:[0,-15]});                      
            this.markers.addLayer(m);
           }
           else{
            var m = new L.marker(new L.LatLng (points[2].substring(0,points[2].length-1),points[1].substring(1,points[1].length)),{
                icon:this.land
            }).bindTooltip(response.name,{permanent:true,direction:"top",offset:[0,-15]});   
          this.map.setView([points[2].substring(0,points[2].length-1),points[1].substring(1,points[1].length-1)],16);
           this.markers.addLayer(m);
     

         }

     })

};


    panTo(): any {

        this.map.panTo({ lon: 118.8656, lat: 28.9718 });

    }
    showLngLat(): any {

        console.log(this.map.getCenter());

    }
    //获取地图大数据
    getMapProperties(markers): void {
    
        var ps = [];
      
        this.propertyService.getAllPropertiesInMap()
            .subscribe(response => {
                //console.log(response[2]);
                if (response!=null) {
                    this.properties = response;
                    ps=response;
                    this.properties.forEach(element => {
                   if(element.propertyType=="房屋"){
                    var m = new L.marker(new L.LatLng (element.x,element.y),{
                         icon:this.house
                     },{propertyid:element.id}).bindTooltip(element.name,{permanent:true,direction:"top",offset:[0,-15]});                      
                     markers.addLayer(m);
                   }

                   else{
                    var m = new L.marker(new L.LatLng (element.x,element.y),{
                        icon:this.land
                    }).bindTooltip(element.name,{permanent:true,direction:"top",offset:[0,-15]});                           
                    markers.addLayer(m);

                   }

                   var heatPoint = {lat:element.x,lng:element.y,count:element.constructArea};
                   this.heatMapData.data.push(heatPoint);                        
                    });    

               
                }
            });      
                       
    };

    //高级搜索提交
    Submit(): void {
       // this.highSearchProperty=highSearchProperty;
        console.log(this.highSearchProperty);
        this.highSearchProperty.House=false;
        this.highSearchProperty.Land=false;
        this.highSearchProperty.TMZ=false;
        this.highSearchProperty.ZSZ=false;
        this.highSearchProperty.HBZ=false;
        this.highSearchProperty.SBZ=false;
        this.highSearchProperty.ZY=false;
        this.highSearchProperty.CC=false;
        this.highSearchProperty.XZ=false;
        this.highSearchProperty.SYDP=false;
        this.highSearchProperty.All=false;
        this.highSearchProperty.isHouse=false;
        this.highSearchProperty.isLand=false;
        this.highSearchProperty.None=false;
        this.highSearchProperty.One=false;
        this.highSearchProperty.Two=false;
        this.highSearchProperty.Three=false;
        this.highSearchProperty.Four=false;
        this.highSearchProperty.Five=false;

        this.propertyType.forEach(p=>{     
            if(p.checked==true){                         
               
                
              for(var h in this.highSearchProperty){
                  if(h==p.value) this.highSearchProperty[h]=true;
              }

            }
        });

        this.regionType.forEach(p=>{     
            if(p.checked==true){                         
               
                
              for(var h in this.highSearchProperty){
                  if(h==p.value) this.highSearchProperty[h]=true;
              }

            }
        });

        this.area.forEach(p=>{     
            if(p.checked==true){                         
               
                
              for(var h in this.highSearchProperty){
                  if(h==p.value) this.highSearchProperty[h]=true;
              }

            }
        });
        this.currentType.forEach(p=>{     
            if(p.checked==true){                         
               
                
              for(var h in this.highSearchProperty){
                  if(h==p.value) this.highSearchProperty[h]=true;
              }

            }
        });
        this.propertyRights.forEach(p=>{     
            if(p.checked==true){                         
               
                
              for(var h in this.highSearchProperty){
                  if(h==p.value) this.highSearchProperty[h]=true;
              }

            }
        });     

        this.propertyService.getHighSearchProperties(this.highSearchProperty).subscribe(response=>{

            this.showCollapse = true;

            this.searchProperties = response;
            this.markers.clearLayers();

           this.searchProperties.forEach(element => {
           if(element.propertyType=="房屋"){
            var m = new L.marker(new L.LatLng (element.x,element.y),{
                 icon:this.house
             },{propertyid:element.id}).bindTooltip(element.name,{permanent:true,direction:"top",offset:[0,-15]});                      
            this.markers.addLayer(m);
           }

           else{
            var m = new L.marker(new L.LatLng (element.x,element.y),{
                icon:this.land
            }).bindTooltip(element.name,{permanent:true,direction:"top",offset:[0,-15]});                           
           this.markers.addLayer(m);

           }
                
            });    

            this.panels[0].name="共查询到"+this.searchProperties.length +"条记录！";
        })

        this.visible = false;
      
      }
    
    
      Close() {
        this.visible = false;
      }

      Switch(){
        this.switchModel=!this.switchModel;

        if(this.switchModel==false){
            this.markers.clearLayers();
            this.heatmapLayer.setData(this.heatMapData);
            console.log(this.heatmapLayer);
           // this.map.addLayer(this.heatmapLayer);
           // this.heatmapLayer = new HeatmapOverlay(this.cfg);
          //  this.heatmapLayer.setData(this.heatMapData);

        }
        console.log(this.switchModel);
      }




}
