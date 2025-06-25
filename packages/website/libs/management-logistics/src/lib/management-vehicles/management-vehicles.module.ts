import { NgModule } from '@angular/core';
import { ManagementVehiclesComponent } from './management-vehicles.component';
import { ManagementVehiclesTableComponent } from './management-vehicles-table/management-vehicles-table.component';
import { SharedModule } from '@optimroute/shared';
import { StateEasyrouteModule } from '@optimroute/state-easyroute';
import { ConfirmVehicleComponent } from './confirm-vehicle/confirm-vehicle.component';
import { ModalConfirmationVehiclesComponent } from './management-vehicles-table/modal-confirmation-vehicles/modal-confirmation-vehicles.component';
import {
    NgbModule,
    NgbDateParserFormatter,
    NgbDatepickerI18n,
} from '@ng-bootstrap/ng-bootstrap';
import { ModalFormVehiclesComponent } from './management-vehicles-table/modal-form-vehicles/modal-form-vehicles.component';
import {
    Language,
    MomentDateFormatter,
    CustomDatepickerI18n,
} from '../../../../shared/src/lib/util-functions/date-format';
import { DatePipe, KeyValuePipe } from '@angular/common';
import { RouterModule } from '@angular/router';
import { ManagementFormVehiclesComponent } from './management-vehicles-table/management-form-vehicles/management-form-vehicles.component';
import { StateVehiclesModule } from '@optimroute/state-vehicles';
import { ManagementVehiclesServiceTypeTableComponent } from './management-vehicles-service-type-table/management-vehicles-service-type-table.component';
import { ManagementFormVehiclesServiceTypeComponent } from './management-vehicles-service-type-table/management-form-vehicles-service-type/management-form-vehicles-service-type.component';
import { FilterStateModule } from '@easyroute/filter-state';
import { ModalActivateComponent } from './management-vehicles-table/modal-activate/modal-activate.component';
import { GenericInformationComponent } from './management-vehicles-table/management-form-vehicles/generic-information/generic-information.component';
import { AssignmentsComponent } from './management-vehicles-table/management-form-vehicles/assignments/assignments.component';
import { DocumentationComponent } from './management-vehicles-table/management-form-vehicles/documentation/documentation.component';
import { MaintenanceComponent } from './management-vehicles-table/management-form-vehicles/maintenance/maintenance.component';
import { CostsComponent } from './management-vehicles-table/management-form-vehicles/costs/costs.component';
import { VehiclesSettingsComponent } from './management-vehicles-table/vehicles-settings/vehicles-settings.component';
import { ServiceSpecificationComponent } from './management-vehicles-table/vehicles-settings/service-specification/service-specification.component';
import { VehicleTypesComponent } from './management-vehicles-table/vehicles-settings/vehicle-types/vehicle-types.component';
import { ModalAddServiceComponent } from './management-vehicles-table/vehicles-settings/service-specification/modal-add-service/modal-add-service.component';
import { ModalDeleteServiceComponent } from './management-vehicles-table/vehicles-settings/service-specification/modal-delete-service/modal-delete-service.component';
import { ModalAddVehicleTypeComponent } from './management-vehicles-table/vehicles-settings/vehicle-types/modal-add-vehicle-type/modal-add-vehicle-type.component';
import { DigitalAccessoriesComponent } from './management-vehicles-table/vehicles-settings/digital-accessories/digital-accessories.component';
import { MaterialAccessoriesComponent } from './management-vehicles-table/vehicles-settings/material-accessories/material-accessories.component';
import { MandatoryReviewsComponent } from './management-vehicles-table/vehicles-settings/mandatory-reviews/mandatory-reviews.component';
import { SupplementsComponent } from './management-vehicles-table/vehicles-settings/supplements/supplements.component';
import { ModalAddAccesoriesComponent } from './management-vehicles-table/vehicles-settings/digital-accessories/modal-add-accesories/modal-add-accesories.component';
import { ModalAddMandatoryComponent } from './management-vehicles-table/vehicles-settings/mandatory-reviews/modal-add-mandatory/modal-add-mandatory.component';
import { ModalAddMaterialAccessoriesComponent } from './management-vehicles-table/vehicles-settings/material-accessories/modal-add-material-accessories/modal-add-material-accessories.component';
import { ModalAddSuppkementsComponent } from './management-vehicles-table/vehicles-settings/supplements/modal-add-suppkements/modal-add-suppkements.component';
import { ManagementVehiclesAnalysisTableComponent } from './management-vehicles-analysis-table/management-vehicles-analysis-table.component';
import { ManagementVehiclesAnalysisFormComponent } from './management-vehicles-analysis-table/management-vehicles-analysis-form/management-vehicles-analysis-form.component';
import { ManagementVehiclesAnalysisDetailComponent } from './management-vehicles-analysis-table/management-vehicles-analysis-form/management-vehicles-analysis-detail/management-vehicles-analysis-detail.component';
import { ManagementVehiclesAnalysisServiceComponent } from './management-vehicles-analysis-table/management-vehicles-analysis-form/management-vehicles-analysis-service/management-vehicles-analysis-service.component';
import { ManagementVehiclesAnalysisDriverComponent } from './management-vehicles-analysis-table/management-vehicles-analysis-form/management-vehicles-analysis-driver/management-vehicles-analysis-driver.component';
import { ManagementVehiclesAnalysisRepostajeComponent } from './management-vehicles-analysis-table/management-vehicles-analysis-form/management-vehicles-analysis-repostaje/management-vehicles-analysis-repostaje.component';
import { ManagementVehiclesAnalysisRepairsComponent } from './management-vehicles-analysis-table/management-vehicles-analysis-form/management-vehicles-analysis-repairs/management-vehicles-analysis-repairs.component';

