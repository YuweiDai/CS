// import { Component, OnInit ,HostBinding,ViewEncapsulation} from '@angular/core';
// import { slideInDownAnimation } from '../../../animations';
import { Component, OnInit } from '@angular/core';
import { UiTableComponent } from '../../common/ui-table/ui-table.component';
import { LayoutService } from "./../../../services/layoutService";

@Component({
  selector: 'app-property-list',
  templateUrl: './property-list.component.html',
  styleUrls: ['./property-list.component.less'],
  // animations: [ slideInDownAnimation ],
  // encapsulation: ViewEncapsulation.None,
})
export class PropertyListComponent implements OnInit {
  // 路由动画会导致Ui显示问题 暂时注释 
  // @HostBinding('@routeAnimation') routeAnimation = true;
  // @HostBinding('style.display')   display = 'block';
  // @HostBinding('style.position')  position = 'absolute';
  private contentHeight:number;


  constructor(private layoutService:LayoutService){
    this.contentHeight=layoutService.getContentHeight()-70-2;
  }

  ngOnInit() {
  }

}
