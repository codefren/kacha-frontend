import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { EffectsModule } from '@ngrx/effects';
import { STATEPOINTS_FEATURE_KEY, statePointsReducer, initialStatePoints } from './+state/state-points.reducer';
import { StatePointsEffects } from './+state/state-points.effects';
import { StoreModule } from '@ngrx/store';
import { StatePointsFacade } from './+state/state-points.facade';
@NgModule({
    imports: [
        CommonModule,
        StoreModule.forFeature(STATEPOINTS_FEATURE_KEY, statePointsReducer, {
            initialState: initialStatePoints
        }),
        EffectsModule.forFeature([StatePointsEffects]),
    ],
    providers: [StatePointsFacade]
})
export class StatePointsModule {}
