import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, ValidationErrors, Validators, ValidatorFn } from '@angular/forms';
import { Observable } from 'rxjs/Observable';
import { Observer } from 'rxjs/Observer';
import { Router, ActivatedRoute, ParamMap } from '@angular/router';

import { NzMessageService, UploadFile, NzNotificationService, NzModalService } from 'ng-zorro-antd';

import { format, compareAsc } from 'date-fns'

import { PropertyRentModel, PropertyPictureModel, PropertyFileModel } from '../../../viewModels/Properties/property';

import { MapService } from '../../../services/map/mapService';
import { PropertyService } from '../../../services/propertyService';
import { GovernmentService } from '../../../services/governmentService';
import { ConfigService } from '../../../services/configService';

@Component({
  selector: 'app-property-rent',
  templateUrl: './property-rent.component.html',
  styleUrls: ['./property-rent.component.less']
})
export class PropertyRentComponent implements OnInit {
  propertyRent:PropertyRentModel;
  basicInfoForm: FormGroup;

  constructor(private modalService: NzModalService, private msg: NzMessageService, private notification: NzNotificationService,
    private router: Router, private route: ActivatedRoute, private fb: FormBuilder,
    private mapService: MapService, private configService: ConfigService, private propertyService: PropertyService, private governmentService: GovernmentService) {


    this.basicInfoForm = this.fb.group({
      pType: ['', [Validators.required]],
      pAddress: ['', [Validators.required]],
      pFloor: [''],
      pFourToStation: [''],
      pGetedDate: ['', [Validators.required]],
      pGetModeId: ['', [Validators.required]],
      pIsAdmission: ['', [Validators.required]],

      //产权信息
      pRegisterEstate: ['', [Validators.required]],
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

      pDescription: ['',]
    });
  }


  ngOnInit() {
  }

}
