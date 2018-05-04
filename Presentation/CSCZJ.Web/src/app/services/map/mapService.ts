import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { ScreenSize } from "../../viewModels/layout/ScreenSize";
import { catchError, map, tap } from 'rxjs/operators';
import { Observable } from 'rxjs';
import { ConfigService } from "../../services/configService";
import { LogService } from "../../services/logService";
import {MapListResponse} from"../../viewModels/Response/MapListResponse";

declare var L:any;

@Injectable()
export class MapService{
    private apiUrl = "";
    constructor(private configService: ConfigService, private http: HttpClient, private logService: LogService){
        this.apiUrl += configService.getApiUrl() + "properties/map";
    }

    //获取指定类型的地图
    getLayer(layerType:string):any{
        var layerGroup=null;

        if(layerType=="img")
        {
            // 国家
            var country= L.tileLayer("http://t{s}.tianditu.cn/img_c/wmts?service=wmts&request=GetTile&version=1.0.0&LAYER=img&tileMatrixSet=c&TileMatrix={z}&TileRow={y}&TileCol={x}&style=default&format=tiles", {
                subdomains: ["0", "1", "2", "3", "4", "5", "6", "7"],
                minZoom:1,
                maxZoom:14,
                zoomOffset :1                
            });
            var countryAnno= L.tileLayer("http://t{s}.tianditu.com/cva_c/wmts?service=wmts&request=GetTile&version=1.0.0&LAYER=cva&tileMatrixSet=c&TileMatrix={z}&TileRow={y}&TileCol={x}&style=default&format=tiles", {
                subdomains: ["0", "1", "2", "3", "4", "5", "6", "7"],
                minZoom:1,
                maxZoom:14,
                zoomOffset :1  
            });            
            // 省级
            var province=L.tileLayer("http://srv{s}.zjditu.cn/ZJDOM_2D/wmts?service=wmts&request=GetTile&version=1.0.0&LAYER=imgmap&tileMatrixSet=default028mm&TileMatrix={z}&TileRow={y}&TileCol={x}&style=default&format=image/jpgpng", {
                subdomains: ["0", "1", "2", "3", "4", "5", "6", "7"],
                minZoom:7,
                maxZoom:17,
                zoomOffset :1                 
            });
            var provinceAnno=L.tileLayer("http://srv{s}.zjditu.cn/ZJDOMANNO_2D/wmts?service=wmts&request=GetTile&version=1.0.0&LAYER=TDT_ZJIMGANNO&tileMatrixSet=default028mm&TileMatrix={z}&TileRow={y}&TileCol={x}&style=default&format=image/jpgpng", {
                subdomains: ["0", "1", "2", "3", "4", "5", "6", "7"],
                minZoom:7,
                maxZoom:17,
                zoomOffset :1               
            });         
            // 市县级
            var city=L.tileLayer("http://www.qz-map.com/geoservices/CSIMG/service/wmts?service=wmts&request=GetTile&version=1.0.0&LAYER=CSIMG&tileMatrixSet=TileMatrixSet0&TileMatrix={z}&TileRow={y}&TileCol={x}&style=default&format=image/png", {
                subdomains: ["0", "1", "2", "3", "4", "5", "6", "7"],
                minZoom:18,
                maxZoom:20,
                zoomOffset :1                  
            });
            var cityAnno=L.tileLayer("http://www.qz-map.com/geoservices/CSIMGANNO/service/wmts?service=wmts&request=GetTile&version=1.0.0&LAYER=CSIMGANNO&tileMatrixSet=TileMatrixSet0&TileMatrix={z}&TileRow={y}&TileCol={x}&style=default&format=image/png", {
                subdomains: ["0", "1", "2", "3", "4", "5", "6", "7"],
                minZoom:18,
                maxZoom:20,
                zoomOffset :1                 
            });          
            
            layerGroup=L.layerGroup([country,countryAnno,province,provinceAnno,city,cityAnno]);
        }
        else
        {
            // 国家
            var country= L.tileLayer("http://t{s}.tianditu.cn/vec_c/wmts?service=wmts&request=GetTile&version=1.0.0&LAYER=vec&tileMatrixSet=c&TileMatrix={z}&TileRow={y}&TileCol={x}&style=default&format=tiles", {
                subdomains: ["0", "1", "2", "3", "4", "5", "6", "7"],
                minZoom:1,
                maxZoom:14,
                zoomOffset :1  
            });
            var countryAnno= L.tileLayer("http://t{s}.tianditu.com/cva_c/wmts?service=wmts&request=GetTile&version=1.0.0&LAYER=cva&tileMatrixSet=c&TileMatrix={z}&TileRow={y}&TileCol={x}&style=default&format=tiles", {
                subdomains: ["0", "1", "2", "3", "4", "5", "6", "7"],
                minZoom:1,
                maxZoom:14,
                zoomOffset :1  
            });            
            // 省级
            var province=L.tileLayer("http://srv{s}.zjditu.cn/ZJEMAP_2D/wmts?service=wmts&request=GetTile&version=1.0.0&LAYER=TDT_ZJEMAP&tileMatrixSet=default028mm&TileMatrix={z}&TileRow={y}&TileCol={x}&style=default&format=image/jpgpng", {
                subdomains: ["0", "1", "2", "3", "4", "5", "6", "7"],
                minZoom:7,
                maxZoom:17,
                zoomOffset :1                  
            });
            var provinceAnno=L.tileLayer("http://srv{s}.zjditu.cn/ZJEMAPANNO_2D/wmts?service=wmts&request=GetTile&version=1.0.0&LAYER=TDT_ZJEMAPANNO&tileMatrixSet=default028mm&TileMatrix={z}&TileRow={y}&TileCol={x}&style=default&format=image/jpgpng", {
                subdomains: ["0", "1", "2", "3", "4", "5", "6", "7"],
                minZoom:7,
                maxZoom:17,
                zoomOffset :1                  
            });         
            // 市县级
            var city=L.tileLayer("http://www.qz-map.com/geoservices/CSEMAP/service/wmts?service=wmts&request=GetTile&version=1.0.0&LAYER=CSEMAP&tileMatrixSet=TileMatrixSet0&TileMatrix={z}&TileRow={y}&TileCol={x}&style=default&format=image/png", {
                subdomains: ["0", "1", "2", "3", "4", "5", "6", "7"],
                minZoom:18,
                maxZoom:20,
                zoomOffset :1                 
            });
            var cityAnno=L.tileLayer("http://www.qz-map.com/geoservices/CSEMAPANNO/service/wmts?service=wmts&request=GetTile&version=1.0.0&LAYER=CSEMAPANNO&tileMatrixSet=TileMatrixSet0&TileMatrix={z}&TileRow={y}&TileCol={x}&style=default&format=image/png", {
                subdomains: ["0", "1", "2", "3", "4", "5", "6", "7"],
                minZoom:18,
                maxZoom:20,
                zoomOffset :1               
            });          
            
            layerGroup=L.layerGroup([country,countryAnno,province,provinceAnno,city,cityAnno]);
        }
        return layerGroup;
        
    }

    getAllMapProperties():Observable<MapListResponse> {
        return this.http.get(this.apiUrl)
            .pipe(
            tap(response => { }),
            catchError(this.handleError('getHeroes', {}))
            );
    }


    private handleError<T>(operation = 'operation', result?: T) {
        return (error: any): Observable<T> => {

            // TODO: send the error to remote logging infrastructure
            console.error(error); // log to console instead

            // TODO: better job of transforming error for user consumption
            this.log(`${operation} failed: ${error.message}`);

            // Let the app keep running by returning an empty result.
            return Observable.of(result as T);
        };
    }  

    private log(message: string) {
        this.LogService.add('mapService: ' + message);
    }  

}