import { NgModule } from '@angular/core';
import { SharedModule, Language, MomentDateFormatter, CustomDatepickerI18n, DurationPipe } from '@optimroute/shared';
import { EditDeliveryPointComponent } from './edit-delivery-point/edit-delivery-point.component';
import { RoutePlanningActionsComponent } from './route-planning-actions/route-planning-actions.component';
import { RoutePlanningOptionsModule } from './route-planning-options/route-planning-options.module';
import { RoutePlanningPanelComponent } from './route-planning-panel/route-planning-panel.component';
import { RoutePlanningRecalculateRouteComponent } from './route-planning-recalculate-route/route-planning-recalculate-route.component';
import { RoutePlanningTableComponent } from './route-planning-table/route-planning-table.component';
import { RoutePlanningInfoComponent } from './route-planning-info/route-planning-info.component';
import { RoutePlanningSubzonesComponent } from './route-planning-subzones/route-planning-subzones.component';
import { ExportDialogComponent } from './export-dialog/export-dialog.component';
import { PrintDialogComponent } from './print-dialog/print-dialog.component';
import { RoutePlanningRoutePanelComponent } from './route-planning-route-panel/route-planning-route-panel.component';
import { RecalculateRoute as RecalculateRouteComponent } from './recalculate-route/recalculate-route.component';
import { StatePreferencesModule } from '@optimroute/state-preferences'
import { SelectDateComponent } from './select-date/select-date.component'
import { NgbModule, NgbDateParserFormatter, NgbDatepickerI18n } from '@ng-bootstrap/ng-bootstrap';
import { ManagementVehiclesModule } from '@optimroute/management-logistics'
import { ModalDeliveryPointsComponent } from './modal-delivery-points/modal-delivery-points.component';
import { ChangeRouteModalComponent } from './change-route-modal/change-route-modal.component';
import { MoveMultipleDeliveryPointComponent } from './move-multiple-delivery-point/move-multiple-delivery-point.component';
import { MoveMultipleDeliveryPointOptimizedComponent } from './move-multiple-delivery-point-optimized/move-multiple-delivery-point-optimized.component';
import { ModalDeliveryPointNotSourceComponent } from './modal-delivery-point-not-source/modal-delivery-point-not-source.component';
import { ResumeRouteModalComponent } from './resume-route-modal/resume-route-modal.component';
import { ServiceTypeVehicleComponent } from './route-planning-options/zone-vehicles/service-type-vehicle/service-type-vehicle.component';
import { AddCrossDockingComponent } from './route-planning-options/zone-vehicles/add-cross-docking/add-cross-docking.component';
@NgModule({
    imports: [SharedModule, RoutePlanningOptionsModule, StatePreferencesModule, NgbModule, ManagementVehiclesModule ],
    declarations: [
        RoutePlanningActionsComponent,
        RoutePlanningPanelComponent,
        RoutePlanningInfoComponent,
        RoutePlanningTableComponent,
        RoutePlanningRecalculateRouteComponent,
        EditDeliveryPointComponent,
        RoutePlanningSubzonesComponent,
        ExportDialogComponent,
        PrintDialogComponent,
        RoutePlanningRoutePanelComponent,
        RecalculateRouteComponent,
        SelectDateComponent,
        ModalDeliveryPointsComponent,
        ChangeRouteModalComponent,
        MoveMultipleDeliveryPointComponent,
        MoveMultipleDeliveryPointOptimizedComponent,
        ModalDeliveryPointNotSourceComponent,
        ResumeRouteModalComponent,
        ServiceTypeVehicleComponent,
        AddCrossDockingComponent
    ],
    entryComponents: [
        EditDeliveryPointComponent,
        ExportDialogComponent,
        PrintDialogComponent,
        SelectDateComponent,
        ModalDeliveryPointsComponent,
        ChangeRouteModalComponent,
        MoveMultipleDeliveryPointComponent,
        MoveMultipleDeliveryPointOptimizedComponent,
        ModalDeliveryPointNotSourceComponent,
        ResumeRouteModalComponent,
        ServiceTypeVehicleComponent,
        AddCrossDockingComponent
    ],
    exports: [
        RoutePlanningActionsComponent,
        RoutePlanningPanelComponent,
        RoutePlanningInfoComponent,
        RoutePlanningOptionsModule,
        RoutePlanningTableComponent,
        RoutePlanningRecalculateRouteComponent,
        EditDeliveryPointComponent,
        RoutePlanningSubzonesComponent,
        ExportDialogComponent,
        PrintDialogComponent,
        RoutePlanningRoutePanelComponent,
        RecalculateRouteComponent,
        SelectDateComponent,
        ModalDeliveryPointsComponent,
        ChangeRouteModalComponent,
        MoveMultipleDeliveryPointComponent,
        MoveMultipleDeliveryPointOptimizedComponent,
        ModalDeliveryPointNotSourceComponent,
        ResumeRouteModalComponent,
        ServiceTypeVehicleComponent,
        AddCrossDockingComponent
    ],
    providers: [Language,
        {provide: NgbDateParserFormatter, useClass: MomentDateFormatter},
        { provide: NgbDatepickerI18n, useClass: CustomDatepickerI18n },
        DurationPipe,
        
    ]
})
export class RoutePlanningSharedModule {}
