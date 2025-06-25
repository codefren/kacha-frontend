import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ManagementDeliveryPointsComponent } from './management-delivery-points/management-delivery-points.component';
import { ManagementDeliveryPointsModule } from './management-delivery-points/management-delivery-points.module';
import { ManagementVehiclesComponent } from './management-vehicles/management-vehicles.component';
import { ManagementVehiclesModule } from './management-vehicles/management-vehicles.module';
import { ManagementZoneComponent } from './management-zone/management-zone.component'
import { ManagementZoneModule } from './management-zone/management-zone.module';
import { RouterModule } from '@angular/router';
import { ManagementLogisticsComponent } from './management-logistics.component';
import { SharedModule } from '@optimroute/shared';
@NgModule({
    imports: [
        CommonModule,
        ManagementDeliveryPointsModule,
        ManagementVehiclesModule,
        ManagementZoneModule,
        SharedModule,
        RouterModule.forChild([
            {
                path: '',
                component: ManagementLogisticsComponent,
                children: [
                    { path: '', redirectTo: 'delivery-zones', pathMatch: 'full' },
                    {
                        path: 'delivery-points',
                        component: ManagementDeliveryPointsComponent,
                    },
                    {
                        path: 'vehicles',
                        component: ManagementVehiclesComponent
                    },
                    {
                        path: 'delivery-zones', component: ManagementZoneComponent
                    }
                ],
            },
        ]),
    ],
    declarations: [ManagementLogisticsComponent],
    providers: []
})
export class ManagementLogisticsModule { }
