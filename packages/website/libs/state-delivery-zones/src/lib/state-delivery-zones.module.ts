import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { StoreModule } from '@ngrx/store';
import { EffectsModule } from '@ngrx/effects';
import {
    DELIVERYZONES_FEATURE_KEY,
    initialState as deliveryZonesInitialState,
    deliveryZonesReducer,
} from './+state/delivery-zones.reducer';
import { DeliveryZonesEffects } from './+state/delivery-zones.effects';
import { StateDeliveryZonesFacade } from './+state/delivery-zones.facade';

@NgModule({
    imports: [
        CommonModule,
        StoreModule.forFeature(DELIVERYZONES_FEATURE_KEY, deliveryZonesReducer, {
            initialState: deliveryZonesInitialState,
        }),
        EffectsModule.forFeature([DeliveryZonesEffects]),
    ],
    providers: [StateDeliveryZonesFacade],
})
export class StateDeliveryZonesModule {}
