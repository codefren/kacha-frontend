import { NgModule } from '@angular/core';
import { ManagementDeliveryPointsTableComponent } from './management-delivery-points-table/management-delivery-points-table.component';
import { ManagementDeliveryPointsComponent } from './management-delivery-points.component';
import { DurationPipe, SharedModule } from '@optimroute/shared';

@NgModule({
    declarations: [
        ManagementDeliveryPointsComponent,
        ManagementDeliveryPointsTableComponent,
    ],
    providers: [DurationPipe],
    imports: [SharedModule],
})
export class ManagementDeliveryPointsModule {}
