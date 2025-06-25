import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { StoreModule } from '@ngrx/store';
import { EffectsModule } from '@ngrx/effects';
import {
    VEHICLES_FEATURE_KEY,
    initialState as vehiclesInitialState,
    vehiclesReducer,
} from './+state/vehicles.reducer';
import { VehiclesEffects } from './+state/vehicles.effects';
import { VehiclesFacade } from './+state/vehicles.facade';
import { SharedModule } from '@optimroute/shared';

@NgModule({
    imports: [
        CommonModule,
        SharedModule,
        StoreModule.forFeature(VEHICLES_FEATURE_KEY, vehiclesReducer, {
            initialState: vehiclesInitialState,
        }),
        EffectsModule.forFeature([VehiclesEffects]),
    ],
    providers: [VehiclesFacade],
})
export class StateVehiclesModule {}
