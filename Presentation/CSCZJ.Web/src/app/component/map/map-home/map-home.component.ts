import { Component, OnInit } from '@angular/core';
import { MapService } from '../../../services/map/mapService';
import { LayoutService } from "../../../services/layoutService";
import { property_map } from "../../../viewModels/Properties/property_map";
import { PropertyService } from '../../../services/propertyService';
import {MapListResponse} from '../../../viewModels/Response/MapListResponse';

declare var L:any;

@Component({
    selector: 'app-map-home',
    templateUrl: './map-home.component.html',
    styleUrls: ['./map-home.component.less']
})
export class MapHomeComponent implements OnInit {

    map: any;
    mapHeight = 500;
    properties: any;

    constructor(private mapService: MapService, private layoutService: LayoutService,private PropertyService:PropertyService) {
    }


    ngOnInit() {
        var markers = new L.MarkerClusterGroup();  
        
        this.getMapProperties(markers);

        this.mapHeight = this.layoutService.getContentHeight();  //计算除了header footer的高度

        setTimeout(() => {
            var normal = this.mapService.getLayer("vector");
            var satellite = this.mapService.getLayer("img");
            this.map = L.map('map', {
                crs: L.CRS.EPSG4326,
                center: [28.905527517199516, 118.50629210472107],
                zoom: 14
            });

            normal.addTo(this.map);

            L.marker([28.905527517199516, 118.50629210472107], { title: "28.905527517199516, 118.50629210472107" }).addTo(this.map);
            L.marker([28.805527517199516, 118.50629210472107], { title: "28.805527517199516, 118.50629210472107" }).addTo(this.map);
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

            var zoomControl = this.map.zoomControl;

            zoomControl.setPosition("topright");

            // iconLayersControl.addTo(map);

            // mapService.setMapAttribute(map);
        }, 500);

      this.map.addLayer(markers);

         

        

    }
    panTo(): any {

        this.map.panTo({ lon: 118.8656, lat: 28.9718 });

    }
    showLngLat(): any {

        console.log(this.map.getCenter());

    }

    getMapProperties(markers): void {
      
        this.PropertyService.getAllPropertiesInMap()
            .subscribe(response => {
                console.log(response[2]);
                if (response!=null) {
               this.properties = response;
               this.properties.forEach(element => {
               var point = element.location.split(' ');
               var m = new L.Marker(new L.LatLng (point[2].substring(0,point[2].length-1),point[1].substring(6))); 
               markers.addLayer(m);
        });    
                }
                });
              
    }



}
