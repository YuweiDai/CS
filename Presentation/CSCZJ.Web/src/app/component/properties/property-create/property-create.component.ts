import { Component, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  ValidationErrors,
  Validators
} from '@angular/forms';
import { Observable } from 'rxjs/Observable';
import { Observer } from 'rxjs/Observer';

import { NzMessageService, UploadFile } from 'ng-zorro-antd';

import { MapService } from '../../../services/map/mapService';
declare var L:any;

@Component({
  selector: 'app-property-create',
  templateUrl: './property-create.component.html',
  styleUrls: ['./property-create.component.less']
})
export class PropertyCreateComponent implements OnInit {
  current:number;
  map:any;

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

  validateForm: FormGroup;
  submitForm = ($event, value) => {
    $event.preventDefault();
    for (const key in this.validateForm.controls) {
      this.validateForm.controls[ key ].markAsDirty();
      this.validateForm.controls[ key ].updateValueAndValidity();
    }
    console.log(value);
  }

  resetForm(e: MouseEvent): void {
    e.preventDefault();
    this.validateForm.reset();
    for (const key in this.validateForm.controls) {
      this.validateForm.controls[ key ].markAsPristine();
      this.validateForm.controls[ key ].updateValueAndValidity();
    }
  }

  validateConfirmPassword(): void {
    setTimeout(() => this.validateForm.controls.confirm.updateValueAndValidity());
  }

  userNameAsyncValidator = (control: FormControl) => Observable.create((observer: Observer<ValidationErrors>) => {
    setTimeout(() => {
      if (control.value === 'JasonWood') {
        observer.next({ error: true, duplicated: true });
      } else {
        observer.next(null);
      }
      observer.complete();
    }, 1000);
  })

  confirmValidator = (control: FormControl): { [s: string]: boolean } => {
    if (!control.value) {
      return { required: true };
    } else if (control.value !== this.validateForm.controls.password.value) {
      return { confirm: true, error: true };
    }
  }

  constructor(private fb: FormBuilder,private mapService:MapService,) {
    this.validateForm = this.fb.group({
      userName: [ '', [ Validators.required ], [ this.userNameAsyncValidator ] ],
      email   : [ '', [ Validators.email ] ],
      password: [ '', [ Validators.required ] ],
      confirm : [ '', [ this.confirmValidator ] ],
      comment : [ '', [ Validators.required ] ]
    });
  }

  ngOnInit() {
    this.current=0;   
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
