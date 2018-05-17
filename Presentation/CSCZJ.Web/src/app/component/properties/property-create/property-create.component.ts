import { Component, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  ValidationErrors,
  Validators, ValidatorFn
} from '@angular/forms';
import { Observable } from 'rxjs/Observable';
import { Observer } from 'rxjs/Observer';

import { NzMessageService, UploadFile } from 'ng-zorro-antd';

import { format, compareAsc } from 'date-fns'

import { PropertyCreateModel } from '../../../viewModels/Properties/property';

import { MapService } from '../../../services/map/mapService';
import { PropertyService } from '../../../services/propertyService';
import { GovernmentService } from '../../../services/governmentService';

declare var L: any;

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
  ],
})

export class PropertyCreateComponent implements OnInit {
  private current: number;
  private property = new PropertyCreateModel();

  private map: any;
  private marker = null;
  private extent = null;
  private editableLayers = new L.FeatureGroup();
  private mapOverlayOption = {
    edit: true,
    //icon: new L.Icon.Default(),
    //color: '#AA0000',
    //weight: 3,
    //opacity: 1.0,
    //fillColor: '#AA0000',
    //fillOpacity: 0.2
  };  

  private basicFormValidateConfig = {
    floorRequired: false,
    constructAreaRequired: false,
    estateIdRequired: true,
    estateTimeRequired: true,
    constructIdRequired: false,
    constructTimeRequired: false,
    landIdRequired: false,
    landTimeRequired: false,
  };
  private isGovernmentLoading = false;
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
      this.basicInfoForm.controls[key].markAsDirty();
      this.basicInfoForm.controls[key].updateValueAndValidity();
    }
  }

  resetForm(e: MouseEvent): void {
    e.preventDefault();
    this.basicInfoForm.reset();
    for (const key in this.basicInfoForm.controls) {
      this.basicInfoForm.controls[key].markAsPristine();
      this.basicInfoForm.controls[key].updateValueAndValidity();
    }
  }


  constructor(private fb: FormBuilder, private mapService: MapService,
    private propertyService: PropertyService,
    private governmentService: GovernmentService) {


    this.basicInfoForm = this.fb.group({
      pName: ['', [Validators.required], [this.propertyNameAsyncValidator]],
      pType: ['', [Validators.required]],
      pAddress: ['', [Validators.required]],
      pFloor: [''],
      pFourToStation: [''],
      pGetedDate: ['', [Validators.required]],
      pGetModelId: ['', [Validators.required]],
      pIsAdmission: ['', [Validators.required]],

      //产权信息
      pRegisterType: [''],
      pEstateId: ['', [Validators.required]],
      pEstateTime: ['', [Validators.required]],
      pConstructId: [''],
      pConstructArea: [''],
      pConstructTime: [''],
      pLandId: [''],
      pLandArea: ['', [Validators.required]],
      pLandTime: [''],

      pGovernmentId: ['', [Validators.required]],
      pUseTypeId: ['', [Validators.required]],
      pCurrentTypeId: ['', [Validators.required]],
      pIsMortgage: ['', [Validators.required]],

      pDescription: ['',],
      // pLogo: ['', [Validators.required]],
      // pLocation: ['', [Validators.required]],
      // pExtent: ['', [Validators.required]]
    });
  }

  //#region 验证相关

  //名称验证
  propertyNameAsyncValidator = (control: FormControl) => {
    var that = this;
    return Observable.create((observer: Observer<ValidationErrors>) => {

      that.propertyService.nameValidate(control.value).subscribe(response => {
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
  propertyTypeValidateSwicher(): void {
    if (this.property.typeId == 0) {
      this.basicInfoForm.get('pFloor').setValidators(Validators.required);
      this.basicInfoForm.get('pFloor').markAsDirty();
      this.basicFormValidateConfig.floorRequired = true;

      this.basicInfoForm.get('pConstructArea').setValidators(Validators.required);
      this.basicInfoForm.get('pConstructArea').markAsDirty();
      this.basicFormValidateConfig.constructAreaRequired = true;

      if (this.property.registerType == '1') {
        this.basicInfoForm.get('pConstructId').setValidators(Validators.required);
        this.basicInfoForm.get('pConstructId').markAsDirty();
        this.basicFormValidateConfig.constructIdRequired = true;

        this.basicInfoForm.get('pConstructTime').setValidators(Validators.required);
        this.basicInfoForm.get('pConstructTime').markAsDirty();
        this.basicFormValidateConfig.constructTimeRequired = true;
      }

    } else {
      this.basicInfoForm.get('pFloor').clearValidators();
      this.basicInfoForm.get('pFloor').markAsPristine();
      this.basicFormValidateConfig.floorRequired = false;

      this.basicInfoForm.get('pConstructArea').clearValidators();
      this.basicInfoForm.get('pConstructArea').markAsPristine();
      this.basicFormValidateConfig.floorRequired = false;

      if (this.property.registerType == '1') {
        this.basicInfoForm.get('pConstructId').clearValidators();
        this.basicInfoForm.get('pConstructId').markAsPristine();
        this.basicFormValidateConfig.constructIdRequired = false;

        this.basicInfoForm.get('pConstructTime').clearValidators();
        this.basicInfoForm.get('pConstructTime').markAsPristine();
        this.basicFormValidateConfig.constructTimeRequired = false;
      }
    }

    this.basicInfoForm.get('pFloor').updateValueAndValidity();
    this.basicInfoForm.get('pConstructArea').updateValueAndValidity();
    this.basicInfoForm.get('pConstructId').updateValueAndValidity();
    this.basicInfoForm.get('pConstructTime').updateValueAndValidity();
  }

  //登记类型变化引起的表单验证切换
  registerTypeValidateSwicher(): void {
    if (this.property.registerType == '1') {
      if (this.property.typeId == 0) {
        this.basicInfoForm.get('pConstructId').setValidators(Validators.required);
        this.basicInfoForm.get('pConstructId').markAsDirty();
        this.basicFormValidateConfig.constructIdRequired = true;

        this.basicInfoForm.get('pConstructTime').setValidators(Validators.required);
        this.basicInfoForm.get('pConstructTime').markAsDirty();
        this.basicFormValidateConfig.constructTimeRequired = true;
      }
      else {
        this.basicInfoForm.get('pConstructId').clearValidators();
        this.basicInfoForm.get('pConstructId').markAsPristine();
        this.basicFormValidateConfig.constructIdRequired = false;

        this.basicInfoForm.get('pConstructTime').clearValidators();
        this.basicInfoForm.get('pConstructTime').markAsPristine();
        this.basicFormValidateConfig.constructTimeRequired = false;
      }

      this.basicInfoForm.get('pLandId').setValidators(Validators.required);
      this.basicInfoForm.get('pLandId').markAsDirty();
      this.basicFormValidateConfig.landIdRequired = true;

      this.basicInfoForm.get('pLandTime').setValidators(Validators.required);
      this.basicInfoForm.get('pLandTime').markAsDirty();
      this.basicFormValidateConfig.landTimeRequired = true;
    }
    else {
      this.basicInfoForm.get('pConstructId').clearValidators();
      this.basicInfoForm.get('pConstructId').markAsPristine();
      this.basicFormValidateConfig.constructIdRequired = false;

      this.basicInfoForm.get('pConstructTime').clearValidators();
      this.basicInfoForm.get('pConstructTime').markAsPristine();
      this.basicFormValidateConfig.constructTimeRequired = false;

      this.basicInfoForm.get('pLandId').clearValidators();
      this.basicInfoForm.get('pLandId').markAsPristine();
      this.basicFormValidateConfig.landIdRequired = false;

      this.basicInfoForm.get('pLandTime').clearValidators();
      this.basicInfoForm.get('pLandTime').markAsPristine();
      this.basicFormValidateConfig.landTimeRequired = false;
    }

    this.basicInfoForm.get('pConstructId').updateValueAndValidity();
    this.basicInfoForm.get('pConstructTime').updateValueAndValidity();
    this.basicInfoForm.get('pLandId').updateValueAndValidity();
    this.basicInfoForm.get('pLandTime').updateValueAndValidity();
  }


  //#endregion

  //government 搜索实现
  onSearch(value: string): void {
    if (value == "" || value == undefined || value == null) return;
    var that = this;
    this.isGovernmentLoading = true;
    this.governmentService.autocompleteByName(value).subscribe(response => {
      that.optionList = response.data;
      that.isGovernmentLoading = false;
    });
  }

  ngOnInit() {
    this.current = 0;

  }

  ngAfterViewInit() {
  }

  pre(): void {
    this.current -= 1;
    this.changeContent();
  }

  next(): void {
    var validation = false;
    switch (this.current) {
      case 0:
        validation = this.basicInfoForm.valid;

        if (!validation) {
          for (const key in this.basicInfoForm.controls) {
            this.basicInfoForm.controls[key].markAsDirty();
            this.basicInfoForm.controls[key].updateValueAndValidity();
          }
        }
        else {
          //预处理
          this.property.getedDateStr = format(this.property.getedDate, 'YYYY/MM/DD');
          if (this.property.registerType == "0" && this.property.estateTime != undefined) this.property.estateTimeStr = format(this.property.estateTime, 'YYYY/MM/DD');
          if (this.property.registerType == "1" && this.property.constructTime != undefined) this.property.constructTimeStr = format(this.property.constructTime, 'YYYY/MM/DD');
          if (this.property.registerType == "1" && this.property.landTime != undefined) this.property.landTimeStr = format(this.property.landTime, 'YYYY/MM/DD');
        }
        break;
      case 1:
        break;
    }

    // if (validation) {
      this.current += 1;
      this.changeContent();
    // }


  }

  done(): void {
    console.log('done');
  }

  //切换输入内容
  changeContent(): void {
    switch (this.current) {
      case 0:
        break;
      case 1:
        if (this.map == null || this.map == undefined) this.mapStepInitial();
        break;
      default:
        break;
    }
  }

  //当前激活表单验证，是否可以进行下一步
  formValiateCheck(): void {

  }

  mapStepInitial(): void {
    var that = this;

  
    setTimeout(() => {
      var normal = that.mapService.getLayer("vector");
      var satellite = that.mapService.getLayer("img");
      that.map = L.map('map', {
        crs: L.CRS.EPSG4326,
        center: [28.905527517199516, 118.50629210472107],
        zoom: 14
      });

      normal.addTo(that.map);


      var zoomControl = that.map.zoomControl;

      zoomControl.setPosition("topright");

      that.map.addLayer(that.editableLayers);

      var options = {
        position: 'topleft',
        draw: {
          polyline: false,
          polygon: {
            allowIntersection: false, // Restricts shapes to simple polygons
            drawError: {
              color: '#e1e100', // Color the shape will turn when intersects
              message: '<strong>绘制错误！<strong> 多边形不能自重叠' // Message that will show when intersect
            },
            shapeOptions: {
              color: 'blue'
            }
          },
          circle: false,
          rectangle: false,
          marker: true,
          circlemarker:false
        },
        edit: {
          featureGroup: that.editableLayers, //REQUIRED!!
          remove: true
        }
      };

      var drawControl = new L.Control.Draw(options);
      that.map.addControl(drawControl);

      //绘制空间查询范围

      var drawPolygon = new L.Draw.Polygon(that.map, options.draw.polygon);
      var drawRectangle = new L.Draw.Rectangle(that.map, options.draw.rectangle);
      var drawCircle = new L.Draw.Circle(that.map, options.draw.circle);

      //要素绘制事件
      that.map.on(L.Draw.Event.CREATED, function (e) {
        var type = e.layerType, layer = e.layer;
        var geojson = layer.toGeoJSON();

        switch (type) {
          case "marker":
            that.editableLayers.removeLayer(that.marker);
            that.marker = layer;
            that.marker.addTo(that.editableLayers);
            // that.property.location = _wkt.fromJson(geojson).write();
            break;
          case "polygon":
            that.editableLayers.removeLayer(that.extent);
            that.extent = layer;
            that.extent.addTo(that.editableLayers);
            // that.property.extent = _wkt.fromJson(geojson).write();
            break;
        }
      });

      //要素删除事件
      that.map.on(L.Draw.Event.DELETED, function (e) {

        // angular.forEach(e.layers._layers, function (layer) {

        //     if (layer._leaflet_id == that.marker._leaflet_id)
        //         $scope.property.location = "";
        //     else if (layer._leaflet_id == extent._leaflet_id)
        //         $scope.property.extent = "";

      });
    

    //汉化
    L.drawLocal.draw.handlers.polygon = {
      tooltip: {
        start: '点击开始绘制多边形',
        cont: '点击继续绘制多边形',
        end: '点击第一个闭合多边形'
      }
    };
    L.drawLocal.draw.handlers.simpleshape = {
      tooltip: {
        end: '释放鼠标结束绘制'
      }
    };
  }, 500);
}

}
