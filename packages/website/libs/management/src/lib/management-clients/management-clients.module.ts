import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MagementClientsTableComponent } from './magement-clients-table/magement-clients-table.component';
import { ManagementClientsComponent } from './management-clients.component';
import { SharedModule, DurationPipe, ToDayTimePipe } from '@optimroute/shared';

import { NgxMaskModule } from 'ngx-mask';
import { FormClientsComponent } from './form-clients/form-clients.component';
import { RouterModule } from '@angular/router';
import { ModalBadAddressComponent } from './magement-clients-table/modal-bad-address/modal-bad-address.component';
import { ManagementClientsFormComponent } from './form-clients/management-clients-form/management-clients-form.component';
import { ClientsLinkedTableComponent } from './form-clients/clients-linked-table/clients-linked-table.component';
import { ModalConfirmationClientsLinkedComponent } from './form-clients/clients-linked-table/modal-confirmation-clients-linked/modal-confirmation-clients-linked.component';
import { ModalActiveClientComponent } from './magement-clients-table/modal-active-client/modal-active-client.component';
import { ModalFiltersComponent } from './magement-clients-table/modal-filters/modal-filters.component';
import { ModalDirectionsComponent } from './form-clients/modal-directions/modal-directions.component';
import { ModalPhoneComponent } from './form-clients/modal-phone/modal-phone.component';
import { ModalConfirmPhoneComponent } from './form-clients/modal-confirm-phone/modal-confirm-phone.component';
import { ManagenentClientsServiceTypeTableComponent } from './managenent-clients-service-type-table/managenent-clients-service-type-table.component';
import { ManagementFormClientServiceTypeComponent } from './managenent-clients-service-type-table/management-form-client-service-type/management-form-client-service-type.component';
import { ModalObservationsComponent } from './form-clients/modal-observations/modal-observations.component';
import { ScheduleClientsFormComponent } from './form-clients/schedule-clients-form/schedule-clients-form.component';
import { ClientsFileFormComponent } from './form-clients/clients-file-form/clients-file-form.component';
import { ModalChangePasswordComponent } from './form-clients/clients-linked-table/modal-change-password/modal-change-password.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { FilterStateModule } from '../../../../filter-state/src/lib/filter-state.module';
import { ManagementClientsAnalysisTableComponent } from './management-clients-analysis-table/management-clients-analysis-table.component';
import { ManagementFormClientsAnalysisComponent } from './management-clients-analysis-table/management-form-clients-analysis/management-form-clients-analysis.component';
import { ServiceRegistrationComponent } from './management-clients-analysis-table/management-form-clients-analysis/service-registration/service-registration.component';
import { ManagementClientsSettingsComponent } from './management-clients-settings/management-clients-settings.component';
import { DownloadTimesComponent } from './management-clients-settings/download-times/download-times.component';
import { DelaysComponent } from './management-clients-settings/delays/delays.component';
import { UseAndStorageComponent } from './management-clients-settings/use-and-storage/use-and-storage.component';
import { ModalDeleteServiceTypeComponent } from './management-clients-settings/modal-delete-service-type/modal-delete-service-type.component';
import { ClientInformationComponent } from './form-clients/client-information/client-information.component';
import { ModalActivityRegisterComponent } from './form-clients/modal-activity-register/modal-activity-register.component';
import { ClientSettingsComponent } from './form-clients/client-settings/client-settings.component';
import { ClientRouteDataComponent } from './form-clients/client-route-data/client-route-data.component';
import { ModalRegisterTimeComponent } from './form-clients/modal-register-time/modal-register-time.component';
import { DataUpdateComponent } from './management-clients-settings/data-update/data-update.component';
import { ManagementClientsUpdateDataComponent } from './management-clients-update-data/management-clients-update-data.component';
import { ModalClientNewComponent } from './management-clients-update-data/modal-client-new/modal-client-new.component';
import { ClientDuplicateComponent } from './form-clients/client-duplicate/client-duplicate.component';
import { ModalMoveClientComponent } from './form-clients/client-duplicate/modal-move-client/modal-move-client.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ManagementDuplicateControlComponent } from './management-duplicate-control/management-duplicate-control.component';
import { ClientPackagingBalanceComponent } from './form-clients/client-packaging-balance/client-packaging-balance.component';
import { ModalChangeBoxesComponent } from './form-clients/client-packaging-balance/modal-change-boxes/modal-change-boxes.component';


