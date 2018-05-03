import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { catchError, map, tap } from 'rxjs/operators';

import { ConfigService } from "./configService";
import { LogService } from "./logService";

import { ListResponse } from '../viewModels/Response/ListResponse'

const httpOptions = {
    headers: new HttpHeaders({ 'Content-Type': 'application/json' })
};
  
@Injectable()
export class PropertyService{
    private apiUrl="";

    constructor( private http: HttpClient,
        private logService:LogService,
        private configService:ConfigService){ 
            this.apiUrl+=configService.getApiUrl()+"properties/";
        }

    //获取资产列表
    getAllProperties():Observable<ListResponse>{
        return this.http.get<ListResponse>(this.apiUrl)      
        .pipe(
            tap(response =>{}),
            catchError(this.handleError('getHeroes', {}))
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