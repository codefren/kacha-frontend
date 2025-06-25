import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProfileSettingsEffects } from './+state/profile-settings.effects';
import { ProfileSettingsFacade } from './+state/profile-settings.facade';
import {
    reducer as profileSettingsReducer,
    PROFILE_SETTINGS_FEATURE_KEY,
} from './+state/profile-settings.reducer';
import { EffectsModule } from '@ngrx/effects';
import { StoreModule } from '@ngrx/store';

@NgModule({
    imports: [
        CommonModule,
        StoreModule.forFeature(PROFILE_SETTINGS_FEATURE_KEY, profileSettingsReducer),
        EffectsModule.forFeature([ProfileSettingsEffects]),
    ],
    providers: [ProfileSettingsFacade],
})
export class StateProfileSettingsModule {}
