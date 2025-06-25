import { NgModule, Input } from '@angular/core';
import { SharedModule } from '@optimroute/shared';
import { RoutePlanningOptionsComponent } from './route-planning-options.component';
import { RouteDeliveryScheduleComponent } from './route-delivery-schedule/route-delivery-schedule.component';
import { ZoneVehiclesComponent } from './zone-vehicles/zone-vehicles.component';
import { MatChipsModule } from '@angular/material';
import { AddVehiclesDialogComponent } from './zone-vehicles/add-vehicles-dialog/add-vehicles-dialog.component';
import { TranslateModule } from '@ngx-translate/core';
import { OptimizationParametersComponent } from './optimization-parameters/optimization-parameters.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { RouteVehicleComponent } from './route-vehicle/route-vehicle.component';
@NgModule({
    declarations: [
        RoutePlanningOptionsComponent,
        RouteDeliveryScheduleComponent,
        RoutePlanningOptionsComponent,
        ZoneVehiclesComponent,
        AddVehiclesDialogComponent,
        OptimizationParametersComponent,
        RouteVehicleComponent
    ],
    imports: [SharedModule, MatChipsModule, TranslateModule.forChild()],
    exports: [
        RoutePlanningOptionsComponent,
        RouteDeliveryScheduleComponent,
        ZoneVehiclesComponent,
        AddVehiclesDialogComponent,
        NgbModule,
        MatChipsModule,
        OptimizationParametersComponent,
        RouteVehicleComponent
    ],
    entryComponents: [AddVehiclesDialogComponent],
})
export class RoutePlanningOptionsModule {}
