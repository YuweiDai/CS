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
import { GovernmentService } from '../../../services/governmentService';

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
  private basicFormValidateConfig={
    floorRequired:false,
    constructAreaRequired:false,  
    estateIdRequired:true,
    estateTimeRequired:true,
    constructIdRequired:false,
    constructTimeRequired:false,
    landIdRequired:false,
    landTimeRequired:false,
  };
  private isGovernmentLoading=false;
  optionList = [];
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



  constructor(private fb: FormBuilder,private mapService:MapService,
    private propertyService:PropertyService,
    private governmentService:GovernmentService) {
   

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
  propertyNameAsyncValidator = (control: FormControl) =>{
    var that=this;
    return Observable.create((observer: Observer<ValidationErrors>) => {

      that.propertyService.nameValidate(control.value).subscribe(response=>{
        if (response) {
          observer.next({ error: true, duplicated: true });
        } else {
          observer.next(null);
        }
        observer.complete();
      });
    })  
  }

  //资产类别变化引起的表单验证切换
  propertyTypeValidateSwicher():void{
    if(this.property.typeId==0)
    {
      this.basicInfoForm.get('pFloor').setValidators(Validators.required);
      this.basicInfoForm.get('pFloor').markAsDirty();
      this.basicFormValidateConfig.floorRequired=true;
      
      this.basicInfoForm.get('pConstructArea').setValidators(Validators.required);
      this.basicInfoForm.get('pConstructArea').markAsDirty();
      this.basicFormValidateConfig.constructAreaRequired=true;

      if(this.property.registerType=='1')
      {
        this.basicInfoForm.get('pConstructId').setValidators(Validators.required);
        this.basicInfoForm.get('pConstructId').markAsDirty();
        this.basicFormValidateConfig.constructIdRequired=true;
        
        this.basicInfoForm.get('pConstructTime').setValidators(Validators.required);
        this.basicInfoForm.get('pConstructTime').markAsDirty();
        this.basicFormValidateConfig.constructTimeRequired=true;
      }    

    } else {
      this.basicInfoForm.get('pFloor').clearValidators();
      this.basicInfoForm.get('pFloor').markAsPristine();
      this.basicFormValidateConfig.floorRequired=false;

      this.basicInfoForm.get('pConstructArea').clearValidators();
      this.basicInfoForm.get('pConstructArea').markAsPristine();
      this.basicFormValidateConfig.floorRequired=false;  
      
      if(this.property.registerType=='1')
      {
        this.basicInfoForm.get('pConstructId').clearValidators();
        this.basicInfoForm.get('pConstructId').markAsPristine();
        this.basicFormValidateConfig.constructIdRequired=false;
        
        this.basicInfoForm.get('pConstructTime').clearValidators();
        this.basicInfoForm.get('pConstructTime').markAsPristine();
        this.basicFormValidateConfig.constructTimeRequired=false;
      }      
    }    

    this.basicInfoForm.get('pFloor').updateValueAndValidity();
    this.basicInfoForm.get('pConstructArea').updateValueAndValidity();
    this.basicInfoForm.get('pConstructId').updateValueAndValidity();
    this.basicInfoForm.get('pConstructTime').updateValueAndValidity();    
  }

  //登记类型变化引起的表单验证切换
  registerTypeValidateSwicher():void{
    if(this.property.registerType=='1')
    {
      if(this.property.typeId==0)
      {
        this.basicInfoForm.get('pConstructId').setValidators(Validators.required);
        this.basicInfoForm.get('pConstructId').markAsDirty();
        this.basicFormValidateConfig.constructIdRequired=true;
        
        this.basicInfoForm.get('pConstructTime').setValidators(Validators.required);
        this.basicInfoForm.get('pConstructTime').markAsDirty();
        this.basicFormValidateConfig.constructTimeRequired=true;
      }
      else
      {
        this.basicInfoForm.get('pConstructId').clearValidators();
        this.basicInfoForm.get('pConstructId').markAsPristine();
        this.basicFormValidateConfig.constructIdRequired=false;
        
        this.basicInfoForm.get('pConstructTime').clearValidators();
        this.basicInfoForm.get('pConstructTime').markAsPristine();
        this.basicFormValidateConfig.constructTimeRequired=false;
      }

      this.basicInfoForm.get('pLandId').setValidators(Validators.required);
      this.basicInfoForm.get('pLandId').markAsDirty();
      this.basicFormValidateConfig.landIdRequired=true;
      
      this.basicInfoForm.get('pLandTime').setValidators(Validators.required);
      this.basicInfoForm.get('pLandTime').markAsDirty();
      this.basicFormValidateConfig.landTimeRequired=true;
    }    
    else
    {
      this.basicInfoForm.get('pConstructId').clearValidators();
      this.basicInfoForm.get('pConstructId').markAsPristine();
      this.basicFormValidateConfig.constructIdRequired=false;
      
      this.basicInfoForm.get('pConstructTime').clearValidators();
      this.basicInfoForm.get('pConstructTime').markAsPristine();
      this.basicFormValidateConfig.constructTimeRequired=false;

      this.basicInfoForm.get('pLandId').clearValidators();
      this.basicInfoForm.get('pLandId').markAsPristine();
      this.basicFormValidateConfig.landIdRequired=false;
      
      this.basicInfoForm.get('pLandTime').clearValidators();
      this.basicInfoForm.get('pLandTime').markAsPristine();
      this.basicFormValidateConfig.landTimeRequired=false;      
    }   

    this.basicInfoForm.get('pConstructId').updateValueAndValidity();
    this.basicInfoForm.get('pConstructTime').updateValueAndValidity();
    this.basicInfoForm.get('pLandId').updateValueAndValidity();
    this.basicInfoForm.get('pLandTime').updateValueAndValidity();    
  }

  
  //#endregion

  onSearch(value: string): void {
    var that=this;
    this.isGovernmentLoading = true; 
    this.governmentService.autocompleteByName(value).subscribe(response=>{
      console.log(response);
      that.optionList =response.data;
      console.log(that.optionList);
      that.isGovernmentLoading=false;
    });
  }

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

    console.log(this.property);
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
