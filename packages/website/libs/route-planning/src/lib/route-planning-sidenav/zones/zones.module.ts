import { NgModule } from '@angular/core';
import { ZonesComponent } from './zones.component';
import { SharedModule } from '@optimroute/shared';
import { ZoneComponent } from './zone/zone.component';
import { RoutePlanningSharedModule } from '@optimroute/route-planning/shared';

@NgModule({
    declarations: [ZonesComponent, ZoneComponent],
    imports: [SharedModule, RoutePlanningSharedModule],
    exports: [ZonesComponent, ZoneComponent],
})
export class ZonesModule {}
