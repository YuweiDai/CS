import { NgModule } from '@angular/core'
import { FormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser'
import { RouterModule } from '@angular/router'
import { HttpModule } from '@angular/http'
import { AppRoutingModule } from './/app-routing.module'
import { BrowserAnimationsModule } from '@angular/platform-browser/animations'

import { NgZorroAntdModule } from 'ng-zorro-antd';
import { AdminModule } from "./component/admin/admin.module";
import { PassportModule } from "./component/passport/passport.module";


import { AppComponent } from './app.component';

import { LogService } from "./services/logService";
import { ConfigService } from "./services/configService";
import { LayoutService } from "./services/layoutService";
import { AuthInterceptorService, AuthService, TokensManagerService } from "./services/passportService";


@NgModule({
  declarations: [
    AppComponent,
  ],
  imports: [
    FormsModule,
    BrowserModule,
    BrowserAnimationsModule,
    RouterModule,
    NgZorroAntdModule.forRoot(),
    AdminModule,
    PassportModule,
    AppRoutingModule,
  ],
  providers: [
    LogService,
    ConfigService,
    LayoutService,
    AuthInterceptorService, AuthService, TokensManagerService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
