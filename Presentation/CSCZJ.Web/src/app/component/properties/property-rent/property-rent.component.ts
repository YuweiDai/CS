import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, ValidationErrors, Validators, ValidatorFn } from '@angular/forms';
import { Observable } from 'rxjs/Observable';
import { Observer } from 'rxjs/Observer';
import { Router, ActivatedRoute, ParamMap } from '@angular/router';

import { NzMessageService, UploadFile, NzNotificationService, NzModalService } from 'ng-zorro-antd';

import { format, differenceInCalendarYears, differenceInCalendarMonths } from 'date-fns'

import { PropertyRentModel, PropertyPictureModel, PropertyFileModel } from '../../../viewModels/Properties/property';

import { PropertyService } from '../../../services/propertyService';
import { ConfigService } from '../../../services/configService';

@Component({
  selector: 'app-property-rent',
  templateUrl: './property-rent.component.html',
  styleUrls: ['./property-rent.component.less']
})
export class PropertyRentComponent implements OnInit {
  private rentId: number;
  private pid: number;
  propertyRent = new PropertyRentModel();
  basicInfoForm: FormGroup;

  private isPropertyLoading = false;
  private optionList = [];
  private selectedProperties = [];

  private timeRange = "";
  private priceControls = [];

  private pictureUploadUrl: string;
  private picureUploading = false;
  private fileUploadUrl: string;
  private fileUploading = false;
  private previewImage = '';
  private previewVisible = false;
  private pictureList = [];
  private fileList = [];

  private isSubmit = false;
  private loading = false;
  dateFormat = 'yyyy/MM/dd';
  constructor(private modalService: NzModalService, private msg: NzMessageService, private notification: NzNotificationService,
    private router: Router, private route: ActivatedRoute, private fb: FormBuilder,
    private configService: ConfigService, private propertyService: PropertyService) {
  }


  ngOnInit() {
    var that = this;
    that.pictureUploadUrl = that.configService.getApiUrl() + "Media/Pictures/Upload";
    that.fileUploadUrl = that.configService.getApiUrl() + "Media/Files/Upload";

    that.pid = parseInt(that.route.snapshot.queryParamMap.get('pid'));
    if (that.pid > -1) {

      that.loading = true;
      //传入待处理的
      that.propertyService.getPropertyById(that.pid, true).subscribe((repsonse: any) => {

        if (repsonse != null && repsonse != undefined && !repsonse.Code) {
          that.optionList.push({
            name: repsonse.name,
            id: that.pid
          });

          that.selectedProperties.push(that.pid);
        }
        that.loading = false;
      });
    }

    that.basicInfoForm = this.fb.group({
      pIds: [that.selectedProperties, [Validators.required]],
      pName: [that.propertyRent.name, [Validators.required]],
      pTimeRange: [that.timeRange, [Validators.required]],
      // pPriceString: [that.propertyRent.priceString, [Validators.required]],
      pRentArea: [that.propertyRent.rentArea, [Validators.required]],
      pRemark: [that.propertyRent.reamrk,]
    });
  }

  //government 搜索实现
  onSearch(value: string): void {
    if (value == "" || value == undefined || value == null) return;
    var that = this;
    this.isPropertyLoading = true;
    this.propertyService.getProcessPropertyByName(value).subscribe(response => {
      that.optionList = response;
      that.isPropertyLoading = false;
    });
  }

  timeRangeChange(): void {
    if (this.timeRange != undefined && this.timeRange != null && this.timeRange != "" && this.timeRange.length > 1) {
      var startDate = this.timeRange[0];
      var endDate = this.timeRange[1];

      var months = differenceInCalendarMonths(endDate, startDate);
      if (months == 0) months = 1;

      //删除原有价格表单
      this.priceControls.forEach(control => {
        this.basicInfoForm.removeControl("pRentYear" + control.index)
      });

      this.priceControls = [];

      for (var i = 1; i <= Math.ceil(months / 12); i++) {
        var d = {
          index: i,
          price: 1
        }
        this.priceControls.push(d);

        //动态增加表单
        this.basicInfoForm.addControl("pRentYear" + i, new FormControl(1, Validators.required));
      }

    } else this.priceControls = [];
  }


