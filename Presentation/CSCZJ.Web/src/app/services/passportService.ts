import { Injectable } from '@angular/core';

import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { catchError, map, tap } from 'rxjs/operators';


import { ConfigService } from "./configService";
import { LogService } from "./logService";

import { AuthenticationModel } from "../viewModels/passport/AuthenticationModel";
import { LoginModel } from "../viewModels/passport/LoginModel";

@Injectable()
export class AuthInterceptorService {
    private apiUrl = "";
    private httpOptions = {
        headers: new HttpHeaders({ 'Content-Type': 'application/json' })
    };

    constructor(private http: HttpClient,
        private logService: LogService,
        private configService: ConfigService) {
        this.apiUrl += configService.getApiUrl() + "properties";
    }

    request(): void {
        // config.headers = config.headers || {};

        // var authData = $localStorage.authorizationData;
        // //var authData = $localStorage.get('authorizationData');
        // if (authData) {
        //     config.headers.Authorization = 'Bearer ' + authData.token;
        // }

        // return config;
    }

    responseError(): void {
        // if (rejection.status === 401) {
        //     var authService = $injector.get('authService');
        //     var $state = $injector.get('$state');

        //     var authData = $localStorage.authorizationData;
        //     //var authData = $localStorage.get('authorizationData');

        //     if (authData) {
        //         if (authData.useRefreshTokens) {
        //             $location.path('/refresh');   //ps:这里应该重新发送请求去获取token
        //             return $q.reject(rejection);
        //         }
        //     }
        //     authService.logOut();
        //     //$location.path('/login');
        //     $state.go("access.signin");
        // }
        // return $q.reject(rejection);
    }
}

@Injectable()
export class AuthService {
    private apiUrl="";

    private authentication: AuthenticationModel;
    constructor(private http: HttpClient,
        private logService: LogService,
        private configService: ConfigService) {
        this.apiUrl += configService.getApiUrl();
    }

    //登陆
    login(loginModel: LoginModel): void {
        var that=this;
        var url=that.apiUrl+"token";
        var data = "grant_type=password&userName=" + loginModel.account + "&password=" + loginModel.password;

        that.http.post(url, data, { headers: { 'Content-Type': 'application/x-www-form-urlencoded' } }).pipe(
            tap(response =>{
                console.log(response);
                this.log(`getRefreshTokens`);
            } ),
            catchError(this.handleError<any>(`getRefreshTokens`))
        );
        
        // .success(function (response) {

        //     //是否为管理员登录
        //     if (loginModel.isAdmin && !(_userHasRole(response.userRoles, "管理员")||_userHasRole(response.userRoles, "注册单位"))) {
        //         that.logout();
        //         deferred.reject({ "error": "无效授权", "error_description": "账户无登录权限" });
        //     }
        //     else
        //     {
        //         var authroziationData = { token: response.access_token, userName: loginModel.account,nickName:response.nickName, refreshToken:"", useRefreshTokens: false, roles: response.userRoles, isAdmin: _userHasRole(response.userRoles, "管理员") > -1 };
                
        //         if (loginModel.useRefreshTokens) {
        //             authroziationData.useRefreshTokens = true;
        //             authroziationData.refreshToken = response.refresh_token;
        //         }
 
        //         $localStorage.authorizationData = authroziationData;

        //         _authentication.isAuth = true;
        //         _authentication.account = loginModel.account;
        //         _authentication.nickName = response.nickName;
        //         _authentication.useRefreshTokens = loginModel.useRefreshTokens;
        //         _authentication.roles = response.userRoles;
        //         _authentication.isAdmin = _userHasRole(response.userRoles, "管理员") > -1;

        //         console.log($localStorage.authorizationData);

        //         deferred.resolve(response);
        //     }
        // }).error(function (err, status) {
        //     _logOut();
        //     deferred.reject(err);
        // });
    }

    logout(): void {

    }

    isAdmin(): boolean {
        return true;
    }

    fillAuthData(): void {

    }

    refreshToken(): void {

    }

    private userHasRole(roles: string, targetRole: string): boolean {
        return roles.indexOf(targetRole) > -1;
    }

    /**
     * Handle Http operation that failed.
     * Let the app continue.
     * @param operation - name of the operation that failed
     * @param result - optional value to return as the observable result
     */
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

    /** Log a PropertyService message with the MessageService */
    private log(message: string) {
        this.logService.add('PropertyService: ' + message);
    }
}

@Injectable()
export class TokensManagerService {
    private apiUrl = "";

    constructor(private http: HttpClient,
        private logService: LogService,
        private configService: ConfigService) {
        this.apiUrl += configService.getApiUrl();
    }


    getRefreshTokens(): Observable<any> {
        const url = this.apiUrl + "/refreshtokens";

        return this.http.get<any>(url).pipe(
            tap(_ => this.log(`getRefreshTokens`)),
            catchError(this.handleError<any>(`getRefreshTokens`))
        );
    }


    deleteRefreshTokens(tokenid:string): Observable<any> {
        const url = this.apiUrl + "/refreshtokens/?"+tokenid;

        return this.http.delete<any>(url).pipe(
            tap(_ => this.log(`deleteRefreshTokens`)),
            catchError(this.handleError<any>(`deleteRefreshTokens`))
        );
    }    

    /**
     * Handle Http operation that failed.
     * Let the app continue.
     * @param operation - name of the operation that failed
     * @param result - optional value to return as the observable result
     */
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

    /** Log a PropertyService message with the MessageService */
    private log(message: string) {
        this.logService.add('PropertyService: ' + message);
    }
}