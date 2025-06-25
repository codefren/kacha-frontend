import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { VehicleMaintenanceListComponent } from './component/vehicle-maintenance-list/vehicle-maintenance-list.component';
import { VehicleMaintenanceFormComponent } from './component/vehicle-maintenance-form/vehicle-maintenance-form.component';
import { RouterModule } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SharedModule } from '../../../shared/src/lib/shared.module';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { VehicleHistoryListComponent } from './component/vehicle-history-list/vehicle-history-list.component';
import { VehicleHistoryFormComponent } from './component/vehicle-history-form/vehicle-history-form.component';
import { VehicleModalActiveStatusComponent } from './component/vehicle-modal-active-status/vehicle-modal-active-status.component';
import { FilterStateModule } from '../../../filter-state/src/lib/filter-state.module';
import { VehicleMaintenanceSettingsComponent } from './component/vehicle-maintenance-settings/vehicle-maintenance-settings.component';
import { VehicleStatusComponent } from './component/vehicle-maintenance-settings/vehicle-status/vehicle-status.component';
import { PredefinedRevisionsComponent } from './component/vehicle-maintenance-settings/predefined-revisions/predefined-revisions.component';
import { ModalAddPrefefinedComponent } from './component/vehicle-maintenance-settings/predefined-revisions/modal-add-prefefined/modal-add-prefefined.component';
import { ModalDeletePredefinedComponent } from './component/vehicle-maintenance-settings/predefined-revisions/modal-delete-predefined/modal-delete-predefined.component';
import { ModalCheckMaintenanceComponent } from './component/vehicle-maintenance-form/modal-check-maintenance/modal-check-maintenance.component';

@NgModule({
    imports: [
        FormsModule,
        SharedModule,
        NgbModule,
        ReactiveFormsModule,
        FilterStateModule,
        CommonModule,
        RouterModule.forChild([
            {
                path: '',
                component: VehicleMaintenanceListComponent,
            },
            {
                path: 'history',
                component: VehicleHistoryListComponent,
            },
            {
                path: 'settings',
                component: VehicleMaintenanceSettingsComponent,
            },
            {
                path: ':id',
                component: VehicleMaintenanceFormComponent,
            },
            
            {
                path: 'history/:id',
                component: VehicleHistoryFormComponent,
            }
        
        ]),
        TranslateModule.forChild(),
    ],
    declarations: [
        VehicleMaintenanceListComponent, 
        VehicleMaintenanceFormComponent, 
        VehicleHistoryListComponent, 
        VehicleHistoryFormComponent, 
        VehicleModalActiveStatusComponent, 
        VehicleMaintenanceSettingsComponent, 
        VehicleStatusComponent, 
        PredefinedRevisionsComponent, 
        ModalAddPrefefinedComponent, 
        ModalDeletePredefinedComponent, 
        ModalCheckMaintenanceComponent
    ],
    entryComponents :[
        VehicleModalActiveStatusComponent,
        ModalAddPrefefinedComponent,
        ModalDeletePredefinedComponent,
        ModalCheckMaintenanceComponent
    ]
})
export class VehicleMaintenanceModule {}
