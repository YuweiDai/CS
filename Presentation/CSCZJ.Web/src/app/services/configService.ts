import { Injectable } from '@angular/core';

@Injectable()
export class ConfigService{
    apiUrl:string;

    constructor(){
        this.apiUrl="http://localhost:4200/api/"
    }

    getApiUrl():string{
        return this.apiUrl;
    }

    getClinetId():string{
        return "";
    }
}