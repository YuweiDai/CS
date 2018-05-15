import { Component, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  ValidationErrors,
  Validators,ValidatorFn
} from '@angular/forms';
import { Observable } from 'rxjs/Observable';
import { Observer } from 'rxjs/Observer';
import { DateTimeAdapter, OWL_DATE_TIME_LOCALE, OwlDateTimeIntl } from 'ng-pick-datetime';

import { NzMessageService, UploadFile } from 'ng-zorro-antd';
import { PropertyCreateModel } from '../../../viewModels/Properties/property';import { NativeDateTimeAdapter } from 'ng-pick-datetime/date-time/adapter/native-date-time-adapter.class';

import { MapService } from '../../../services/map/mapService';
import { PropertyService } from '../../../services/propertyService';

declare var L:any;

//汉化
export class ChineseIntl {
  /** A label for the up second button (used by screen readers).  */
  upSecondLabel = 'ajouter une seconde';

  /** A label for the down second button (used by screen readers).  */
  downSecondLabel = 'moins une seconde';

  /** A label for the up minute button (used by screen readers).  */
  upMinuteLabel = 'ajouter une minute';

  /** A label for the down minute button (used by screen readers).  */
  downMinuteLabel = 'moins une minute';

  /** A label for the up hour button (used by screen readers).  */
  upHourLabel = 'ajouter une heure';

  /** A label for the down hour button (used by screen readers).  */
  downHourLabel = 'moins une heure';

  /** A label for the previous month button (used by screen readers). */
  prevMonthLabel = 'le mois précédent';

  /** A label for the next month button (used by screen readers). */
  nextMonthLabel = 'le mois prochain';

  /** A label for the previous year button (used by screen readers). */
  prevYearLabel = 'année précédente';

  /** A label for the next year button (used by screen readers). */
  nextYearLabel = 'l\'année prochaine';

  /** A label for the previous multi-year button (used by screen readers). */
  prevMultiYearLabel = 'Previous 21 years';

  /** A label for the next multi-year button (used by screen readers). */
  nextMultiYearLabel = 'Next 21 years';

  /** A label for the 'switch to month view' button (used by screen readers). */
  switchToMonthViewLabel = 'Change to month view';

  /** A label for the 'switch to year view' button (used by screen readers). */
  switchToMultiYearViewLabel = 'Choose month and year';

  /** A label for the cancel button */
  cancelBtnLabel = '取消';

  /** A label for the set button */
  setBtnLabel = '确定';

  /** A label for the range 'from' in picker info */
  rangeFromLabel = 'From';

  /** A label for the range 'to' in picker info */
  rangeToLabel = 'To';

  /** A label for the hour12 button (AM) */
  hour12AMLabel = 'AM';

  /** A label for the hour12 button (PM) */
  hour12PMLabel = 'PM';
}

@Component({
  selector: 'app-property-create',
  templateUrl: './property-create.component.html',
  styleUrls: ['./property-create.component.less'],
  providers: [
    // The locale would typically be provided on the root module of your application. We do it at
    // the component level here, due to limitations of our example generation script.
    {provide: OWL_DATE_TIME_LOCALE, useValue: 'zh'},
    {provide: DateTimeAdapter, useClass: NativeDateTimeAdapter, deps: [OWL_DATE_TIME_LOCALE]},
    {provide: OwlDateTimeIntl, useClass: ChineseIntl},
],  
})

export class PropertyCreateComponent implements OnInit {
  private current:number;
  private property=new PropertyCreateModel();
  private map:any;

  defaultFileList = [
    {
      uid: -1,
      name: 'xxx.png',
      status: 'done',
      url: 'https://zos.alipayobjects.com/rmsportal/jkjgkEfvpUPVyRjUImniVslZfWPnJuuZ.png',
      thumbUrl: 'https://zos.alipayobjects.com/rmsportal/jkjgkEfvpUPVyRjUImniVslZfWPnJuuZ.png'
    },
    {
      uid: -2,
      name: 'yyy.png',
      status: 'done',
      url: 'https://zos.alipayobjects.com/rmsportal/jkjgkEfvpUPVyRjUImniVslZfWPnJuuZ.png',
      thumbUrl: 'https://zos.alipayobjects.com/rmsportal/jkjgkEfvpUPVyRjUImniVslZfWPnJuuZ.png'
    }
  ];

  fileList2 = [...this.defaultFileList];  

  basicInfoForm: FormGroup;
  submitForm = ($event, value) => {
    $event.preventDefault();
    for (const key in this.basicInfoForm.controls) {
      this.basicInfoForm.controls[ key ].markAsDirty();
      this.basicInfoForm.controls[ key ].updateValueAndValidity();
    }
    console.log(value);
  }

