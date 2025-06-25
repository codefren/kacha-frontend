import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { StoreModule } from '@ngrx/store';
import { EffectsModule } from '@ngrx/effects';
import {
    PREFERENCES_FEATURE_KEY,
    preferencesInitialState,
    preferencesReducer,
} from './+state/preferences.reducer';
import { PreferencesEffects } from './+state/preferences.effects';
import { PreferencesFacade } from './+state/preferences.facade';
@NgModule({
    imports: [
        CommonModule,
        StoreModule.forFeature(PREFERENCES_FEATURE_KEY, preferencesReducer, {
            initialState: preferencesInitialState,
        }),
        EffectsModule.forFeature([PreferencesEffects]),
    ],
    providers: [PreferencesFacade],
})
export class StatePreferencesModule {}
