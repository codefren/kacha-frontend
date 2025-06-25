import { Injectable } from '@angular/core';

import { select, Store } from '@ngrx/store';

import { deliveryZonesQuery } from './delivery-zones.selectors';
import { LoadDeliveryZones, Logout, AddDeliveryZones, UpdateDeliveryZones, ReorderDeliveryZones } from './delivery-zones.actions';
import { DeliveryZonesState } from './delivery-zones.reducer';
import { Zone } from '@optimroute/backend';

@Injectable()
export class StateDeliveryZonesFacade {
    state$ = this.store.pipe(select(deliveryZonesQuery.getState));
    loaded$ = this.store.pipe(select(deliveryZonesQuery.getLoaded));
    loading$ = this.store.pipe(select(deliveryZonesQuery.getLoading));
    updated$ = this.store.pipe(select(deliveryZonesQuery.getUpdated));
    added$ = this.store.pipe(select(deliveryZonesQuery.getAdded));
    updating$ = this.store.pipe(select(deliveryZonesQuery.getUpdating));
    allDeliveryZones$ = this.store.pipe(select(deliveryZonesQuery.getAllDeliveryZones));
    selectedDeliveryZones$ = this.store.pipe(
        select(deliveryZonesQuery.getSelectedDeliveryZones),
    );

    constructor(private store: Store<DeliveryZonesState>) {}

    loadAll() {
        this.store.dispatch(new LoadDeliveryZones());
    }
    logout(){
        this.store.dispatch(new Logout());
    }
    addDeliveryZone(u: Zone) {
        this.store.dispatch(new AddDeliveryZones({ zone: u }));
    }

    editDeliveryZone(id: string, u: Partial<Zone>) {
        this.store.dispatch(new UpdateDeliveryZones({ id, zone: u }));
    }

    reorderZone(id: string, order: number){
        this.store.dispatch(new ReorderDeliveryZones({ id, order: order }));
    }

}
