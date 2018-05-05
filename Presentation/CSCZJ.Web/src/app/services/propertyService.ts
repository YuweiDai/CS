import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders,HttpParams  } from '@angular/common/http';
import { Observable } from 'rxjs';
import { catchError, map, tap } from 'rxjs/operators';

import { ConfigService } from "./configService";
import { LogService } from "./logService";

import { TableParams } from "../viewModels/common/TableOption";

import { ListResponse } from '../viewModels/Response/ListResponse'
import { MapListResponse } from '../viewModels/Response/MapListResponse';
import { Property } from '../viewModels/Properties/property';
import {property_map} from '../viewModels/Properties/property_map';



const httpOptions = {
    headers: new HttpHeaders({ 'Content-Type': 'application/json' })
};

@Injectable()
export class PropertyService{
    private apiUrl="";
    

    constructor( private http: HttpClient,
        private logService:LogService,
        private configService:ConfigService){ 
          this.apiUrl+=configService.getApiUrl()+"properties";
        }

    //获取单个资产
    getPropertyById(id:number):Observable<Property>{
      const url = `${this.apiUrl}/${id}`;
      return this.http.get<Property>(url).pipe(
        tap(_ => this.log(`fetched hero id=${id}`)),
        catchError(this.handleError<Property>(`getHero id=${id}`))
      );    
    }
       
    //获取资产列表
    getAllProperties(params:TableParams):Observable<ListResponse>{
      let url=this.apiUrl;

      let requestParams = new URLSearchParams();
      if(!(params.query==""|| params.query==null||params.query==undefined)) requestParams.append('query', params.query)
      requestParams.append('pageIndex', params.pageIndex.toString())
      requestParams.append('pageSize', params.pageSize.toString())
      requestParams.append('showHidden', "true")
      if(!(params.sort==""|| params.sort==null||params.sort==undefined)) requestParams.append('sort', params.sort)
      requestParams.append('time', new Date().getTime().toString());

        return this.http.get<ListResponse>(url+"?"+requestParams.toString())      
        .pipe(
            tap(response =>{}),
            catchError(this.handleError('getAllProperties', {}))
          );
    }


    getAllPropertiesInMap():Observable<property_map[]> {
      return this.http.get<property_map[]>(this.apiUrl+"/geo/bigdata")
          .pipe(
          tap(response => { }),
          catchError(this.handleError('getAllPropertiesInMap', []))
          );
  }










  /**
   * Handle Http operation that failed.
   * Let the app continue.
   * @param operation - name of the operation that failed
   * @param result - optional value to return as the observable result
   */
  private handleError<T> (operation = 'operation', result?: T) {
    return (error: any): Observable<T> => {

      // TODO: send the error to remote logging infrastructure
      console.error(error); // log to console instead

      // TODO: better job of transforming error for user consumption
      this.log(`${operation} failed: ${error.message}`);

      // Let the app keep running by returning an empty result.
      return Observable.of(result as T);
    };
  }  

  /** Log a PropertyService message with the MessageService */
  private log(message: string) {
    this.logService.add('PropertyService: ' + message);
  }  
}