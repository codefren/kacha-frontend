import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { StoreModule } from '@ngrx/store';
import { EffectsModule } from '@ngrx/effects';
import {
    STATEEASYROUTE_FEATURE_KEY,
    initialState as stateEasyrouteInitialState,
    stateEasyrouteReducer,
} from './+state/state-easyroute.reducer';
import { StateEasyrouteEffects } from './+state/state-easyroute.effects';
import { StateEasyrouteFacade } from './+state/state-easyroute.facade';

@NgModule({
    imports: [
        CommonModule,
        StoreModule.forFeature(STATEEASYROUTE_FEATURE_KEY, stateEasyrouteReducer, {
            initialState: stateEasyrouteInitialState,
        }),
        EffectsModule.forFeature([StateEasyrouteEffects]),
    ],
    providers: [StateEasyrouteFacade],
})
export class StateEasyrouteModule {}