@NgModule({
  declarations: [
    MagementClientsTableComponent, 
    ManagementClientsComponent,
    ModalBadAddressComponent,
    FormClientsComponent,
    ManagementClientsFormComponent,
    ClientsLinkedTableComponent,
    ModalConfirmationClientsLinkedComponent,
    ModalChangePasswordComponent,
    ModalActiveClientComponent,
    ModalFiltersComponent,
    ModalDirectionsComponent,
    ModalPhoneComponent,
    ModalConfirmPhoneComponent,
    ManagenentClientsServiceTypeTableComponent,
    ManagementFormClientServiceTypeComponent,
    ModalObservationsComponent,
    ScheduleClientsFormComponent,
    ClientsFileFormComponent,
    ManagementClientsAnalysisTableComponent,
    ManagementFormClientsAnalysisComponent,
    ServiceRegistrationComponent,
    ManagementClientsSettingsComponent,
    DownloadTimesComponent,
    DelaysComponent,
    UseAndStorageComponent,
    ModalDeleteServiceTypeComponent,
    ClientInformationComponent,
    ModalActivityRegisterComponent,
    ClientSettingsComponent,
    ClientRouteDataComponent,
    ModalRegisterTimeComponent,
    DataUpdateComponent,
    ManagementClientsUpdateDataComponent,
    ModalClientNewComponent,
    ClientDuplicateComponent,
    ModalMoveClientComponent,
    ManagementDuplicateControlComponent,
    ClientPackagingBalanceComponent,
    ModalChangeBoxesComponent
  ],
  imports: [
    CommonModule,
    SharedModule,
    NgbModule,
    FilterStateModule,
    ReactiveFormsModule,
    FormsModule,
    NgxMaskModule.forChild(),
    RouterModule.forChild([
      {
        path: 'clients',
        component: ManagementClientsComponent
      },
      {
        path: 'clients/servies-type',
        component: ManagenentClientsServiceTypeTableComponent
      },
      {
        path: 'clients/analysis',
        component: ManagementClientsAnalysisTableComponent
      },
      {
        path: 'clients/update',
        component: ManagementClientsUpdateDataComponent
      },
      {
        path: 'clients/:id',
        component: FormClientsComponent
      },
      /* {
        path: 'clients/servies-type/:id',
        component: ManagementFormClientServiceTypeComponent,
      }, */
      {
        path: 'clients/analysis/:id',
        component: ManagementFormClientsAnalysisComponent,
      },
      {
        path: 'client-duplicate-control',
        component: ManagementDuplicateControlComponent,
      },
      {
        path: 'client-settings',
        component: ManagementClientsSettingsComponent,
      },
    ]),
  ],
  providers:[DurationPipe, ToDayTimePipe],
  entryComponents:[
    FormClientsComponent, 
    ModalActiveClientComponent, 
    MagementClientsTableComponent, 
    ModalBadAddressComponent, 
    ManagementClientsFormComponent, 
    ModalConfirmationClientsLinkedComponent,
    ModalFiltersComponent,
    ModalDirectionsComponent,
    ModalPhoneComponent,
    ModalConfirmPhoneComponent,
    ModalObservationsComponent,
    ModalChangePasswordComponent,
    ManagementFormClientServiceTypeComponent,
    ModalDeleteServiceTypeComponent,
    ModalActivityRegisterComponent,
    ModalRegisterTimeComponent,
    ModalClientNewComponent,
    ModalMoveClientComponent,
    ModalChangeBoxesComponent
  ],
  exports: []
})
export class ManagementClientsModule { }
