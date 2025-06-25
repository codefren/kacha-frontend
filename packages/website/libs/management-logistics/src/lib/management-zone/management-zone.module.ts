import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ManagementZoneComponent } from './management-zone.component';
import { ManagementZoneTableComponent } from './management-zone-table/management-zone-table.component';
import { SharedModule, TimesPipe } from '@optimroute/shared';
import { ManagementZoneFormComponent } from './management-zone-table/management-zone-form/management-zone-form.component';
import { StateDeliveryZonesModule } from '@optimroute/state-delivery-zones';
import { DeliveryZonesSpecificationListComponent } from './delivery-zones-specification-list/delivery-zones-specification-list.component';
import { DeliveryZonesSpecificationFormComponent } from './delivery-zones-specification-form/delivery-zones-specification-form.component';
import { RouterModule } from '@angular/router';
import { ZoneFormComponent } from './management-zone-table/zone-form/zone-form.component';
import { ModalActivateZoneComponent } from './management-zone-table/modal-activate-zone/modal-activate-zone.component';

@NgModule({
  declarations: [
    ManagementZoneComponent, 
    ManagementZoneTableComponent, 
    ManagementZoneFormComponent, 
    DeliveryZonesSpecificationListComponent, 
    DeliveryZonesSpecificationFormComponent, 
    ZoneFormComponent, 
    ModalActivateZoneComponent
  ],
  imports: [
    CommonModule,
    SharedModule,
    StateDeliveryZonesModule,
    RouterModule.forChild([
     
      
      {
        path: 'delivery-zones/specification',
        component: DeliveryZonesSpecificationListComponent,
      },
      {
        path: 'delivery-zones/:id',
        component: ZoneFormComponent,
      },
      
      {
          path: 'delivery-zones/specification/:id',
          component: DeliveryZonesSpecificationFormComponent,
      },
    ]),
  ],
  providers:[TimesPipe],
  entryComponents:[
    ManagementZoneFormComponent,
    ModalActivateZoneComponent
  ]
})
export class ManagementZoneModule { }
