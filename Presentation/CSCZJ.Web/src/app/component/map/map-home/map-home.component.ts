import { Component, OnInit } from '@angular/core';
import { MapService } from '../../../services/map/mapService';
import { LayoutService } from "../../../services/layoutService";
import { property_map } from "../../../viewModels/Properties/property_map";
import { PropertyService } from '../../../services/propertyService';
import {MapListResponse} from '../../../viewModels/Response/MapListResponse';
import { DH_UNABLE_TO_CHECK_GENERATOR } from 'constants';
import { Property } from "../../../viewModels/Properties/property";

declare var L:any;

@Component({
    selector: 'app-map-home',
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

    constructor(private mapService: MapService, private layoutService: LayoutService,private propertyService:PropertyService) {
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

            zoomControl.setPosition("topright");

            // iconLayersControl.addTo(map);

            // mapService.setMapAttribute(map);


            var markers = new L.MarkerClusterGroup({
                spiderfyOnMaxZoom: false,
                showCoverageOnHover: false,
                zoomToBoundsOnClick: false                
            });  

            that.getMapProperties(markers);
            that.map.addLayer(markers);     

            //点击获取单个资产信息
            markers.on('click', function (a) {
                that.properties.forEach(element => {
                  if(a.latlng.lat==element.x&&a.latlng.lng==element.y){
                     
                      that.propertyService.getPropertyById(element.id).subscribe(property=>{
                        console.log(property);
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
    panTo(): any {

        this.map.panTo({ lon: 118.8656, lat: 28.9718 });

    }
    showLngLat(): any {

        console.log(this.map.getCenter());

    }

    getMapProperties(markers): void {
        var house = L.icon({
            iconUrl: '../../assets/js/MarkerClusterGroup/house.png',
            iconAnchor: [12, 12],
        });
        var land = L.icon({
            iconUrl: '../../assets/js/MarkerClusterGroup/land.png',
            iconAnchor: [12, 12],
        });
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
                         icon:house
                     },{propertyid:element.id}).bindTooltip(element.name,{permanent:true,direction:"top",offset:[0,-15]});                      
                     markers.addLayer(m);
                   }

                   else{
                    var m = new L.marker(new L.LatLng (element.x,element.y),{
                        icon:land
                    }).bindTooltip(element.name,{permanent:true,direction:"top",offset:[0,-15]});                           
                    markers.addLayer(m);

                   }
                        
                    });    
                }
            });      
             
           

    }

}
