import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { PropertyCenterComponent } from './property-center/property-center.component';
import { PropertyListComponent } from './property-list/property-list.component';
import { PropertyDetailComponent } from './property-detail/property-detail.component';
import { PropertyCreateComponent } from './property-create/property-create.component';
import { PropertyRentComponent } from './property-rent/property-rent.component';


const propertyCenterRoutes: Routes = [
  {
    path: 'properties',
    component: PropertyCenterComponent,
    children: [
      {
        path: '',
        component: PropertyListComponent,
      },
      {
        path: 'create',
        component: PropertyCreateComponent
      },
      {
        path: 'rent',
        component: PropertyRentComponent
      },
      {
        path: ':id',
        component: PropertyDetailComponent
      },
      {
        path: 'edit/:id',
        component: PropertyCreateComponent
      },
    ]
  }
];

@NgModule({
  imports: [
    RouterModule.forChild(propertyCenterRoutes)
  ],
  exports: [
    RouterModule
  ]
})
export class PropertyCenterRoutingModule { }