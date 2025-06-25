import { CommonModule, DatePipe } from '@angular/common';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { ErrorDialogComponent, SharedModule, Language, MomentDateFormatter, CustomDatepickerI18n } from '@optimroute/shared';
import { StatePreferencesModule } from '@optimroute/state-preferences';
import { StateRoutePlanningModule } from '@optimroute/state-route-planning';
import { TranslateModule } from '@ngx-translate/core';
import { RoutePlanningSidenavModule } from './route-planning-sidenav/route-planning-sidenav.module';
import { ZonesComponent } from './route-planning-sidenav/zones/zones.component';
import { ZonesModule } from './route-planning-sidenav/zones/zones.module';
import { RoutePlanningToolbarComponent } from './route-planning-toolbar/route-planning-toolbar.component';
import { RoutePlanningComponent } from './route-planning.component';
import { RoutePlanningService } from './route-planning.service';
import { RoutePlanningSharedModule } from '@optimroute/route-planning/shared';
import { StateEasyrouteModule } from '@optimroute/state-easyroute';
import { ModalIntegrationComponent } from './route-planning-toolbar/modal-integration/modal-integration.component';
import { ModalRecoverOptimizationComponent } from './route-planning-toolbar/modal-recover-optimization/modal-recover-optimization.component';
import { SaveRouteComponent } from './route-planning-toolbar/save-route/save-route.component';
import { StateVehiclesModule } from '@optimroute/state-vehicles';
import { NgbModule, NgbDateParserFormatter, NgbDatepickerI18n } from '@ng-bootstrap/ng-bootstrap';
import { ModalIntegrationRoutesComponent } from './route-planning-toolbar/modal-integration-routes/modal-integration-routes.component';
import { ModalDeliveryPointPendingComponent } from './route-planning-toolbar/modal-delivery-point-pending/modal-delivery-point-pending.component';
import { ModalAutomaticOptimizationComponent } from './route-planning-toolbar/modal-automatic-optimization/modal-automatic-optimization.component';
import { ModalPointPendingComponent } from './route-planning-toolbar/modal-point-pending/modal-point-pending.component';
import { VisitsPlanningComponent } from './route-planning-toolbar/visits-planning/visits-planning.component';
import { ModalMultiIntegrationComponent } from './route-planning-toolbar/modal-multi-integration/modal-multi-integration.component';
import { FinishAssignateComponent } from './route-planning-toolbar/finish-assignate/finish-assignate.component';
import { ModalLoadTemplateComponent } from './route-planning-toolbar/modal-load-template/modal-load-template.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
@NgModule({
    imports: [
        ZonesModule,
        StateRoutePlanningModule,
        StatePreferencesModule,
        StateEasyrouteModule,
        StateVehiclesModule,
        RoutePlanningSidenavModule,
        NgbModule,
        FormsModule,
        ReactiveFormsModule,
        CommonModule,
        SharedModule,
        NgbModule,
        RouterModule.forChild([
            {
                path: '',
                component: RoutePlanningComponent,
                children: [{ path: '', component: ZonesComponent }],
            },
        ]),
        TranslateModule.forChild(),
        RoutePlanningSharedModule,
    ],
    providers: [RoutePlanningService ,DatePipe, Language,
        {provide: NgbDateParserFormatter, useClass: MomentDateFormatter},
        {provide: NgbDatepickerI18n, useClass: CustomDatepickerI18n}],
    declarations: [
        RoutePlanningToolbarComponent, 
        RoutePlanningComponent, 
        ModalIntegrationComponent, 
        ModalRecoverOptimizationComponent, 
        SaveRouteComponent, 
        ModalIntegrationRoutesComponent, 
        ModalDeliveryPointPendingComponent, 
        ModalAutomaticOptimizationComponent, 
        ModalPointPendingComponent, 
        VisitsPlanningComponent, 
        ModalMultiIntegrationComponent, 
        FinishAssignateComponent, 
        ModalLoadTemplateComponent
    ],
    entryComponents: [
        ErrorDialogComponent, 
        ModalIntegrationComponent, 
        ModalRecoverOptimizationComponent, 
        SaveRouteComponent, 
        ModalIntegrationRoutesComponent, 
        ModalDeliveryPointPendingComponent, 
        ModalAutomaticOptimizationComponent, 
        ModalPointPendingComponent, 
        VisitsPlanningComponent, 
        ModalMultiIntegrationComponent, 
        FinishAssignateComponent,
        ModalLoadTemplateComponent
    ],
})
export class RoutePlanningModule {}
