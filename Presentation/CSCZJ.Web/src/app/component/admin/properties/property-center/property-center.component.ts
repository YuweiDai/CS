import { Component, OnInit ,ViewEncapsulation } from '@angular/core';
import { LeftmenuComponent } from "../../common/leftmenu/leftmenu.component";
import { LayoutService } from "../../../../services/layoutService";

import { LeftMenuItem } from "../../../../viewModels/layout/LeftMenuItem";

@Component({
  templateUrl: './property-center.component.html',
  styleUrls: ['./property-center.component.less'],
  encapsulation: ViewEncapsulation.None,
})
export class PropertyCenterComponent implements OnInit {
  perfectScrollbarConfig={};
  containerHeight=100;
  menuItems:LeftMenuItem[];

  constructor(private layoutService:LayoutService){
    this.containerHeight=layoutService.getActualScreenSize().height;
    this.containerHeight=layoutService.getContentHeight();  //获取内容高度

    this.menuItems= [
      { icon: "icon-liebiao", title: "资产管理",url:"./",active:true },
      { icon: "icon-shenpi", title: "出租管理",url:"./rentlist",active:false },
      // { icon: "icon-xinzeng", title: "新增资产",url:"./create",active:false },
      { icon: "icon-shenpi", title: "审批管理",url:"./",active:false }
    ];
  }

  ngOnInit() {
  }

}
