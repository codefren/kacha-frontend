import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ModalIntegrationRoutesComponent } from './modal-integration-routes/modal-integration-routes.component';
import { SharedModule } from '../../../../../shared/src/lib/shared.module';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { ModalIntegrationAddPointsComponent } from './modal-integration-add-points/modal-integration-add-points.component';
import { ModalIntegrationConfirmDeleteZonesComponent } from './modal-integration-confirm-delete-zones/modal-integration-confirm-delete-zones.component';
import { ModalIntegrationConfirmDeleteDeliveryPointsComponent } from './modal-integration-confirm-delete-delivery-points/modal-integration-confirm-delete-delivery-points.component';
import { StateDeliveryZonesModule } from '@optimroute/state-delivery-zones';
import { ModalIntegrationUpdateDeliveryPointComponent } from './modal-integration-update-delivery-point/modal-integration-update-delivery-point.component';

@NgModule({
  declarations: [
    ModalIntegrationRoutesComponent, 
    ModalIntegrationAddPointsComponent, 
    ModalIntegrationConfirmDeleteZonesComponent, 
    ModalIntegrationConfirmDeleteDeliveryPointsComponent, 
    ModalIntegrationUpdateDeliveryPointComponent],
  imports: [
    CommonModule,
    SharedModule,
    NgbModule,
    StateDeliveryZonesModule
  ],
  exports:[
    ModalIntegrationRoutesComponent,
    ModalIntegrationAddPointsComponent,
    ModalIntegrationConfirmDeleteZonesComponent,
    ModalIntegrationConfirmDeleteDeliveryPointsComponent
  ],
  entryComponents:[
    ModalIntegrationRoutesComponent,
    ModalIntegrationAddPointsComponent,
    ModalIntegrationConfirmDeleteZonesComponent,
    ModalIntegrationConfirmDeleteDeliveryPointsComponent,
    ModalIntegrationUpdateDeliveryPointComponent]
})
export class FormIntegrationModule { }