  save(submit: boolean): void {
    var that = this;
    var title = "数据错误", content = "";
    var validation = this.basicInfoForm.valid;

    if (!validation) {
      for (const key in this.basicInfoForm.controls) {
        this.basicInfoForm.controls[key].markAsDirty();
        this.basicInfoForm.controls[key].updateValueAndValidity();
        console.log(key);
        console.log(this.basicInfoForm.controls[key].status);
        console.log("___________");
      }

      content = "信息填写不正确";

      this.createNotification("error", title, content, 2000);
    }
    else {
      this.propertyRent.submit = submit;

      //资产Id处理      
      this.propertyRent.ids = "";
      this.selectedProperties.forEach(id => {
        this.propertyRent.ids += id + ";";
      });

      //起止日期处理
      var startDate = this.timeRange[0];
      var endDate = this.timeRange[1];

      this.propertyRent.rentTime = format(startDate, 'YYYY/MM/DD');
      this.propertyRent.backTime = format(endDate, 'YYYY/MM/DD');

      //租金处理
      this.propertyRent.priceString = "";
      this.priceControls.forEach(priceControl => {
        this.propertyRent.priceString += priceControl.price + ";";
      })


      //同步照片信息
      this.propertyRent.rentPictures = [];
      this.pictureList.forEach(element => {
        var ppm = new PropertyPictureModel();
        if (element.uid == element.id) ppm.pictureId = element.id;
        else ppm.pictureId = element.response[0].id;
        this.propertyRent.rentPictures.push(ppm);
      });
      //同步文件信息
      this.propertyRent.rentFiles = [];
      console.log(this.fileList);
      this.fileList.forEach(element => {
        var pfm = new PropertyFileModel();

        if (element.uid == element.id) pfm.fileId = element.id;
        else pfm.fileId = element.response[0].id;
        this.propertyRent.rentFiles.push(pfm);
      });

      if (that.rentId > 0) {

      }
      else {



        this.propertyService.createPropertyRentRecord(this.propertyRent).subscribe((response: any) => {
          if (response.Code) {
            that.createNotification("error", "数据出租申请失败", "错误原因：" + response.message, 0);
            that.isSubmit = false;
          }
          else {
            var id = response.id;
            if (id) {
              this.modalService.confirm({
                nzTitle: '提示',
                nzContent: '数据出租申请成功',
                nzOkText: '继续编辑',
                nzCancelText: '查看资产',
                nzOnOk: function () {
                  that.router.navigate(['../properties/lendedit/' + id]);
                },
                nzOnCancel: function () {
                  that.router.navigate(['../properties/' + id]);
                }
              });
            }
          }
        });
        console.log(this.propertyRent);
      }


    }
  }
  handleAvatarPreview = (file: UploadFile) => {
    this.previewImage = file.url || file.thumbUrl;
    this.previewVisible = true;
  }
  handlePicturesChange(info: any): void {
    var that = this;

    if (info.file.status === 'uploading') {
      this.picureUploading = true;
      return;
    }
    if (info.file.status === 'done') {
      this.picureUploading = false;
    }

  }
  handleFilesChange(info: any): void {

    var that = this;
    const fileList = info.fileList;
    if (info.file.status === 'uploading') {
      that.fileUploading = true;
      return;
    }
    if (info.file.status === 'done') {
      that.fileUploading = false;
      // if (info.file.response) {
      //   info.file.url = info.file.response[0].url;
      // }

      that.fileList = fileList;
    }



  }

  createNotification(type: string, title: string, content: string, time: number): void {
    this.notification.create(type, title, content, { nzDuration: time });
  }
}