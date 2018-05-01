import { NgModule }       from '@angular/core';
import { FormsModule }    from '@angular/forms';
import { CommonModule }   from '@angular/common';

import { NgZorroAntdModule } from 'ng-zorro-antd';

import { PropertyCenterComponent }     from './property-center/property-center.component';
import { PropertyListComponent }       from './property-list/property-list.component';
import { PropertyCreateComponent }     from './property-create/property-create.component';
import { PropertyDetailComponent }     from './property-detail/property-detail.component';

import { LeftmenuComponent } from "../common/leftmenu/leftmenu.component";
import { UiTableComponent } from '../common/ui-table/ui-table.component';

import { PropertyCenterRoutingModule } from './properties-routing.module';

import { PerfectScrollbarModule ,PERFECT_SCROLLBAR_CONFIG,PerfectScrollbarConfigInterface} from 'ngx-perfect-scrollbar';

const DEFAULT_PERFECT_SCROLLBAR_CONFIG: PerfectScrollbarConfigInterface = {
  suppressScrollX: true
};


@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    NgZorroAntdModule,
    PropertyCenterRoutingModule,
    PerfectScrollbarModule,
    
  ],
  declarations: [
    PropertyCenterComponent,
    PropertyListComponent,
    PropertyCreateComponent,
    PropertyDetailComponent,
    UiTableComponent,
    LeftmenuComponent,
  ],
  providers:[
    {
      provide: PERFECT_SCROLLBAR_CONFIG,
      useValue: DEFAULT_PERFECT_SCROLLBAR_CONFIG
    }
  ]
})
export class PropertiesModule {}