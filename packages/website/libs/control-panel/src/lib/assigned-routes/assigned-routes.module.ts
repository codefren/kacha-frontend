import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AssignedRoutesComponent } from './assigned-routes.component';
import { SharedModule, ToDayTimePipe, DistancePipe, Language, MomentDateFormatter, CustomDatepickerI18n } from '@optimroute/shared';
import { StateRoutePlanningModule } from '@optimroute/state-route-planning';
import { DetailComponent } from './detail/detail.component';
import { ModalRoutesComponent } from './modal-routes/modal-routes.component';
import { ChangeVehiclesDialogComponent } from './change-vehicles-dialog/change-vehicles-dialog.component'
import { NgbModule, NgbDateParserFormatter, NgbDatepickerI18n } from '@ng-bootstrap/ng-bootstrap';
import { ModalConfirmEndRouteComponent } from './modal-confirm-end-route/modal-confirm-end-route.component';
import { ModalWarningComponent } from './modal-warning/modal-warning.component';
import { DeliveryDetailsComponent } from './delivery-details/delivery-details.component';
import { RouterModule } from '@angular/router';
import { ChangeDriverDialogComponent } from './change-driver-dialog/change-driver-dialog.component';
import { FilterStateModule } from '@easyroute/filter-state'
import { ModalPostponedClientComponent } from './delivery-details/modal-postponed-client/modal-postponed-client.component';
import { ModalCreateRetainerRouteComponent } from './modal-create-retainer-route/modal-create-retainer-route.component';
@NgModule({
  declarations: [
    AssignedRoutesComponent,
    DetailComponent,
    ModalRoutesComponent,
    ChangeVehiclesDialogComponent,
    ModalConfirmEndRouteComponent,
    ModalWarningComponent,
    DeliveryDetailsComponent,
    ChangeDriverDialogComponent,
    ModalPostponedClientComponent,
    ModalCreateRetainerRouteComponent
  ],
  imports: [
    CommonModule,
    SharedModule,
    StateRoutePlanningModule,
    FilterStateModule,
    NgbModule,
    RouterModule.forChild([

      {
        path: 'assigned/:id',
        component: DeliveryDetailsComponent,
    
      },
      {
        path: 'assigned/:id/:redirect',
        component: DeliveryDetailsComponent
    },
    ]), 
  ],
  entryComponents: [
    DetailComponent,
    ModalRoutesComponent,
    ChangeVehiclesDialogComponent,
    ModalConfirmEndRouteComponent,
    ModalWarningComponent,
    ChangeDriverDialogComponent,
    ModalPostponedClientComponent,
    ModalCreateRetainerRouteComponent
  ],
  exports: [AssignedRoutesComponent, DetailComponent,DeliveryDetailsComponent,ModalCreateRetainerRouteComponent],
  providers: [ToDayTimePipe, DistancePipe,  Language,
    { provide: NgbDateParserFormatter, useClass: MomentDateFormatter },
    { provide: NgbDatepickerI18n, useClass: CustomDatepickerI18n }
  ]
   
})
export class AssignedRoutesModule { }