@NgModule({
    entryComponents: [
        ConfirmVehicleComponent,
        ModalConfirmationVehiclesComponent,
        ModalFormVehiclesComponent,
        ModalActivateComponent,
        ModalAddServiceComponent,
        ModalDeleteServiceComponent,
        ModalAddVehicleTypeComponent,
        ModalAddAccesoriesComponent,
        ModalAddMandatoryComponent,
        ModalAddMaterialAccessoriesComponent,
        ModalAddSuppkementsComponent,
        ManagementVehiclesAnalysisRepairsComponent
    ],
    declarations: [
        ManagementVehiclesComponent,
        ManagementVehiclesTableComponent,
        ConfirmVehicleComponent,
        ModalConfirmationVehiclesComponent,
        ModalFormVehiclesComponent,
        ManagementFormVehiclesComponent,
        ManagementVehiclesServiceTypeTableComponent,
        ManagementFormVehiclesServiceTypeComponent,
        ModalActivateComponent,
        GenericInformationComponent,
        AssignmentsComponent,
        DocumentationComponent,
        MaintenanceComponent,
        CostsComponent,
        VehiclesSettingsComponent,
        ServiceSpecificationComponent,
        VehicleTypesComponent,
        ModalAddServiceComponent,
        ModalDeleteServiceComponent,
        ModalAddVehicleTypeComponent,
        DigitalAccessoriesComponent,
        MaterialAccessoriesComponent,
        MandatoryReviewsComponent,
        SupplementsComponent,
        ModalAddAccesoriesComponent,
        ModalAddMandatoryComponent,
        ModalAddMaterialAccessoriesComponent,
        ModalAddSuppkementsComponent,
        ManagementVehiclesAnalysisTableComponent,
        ManagementVehiclesAnalysisFormComponent,
        ManagementVehiclesAnalysisDetailComponent,
        ManagementVehiclesAnalysisServiceComponent,
        ManagementVehiclesAnalysisDriverComponent,
        ManagementVehiclesAnalysisRepostajeComponent,
        ManagementVehiclesAnalysisRepairsComponent
    ],
    imports: [
        SharedModule,
        StateEasyrouteModule,
        StateVehiclesModule,
        FilterStateModule,
        NgbModule,
        RouterModule.forChild([
            {
                path: 'vehicles',
                component: ManagementVehiclesComponent,
            },
            {
                path: 'vehicles/servies-type',
                component: ManagementVehiclesServiceTypeTableComponent,
            },
            {
                path: 'vehicles/analysis',
                component: ManagementVehiclesAnalysisTableComponent
            },
            {
                path: 'vehicles/settings',
                component: VehiclesSettingsComponent,
            },
            {
                path: 'vehicles/analysis/:id',
                component: ManagementVehiclesAnalysisFormComponent,
            },
            {
                path: 'vehicles/:id',
                component: ManagementFormVehiclesComponent,
            },
            {
                path: 'vehicles/:id/:redirect',
                component: ManagementFormVehiclesComponent,
            },
            {
                path: 'vehicles/servies-type/:id',
                component: ManagementFormVehiclesServiceTypeComponent,
            },
            {
                path: 'vehicles/settings/:id/:redirect',
                component: VehiclesSettingsComponent,
            },
            {
                path: 'vehicles/settings/:id/:redirect/:client',
                component: VehiclesSettingsComponent,
            },

        ]),
    ],
    providers: [
        KeyValuePipe,
        DatePipe,
        Language,
        { provide: NgbDateParserFormatter, useClass: MomentDateFormatter },
        { provide: NgbDatepickerI18n, useClass: CustomDatepickerI18n },
    ]
})
export class ManagementVehiclesModule {}
