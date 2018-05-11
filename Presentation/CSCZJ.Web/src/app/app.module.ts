import { NgModule } from '@angular/core'
import { FormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser'
import { RouterModule } from '@angular/router'
import { HttpModule } from '@angular/http'
import { AppRoutingModule } from './/app-routing.module'
import { BrowserAnimationsModule } from '@angular/platform-browser/animations'

import { NgZorroAntdModule } from 'ng-zorro-antd';
import { NgxEchartsModule } from 'ngx-echarts';

import { AppComponent } from './app.component';
import { HeaderComponent } from './layout/header/header.component';
import { FooterComponent } from './layout/footer/footer.component';
import { OverviewComponent } from './component/statistics/overview/overview.component';
import { PropertiesModule } from './component/properties/properties.module';
import { MapHomeComponent } from './component/map/map-home/map-home.component';
import { AccountListComponent } from './component/systemmanager/account-list/account-list.component';


import { PropertyService } from "./services/propertyService";
import { MapService } from "./services/map/mapService";
import { LogService } from "./services/logService";
import { ConfigService } from "./services/configService";
import { LayoutService } from "./services/layoutService";

import { PerfectScrollbarModule ,PERFECT_SCROLLBAR_CONFIG,PerfectScrollbarConfigInterface} from 'ngx-perfect-scrollbar';

const DEFAULT_PERFECT_SCROLLBAR_CONFIG: PerfectScrollbarConfigInterface = {
  suppressScrollX: true
};


@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    FooterComponent,
    OverviewComponent,
    MapHomeComponent,
    AccountListComponent,
    
  ],
  imports: [
    FormsModule,
    BrowserModule,
    BrowserAnimationsModule,
    RouterModule,    
    
    NgZorroAntdModule.forRoot(),
    NgxEchartsModule,

    PerfectScrollbarModule,
    PropertiesModule,    
    AppRoutingModule,
    
  ],
  providers: [
    {
      provide: PERFECT_SCROLLBAR_CONFIG,
      useValue: DEFAULT_PERFECT_SCROLLBAR_CONFIG
    },
    PropertyService,
    MapService,
    LogService,
    ConfigService,
    LayoutService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
