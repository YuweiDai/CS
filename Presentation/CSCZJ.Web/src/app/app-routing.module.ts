import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';


import { OverviewComponent } from './component/statistics/overview/overview.component';
import { PropertyListComponent } from './component/properties/property-list/property-list.component';
import { MapHomeComponent } from './component/map/map-home/map-home.component';
import { AccountListComponent } from './component/systemmanager/account-list/account-list.component';


export const appRoutes: Routes = [
  { path: 'dashboard', component: OverviewComponent },
  //{ path: 'properties', component: PropertyListComponent },
  { path: 'map', component: MapHomeComponent },
  { path: 'manager', component: AccountListComponent },


  { path: '', redirectTo: '/dashboard', pathMatch: 'full' },
]
@NgModule({
  imports: [
    RouterModule.forRoot(appRoutes, { useHash: false }),
  ],
  exports: [RouterModule],
})
export class AppRoutingModule { }
