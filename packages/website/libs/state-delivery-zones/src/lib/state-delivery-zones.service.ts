import { Injectable } from '@angular/core';
import { Zone, BackendService } from '@optimroute/backend';
import { of } from 'rxjs';
import { tap } from 'rxjs/operators';

@Injectable({
    providedIn: 'root',
})
export class StateDeliveryZonesService {
    loadDeliveryZones() {
        return this.backendService.get('delivery_zone');
    }
    addDeliveryZone(v: Zone) {
        //console.log(v);
        return this.backendService.post('delivery_zone', v);
    }

    updateDeliveryZone(id: string, user: Partial<Zone>) {
        return this.backendService.put('delivery_zone/' + id, user);
    }

    reoderDeliveryZone(id: string, order: number) {
        return this.backendService.put('delivery_zone/' + id + '/order/' + order);
    }
  
  
    constructor(private backendService: BackendService) {}
}
