import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HistoryRoutesComponent } from './history-routes.component';
import { SharedModule } from '../../../../shared/src/lib/shared.module';
import { StateRoutePlanningModule } from '../../../../state-route-planning/src/lib/state-route-planning.module';
import { ToDayTimePipe, MomentDateFormatter, CustomDatepickerI18n, Language } from '@optimroute/shared';
import { DistancePipe } from '../../../../shared/src/lib/pipes/distance.pipe';
import { DetailComponent } from '../assigned-routes/detail/detail.component';
import { ModalRoutesComponent } from '../assigned-routes/modal-routes/modal-routes.component';
import { NgbModule, NgbDatepickerI18n, NgbDateParserFormatter } from '@ng-bootstrap/ng-bootstrap';
import { ModalWarningComponent } from './modal-warning/modal-warning.component';
import { ModalConfirmComponent } from './modal-confirm/modal-confirm.component';
import { RouterModule } from '@angular/router';
import { DeliveryDetailsComponent } from '../assigned-routes/delivery-details/delivery-details.component';
import { FilterStateModule } from '@easyroute/filter-state';

@NgModule({
  declarations: [HistoryRoutesComponent, ModalWarningComponent, ModalConfirmComponent],
  imports: [
    CommonModule,
    SharedModule,
    StateRoutePlanningModule,
    NgbModule,
    FilterStateModule,
    RouterModule.forChild([

      {
        path: 'history/:id',
        component: DeliveryDetailsComponent
      }
    ]), 
  ],
  entryComponents: [DetailComponent, ModalRoutesComponent, ModalWarningComponent, ModalConfirmComponent],
  exports: [HistoryRoutesComponent],
  providers: [ToDayTimePipe, DistancePipe, Language,
    {provide: NgbDateParserFormatter, useClass: MomentDateFormatter},
    {provide: NgbDatepickerI18n, useClass: CustomDatepickerI18n}
  ]
})
export class HistoryRoutesModule { }
