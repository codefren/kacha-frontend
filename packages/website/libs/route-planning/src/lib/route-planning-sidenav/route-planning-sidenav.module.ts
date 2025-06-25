import { NgModule } from '@angular/core';
import { SharedModule } from '@optimroute/shared';
import { RoutePlanningSidenavComponent } from './route-planning-sidenav.component';
import { ZonesModule } from './zones/zones.module';
import { RoutePlanningSharedModule } from '@optimroute/route-planning/shared';
import { RoutePlanningMapComponent } from './route-planning-map/route-planning-map.component';
import { AgmCoreModule } from '@agm/core';
import { AgmJsMarkerClustererModule } from '@agm/js-marker-clusterer';
import { AgmSnazzyInfoWindowModule } from '@agm/snazzy-info-window';
import { AgmOverlays } from 'agm-overlays';
import { KeyValuePipe, CommonModule } from '@angular/common';
import { StateEasyrouteModule } from '@optimroute/state-easyroute';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { StateGeolocationModule } from '@optimroute/state-geolocation';
import { CreateZoneModalComponent } from './create-zone-modal/create-zone-modal.component';


@NgModule({
    declarations: [RoutePlanningSidenavComponent, RoutePlanningMapComponent, CreateZoneModalComponent],
    imports: [
        SharedModule,
        RoutePlanningSharedModule,
        StateEasyrouteModule,
        ZonesModule,
        NgbModule,
        AgmCoreModule,
        AgmJsMarkerClustererModule,
        AgmOverlays,
        AgmSnazzyInfoWindowModule,
        CommonModule,
        StateGeolocationModule
    ],
    providers:[KeyValuePipe],
    exports: [RoutePlanningSidenavComponent, RoutePlanningMapComponent, ZonesModule, CreateZoneModalComponent],
    entryComponents:[CreateZoneModalComponent]
})
export class RoutePlanningSidenavModule {}