  resetForm(e: MouseEvent): void {
    e.preventDefault();
    this.basicInfoForm.reset();
    for (const key in this.basicInfoForm.controls) {
      this.basicInfoForm.controls[ key ].markAsPristine();
      this.basicInfoForm.controls[ key ].updateValueAndValidity();
    }
  }

  validateConfirmPassword(): void {
    setTimeout(() => this.basicInfoForm.controls.confirm.updateValueAndValidity());
  }



  constructor(private fb: FormBuilder,private mapService:MapService,private propertyService:PropertyService) {
   
    this.basicInfoForm = this.fb.group({
      pName: [ '', [ Validators.required ], [ this.propertyNameAsyncValidator ] ],      
      pType:['',[Validators.required]],
      pAddress:['',[Validators.required]],
      pFloor:[''],
      pFourToStation:[''],      
      pGetedDate:['',[Validators.required]],
      pGetModelId:['',[Validators.required]],
      pIsAdmission:['',[Validators.required]],

      //产权信息
      pRegisterType:[''],
      pEstateId:[''],
      pEstateTime:[''],
      pConstructId:[''],
      pConstructArea:[''],
      pConstructTime:[''],
      pLandId:[''],
      pLandArea:[''],
      pLandTime:[''],
      
      pGovernmentId:['',[Validators.required]],
      pUseTypeId:['',[Validators.required]],
      pCurrentTypeId:['',[Validators.required]],
      pIsMortgage:['',[Validators.required]],                  

      pDescription:['',],
      pLogo:['',[Validators.required]],
      pLocation:['',[Validators.required]],
      pExtent:['',[Validators.required]]
    });
  }


  //#region 验证相关

  //名称验证
  // propertyNameAsyncValidator(control: FormControl):ValidationErrors{
  //   console.log(this.propertyService);

  //   // this.propertyService.nameValidate(control.value).subscribe(exsit=>{
  //   //   if(exsit)return { error: true, duplicated: true };      
  //   //   else return null;    
  //   // });

  //   return null;
  // } 

  propertyNameAsyncValidator(nameRe: RegExp): ValidatorFn {
    var that=this;
    return (control: FormControl): {[key: string]: any} => {
      that.propertyService.nameValidate(control.value).subscribe(exsit=>{
        console.log(exsit);
        if(exsit)return { error: true, duplicated: true };      
        else return null;    
      });

      return null;
      // const forbidden = nameRe.test(control.value);
      // return forbidden ? {'forbiddenName': {value: control.value}} : null;
    };


  }  

//   propertyNameAsyncValidator = (control: FormControl) =>{ 
//      var that=this;

//     Observable.create(
 
//      (observer: Observer<ValidationErrors>) => {
// console.log("123");
//       // that.propertyService.nameValidate(control.value).subscribe(exsit=>{
//       //   console.log(exsit);
//       //   if(exsit)return { error: true, duplicated: true };      
//       //   else return null;    
//       // });
//     setTimeout(() => {
//       if (control.value === 'JasonWood') {
//         observer.next({ error: true, duplicated: true });
//       } else {
//         observer.next(null);
//       }
//       observer.complete();
//     }, 1000);
//     }
//   ) 
// }
  
  // Observable.create((observer: Observer<ValidationErrors>) => {


  //   setTimeout(() => {
  //     if (control.value === 'JasonWood') {
  //       observer.next({ error: true, duplicated: true });
  //     } else {
  //       observer.next(null);
  //     }
  //     observer.complete();
  //   }, 1000);
  // })
  
  //#endregion


  ngOnInit() {
    this.current=0;   
  }

  ngAfterViewInit() {
  }

  pre(): void {
    this.current -= 1;
    this.changeContent();
  }

  next(): void {
    this.current += 1;
    this.changeContent();
  }

  done(): void {
    console.log('done');
  }

  //切换输入内容
  changeContent():void
  {
    switch (this.current) {
      case 0:        
        break;
      case 1:
        this.mapStepInitial();
        break;
      default:
        break;
    }
  }

  //当前激活表单验证，是否可以进行下一步
  formValiateCheck():void
  {

  }

  mapStepInitial():void
  {
    setTimeout(() => {
      var normal = this.mapService.getLayer("vector");
      var satellite = this.mapService.getLayer("img");
      this.map = L.map('map', {
          crs:L.CRS.EPSG4326,
          center: [28.905527517199516, 118.50629210472107],
          zoom: 14
      });
  
      normal.addTo(this.map);
  
      L.marker([28.905527517199516, 118.50629210472107],{title:"28.905527517199516, 118.50629210472107"}).addTo(this.map);

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
  }

}
