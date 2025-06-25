import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { StoreModule } from '@ngrx/store';
import { EffectsModule } from '@ngrx/effects';
import * as fromFilterState from './+state/filter-state.reducer';
import { FilterStateEffects } from './+state/filter-state.effects';
import { StateFilterStateFacade } from './+state/filter-state.facade';

@NgModule({
    imports: [
        CommonModule,
        StoreModule.forFeature(
            fromFilterState.FILTERSTATE_FEATURE_KEY,
            fromFilterState.reducer,
        ),
        EffectsModule.forFeature([FilterStateEffects]),
        StoreModule.forFeature(
            fromFilterState.FILTERSTATE_FEATURE_KEY,
            fromFilterState.reducer,
        ),
    ],
    providers: [StateFilterStateFacade],
})
export class FilterStateModule {}
