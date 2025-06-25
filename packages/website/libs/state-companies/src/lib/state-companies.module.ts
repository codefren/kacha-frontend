import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { STATECOMPANIES_FEATURE_KEY, CompaniesReducer } from './+state/state-companies.reducer';
import { EffectsModule } from '@ngrx/effects';
import { StateCompaniesEffects } from './+state/state-companies.effects';
import { initialState as UserInitialState } from 'libs/state-profile-settings/src/lib/+state/profile-settings.reducer';
import { StoreModule } from '@ngrx/store';
import { StateCompaniesFacade } from './+state/state-companies.facade';
import { BackendModule } from '@optimroute/backend';
@NgModule({
    imports: [
        CommonModule,
        StoreModule.forFeature(STATECOMPANIES_FEATURE_KEY, CompaniesReducer, {
            initialState: UserInitialState,
        }),
        EffectsModule.forFeature([StateCompaniesEffects]),
    ],
    providers: [StateCompaniesFacade],
})
export class StateCompaniesModule {}
