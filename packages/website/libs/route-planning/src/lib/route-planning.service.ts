import { Injectable } from '@angular/core';
import { BackendService } from '@optimroute/backend';
import { of } from 'rxjs';
import { tap, map } from 'rxjs/operators';
import { ImportedDeliveryPointArrayDto } from '@optimroute/shared';
import { OptimizationPreferences } from '@optimroute/backend';

@Injectable({
    providedIn: 'root',
})
export class RoutePlanningService {
    geoCode(addresses: string[]) {
        // console.log(addresses);
        return this.backendService
            .post('/geocode', { addresses })
            .pipe(map(res => res.results));
    }

    createRoutePlanningSession(
        deliveryPoints: ImportedDeliveryPointArrayDto,
        options: any,
    ) {
        return this.backendService.post('route-planning/session', {
            deliveryPoints: deliveryPoints.deliveryPoints,
            options: {
                createDeliveryPoints: options.createDeliveryPoints,
                updateDeliveryPoints: options.updateDeliveryPoints,
                createDeliveryZones: options.createDeliveryZones,
                createUnassignedZone: options.createUnassignedZone,
                setUnassignedZone: options.setUnassignedZone,
            },
        });
    }

    recoverSessionById(sessionId: number){
        return this.backendService.get('route-planning/session/'+ sessionId); 
    }

    recoverRoutePlanningSession(sessionId: number){
        return this.backendService.get('route-planning/route/session/' + sessionId );
    }

    dispatchSocket(){
        return this.backendService.get('dispatch_socket_company');
    }

    constructor(private backendService: BackendService) {}
}
