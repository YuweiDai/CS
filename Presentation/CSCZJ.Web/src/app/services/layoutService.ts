import { Injectable } from '@angular/core';
import { ScreenSize } from "../viewModels/layout/ScreenSize";

@Injectable()
export class LayoutService{

    constructor(

    ){

    }

    getActualScreenSize():ScreenSize{
        var s=new ScreenSize();

        s.height=window.innerHeight;;
        s.width=window.innerWidth;

        console.log(s);
        return s;
    }

    getContentHeight():number{
        return this.getActualScreenSize().height-80-54;
    }
}