import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { StoreModule } from '@ngrx/store';
import { EffectsModule } from '@ngrx/effects';
import * as fromStateGeolocation from './+state/state-geolocation.reducer';
import { StateGeolocationEffects } from './+state/state-geolocation.effects';
import { GeolocationFacade } from './+state/state-geolocation.facade';
import { WebSocketService } from './state-geolocation.websocket';
import { ProfileSettingsFacade } from '@optimroute/state-profile-settings';
@NgModule({
    imports: [
        CommonModule,
        StoreModule.forFeature(
            fromStateGeolocation.STATEGEOLOCATION_FEATURE_KEY,
            fromStateGeolocation.reducer,
        ),
        EffectsModule.forFeature([StateGeolocationEffects]),
    ],
    providers: [GeolocationFacade, WebSocketService, StateGeolocationEffects, ProfileSettingsFacade ],
})
export class StateGeolocationModule {}
